<?php

namespace App\Http\Controllers\Apps;

use App\Exceptions\PaymentGatewayException;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\PaymentSetting;
use App\Models\Product;
use App\Models\Receivable;
use App\Models\Transaction;
use App\Services\Payments\PaymentGatewayManager;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravolt\Indonesia\Models\Province;

class TransactionController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        $userId = auth()->user()->id;

        // Get active cart items (not held)
        $carts = Cart::with('product')
            ->where('cashier_id', $userId)
            ->active()
            ->latest()
            ->get();

        // Get held carts grouped by hold_id
        $heldCarts = Cart::with('product:id,title,sell_price,image')
            ->where('cashier_id', $userId)
            ->held()
            ->get()
            ->groupBy('hold_id')
            ->map(function ($items, $holdId) {
                $first = $items->first();

                return [
                    'hold_id' => $holdId,
                    'label' => $first->hold_label,
                    'held_at' => $first->held_at?->toISOString(),
                    'items_count' => $items->sum('qty'),
                    'total' => $items->sum('price'),
                ];
            })
            ->values();

        // get all customers
        $customers = Customer::latest()->get();

        // get all products with categories for product grid
        $products = Product::with('category:id,name')
            ->select('id', 'barcode', 'title', 'description', 'image', 'buy_price', 'sell_price', 'stock', 'category_id')
            ->where('stock', '>', 0)
            ->orderBy('title')
            ->get();

        // get all categories
        $categories = \App\Models\Category::select('id', 'name', 'image')
            ->orderBy('name')
            ->get();

        $paymentSetting = PaymentSetting::first();

        $carts_total = 0;
        foreach ($carts as $cart) {
            $carts_total += $cart->price;
        }

        $defaultGateway = $paymentSetting?->default_gateway ?? 'cash';
        if (
            $defaultGateway !== 'cash'
            && (! $paymentSetting || ! $paymentSetting->isGatewayReady($defaultGateway))
        ) {
            $defaultGateway = 'cash';
        }

        // Get active bank accounts for bank transfer
        $bankAccounts = \App\Models\BankAccount::active()->ordered()->get();

        $provinces = Province::select('code', 'name')->orderBy('name')->get();
        
        // Active Vouchers
        $activeVouchers = \App\Models\Voucher::where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereRaw('quota > used_count')
            ->get();

        return Inertia::render('Dashboard/Transactions/Index', [
            'carts' => $carts,
            'carts_total' => $carts_total,
            'heldCarts' => $heldCarts,
            'customers' => $customers,
            'products' => $products,
            'active_vouchers' => $activeVouchers,
            'categories' => $categories,
            'paymentGateways' => $paymentSetting?->enabledGateways() ?? [],
            'defaultPaymentGateway' => $defaultGateway,
            'bankAccounts' => $bankAccounts,
            'provinces' => $provinces,
        ]);
    }

    /**
     * searchProduct
     *
     * @param  mixed  $request
     * @return void
     */
    public function searchProduct(Request $request)
    {
        // find product by barcode
        $product = Product::where('barcode', $request->barcode)->first();

        if ($product) {
            return response()->json([
                'success' => true,
                'data' => $product,
            ]);
        }

        return response()->json([
            'success' => false,
            'data' => null,
        ]);
    }

    /**
     * addToCart
     *
     * @param  mixed  $request
     * @return void
     */
    // public function addToCart(Request $request)
    // {
    //     // Cari produk berdasarkan ID yang diberikan
    //     $product = Product::whereId($request->product_id)->first();

    //     // Jika produk tidak ditemukan, redirect dengan pesan error
    //     if (! $product) {
    //         return redirect()->back()->with('error', 'Product not found.');
    //     }

    //     // Cek stok produk
    //     if ($product->stock < $request->qty) {
    //         return redirect()->back()->with('error', 'Out of Stock Product!.');
    //     }

    //     // Cek keranjang
    //     $cart = Cart::with('product')
    //         ->where('product_id', $request->product_id)
    //         ->where('cashier_id', auth()->user()->id)
    //         ->first();

    //     if ($cart) {
    //         // Tingkatkan qty
    //         $cart->increment('qty', $request->qty);

    //         // Jumlahkan harga * kuantitas
    //         $cart->price = $cart->product->sell_price * $cart->qty;

    //         $cart->save();
    //     } else {
    //         // Insert ke keranjang
    //         Cart::create([
    //             'cashier_id' => auth()->user()->id,
    //             'product_id' => $request->product_id,
    //             'qty'        => $request->qty,
    //             'price'      => $request->sell_price * $request->qty,
    //         ]);
    //     }

    //     return redirect()->route('transactions.index')->with('success', 'Product Added Successfully!.');
    // }

    public function addToCart(Request $request)
    {
        // Cari produk berdasarkan ID
        $product = Product::whereId($request->product_id)->first();

        if (! $product) {
            return redirect()->back()->with('error', 'Product not found.');
        }

        // Cek keranjang milik kasir yang sedang login
        $cart = Cart::with('product')
            ->where('product_id', $request->product_id)
            ->where('cashier_id', auth()->user()->id)
            ->first();

        // Tentukan total qty yang diinginkan (qty lama di keranjang + qty baru dari request)
        $currentCartQty = $cart ? $cart->qty : 0;
        $totalRequestedQty = $currentCartQty + $request->qty;

        // VALIDASI: Cek apakah total permintaan melebihi stok fisik di database
        if ($product->stock < $totalRequestedQty) {
            // return response()->json('x');
            return back()->withErrors([
                'message' => 'Stok tidak mencukupi. Tersedia: '.$product->stock,
            ]);
        }

        if ($cart) {
            // Jika item sudah ada, update jumlahnya
            $cart->qty = $totalRequestedQty;
            // Hitung ulang total harga berdasarkan qty terbaru
            $cart->price = $product->sell_price * $cart->qty;
            $cart->save();
        } else {
            // Jika item belum ada, buat record baru
            Cart::create([
                'cashier_id' => auth()->user()->id,
                'product_id' => $request->product_id,
                'qty' => $request->qty,
                'price' => $product->sell_price * $request->qty,
            ]);
        }

        return redirect()->route('transactions.index')->with('success', 'Product Added Successfully!.');
    }

    /**
     * destroyCart
     *
     * @param  mixed  $request
     * @return void
     */
    public function destroyCart($cart_id)
    {
        $cart = Cart::with('product')->whereId($cart_id)->first();

        if ($cart) {
            $cart->delete();

            return back();
        } else {
            // Handle case where no cart is found (e.g., redirect with error message)
            return back()->withErrors(['message' => 'Cart not found']);
        }

    }

    /**
     * updateCart - Update cart item quantity
     *
     * @param  mixed  $request
     * @param  int  $cart_id
     * @return void
     */
    // public function updateCart(Request $request, $cart_id)
    // {
    //     $request->validate([
    //         'qty' => 'required|integer|min:1',
    //     ]);

    //     $cart = Cart::with('product')->whereId($cart_id)
    //         ->where('cashier_id', auth()->user()->id)
    //         ->first();

    //     if (! $cart) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Cart item not found',
    //         ], 404);
    //     }

    //     // Check stock availability
    //     if ($cart->product->stock < $request->qty) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Stok tidak mencukupi. Tersedia: ' . $cart->product->stock,
    //         ], 422);
    //     }

    //     // Update quantity and price
    //     $cart->qty   = $request->qty;
    //     $cart->price = $cart->product->sell_price * $request->qty;
    //     $cart->save();

    //     return back()->with('success', 'Quantity updated successfully');
    // }

    public function updateCart(Request $request, $cart_id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $cart = Cart::with('product')->whereId($cart_id)
            ->where('cashier_id', auth()->user()->id)
            ->first();

        // Gunakan redirect back dengan error agar ditangkap oleh Inertia
        if (! $cart) {
            return back()->withErrors(['message' => 'Item keranjang tidak ditemukan']);
        }

        // Check stock availability
        if ($cart->product->stock < $request->qty) {
            // Mengirimkan pesan error spesifik ke session/errors
            return back()->withErrors([
                'message' => 'Stok tidak mencukupi. Tersedia: '.$cart->product->stock,
            ]);
        }

        // Update quantity and price
        $cart->qty = $request->qty;
        $cart->price = $cart->product->sell_price * $request->qty;
        $cart->save();

        return back()->with('success', 'Quantity updated successfully');
    }

    /**
     * holdCart - Hold current cart items for later
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function holdCart(Request $request)
    {
        $request->validate([
            'label' => 'nullable|string|max:50',
        ]);

        $userId = auth()->user()->id;

        // Get active cart items
        $activeCarts = Cart::where('cashier_id', $userId)
            ->active()
            ->get();

        if ($activeCarts->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Keranjang kosong, tidak ada yang bisa ditahan',
            ], 422);
        }

        // Generate unique hold ID
        $holdId = 'HOLD-'.strtoupper(uniqid());
        $label = $request->label ?: 'Transaksi '.now()->format('H:i');

        // Mark all active cart items as held
        Cart::where('cashier_id', $userId)
            ->active()
            ->update([
                'hold_id' => $holdId,
                'hold_label' => $label,
                'held_at' => now(),
            ]);

        return back()->with('success', 'Transaksi ditahan: '.$label);
    }

    /**
     * resumeCart - Resume a held cart
     *
     * @param  string  $holdId
     * @return \Illuminate\Http\JsonResponse
     */
    public function resumeCart($holdId)
    {
        $userId = auth()->user()->id;

        // Check if there are any active carts (not held)
        $activeCarts = Cart::where('cashier_id', $userId)
            ->active()
            ->count();

        if ($activeCarts > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Selesaikan atau tahan transaksi aktif terlebih dahulu',
            ], 422);
        }

        // Get held carts
        $heldCarts = Cart::where('cashier_id', $userId)
            ->forHold($holdId)
            ->get();

        if ($heldCarts->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi ditahan tidak ditemukan',
            ], 404);
        }

        // Resume by clearing hold info
        Cart::where('cashier_id', $userId)
            ->forHold($holdId)
            ->update([
                'hold_id' => null,
                'hold_label' => null,
                'held_at' => null,
            ]);

        return back()->with('success', 'Transaksi dilanjutkan');
    }

    /**
     * clearHold - Delete a held cart
     *
     * @param  string  $holdId
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearHold($holdId)
    {
        $userId = auth()->user()->id;

        $deleted = Cart::where('cashier_id', $userId)
            ->forHold($holdId)
            ->delete();

        if ($deleted === 0) {
            return request()->wantsJson()
                ? response()->json([
                    'success' => false,
                    'message' => 'Transaksi ditahan tidak ditemukan',
                ], 404)
                : back()->with('error', 'Transaksi ditahan tidak ditemukan');
        }

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Transaksi ditahan berhasil dihapus',
            ]);
        }

        return back()->with('success', 'Transaksi ditahan berhasil dihapus');
    }

    /**
     * getHeldCarts - Get all held carts for current user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHeldCarts()
    {
        $userId = auth()->user()->id;

        $heldCarts = Cart::with('product:id,title,sell_price,image')
            ->where('cashier_id', $userId)
            ->held()
            ->get()
            ->groupBy('hold_id')
            ->map(function ($items, $holdId) {
                $first = $items->first();

                return [
                    'hold_id' => $holdId,
                    'label' => $first->hold_label,
                    'held_at' => $first->held_at,
                    'items_count' => $items->sum('qty'),
                    'total' => $items->sum('price'),
                    'items' => $items->map(fn ($item) => [
                        'id' => $item->id,
                        'product' => $item->product,
                        'qty' => $item->qty,
                        'price' => $item->price,
                    ]),
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'held_carts' => $heldCarts,
        ]);
    }

    /**
     * checkVoucher
     *
     * @param  mixed  $request
     * @return void
     */
    public function checkVoucher(Request $request)
    {
        $request->validate([
            'voucher_code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
            'manual_discount' => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'customer_id' => 'required',
        ]);

        $voucher = \App\Models\Voucher::where('code', $request->voucher_code)->first();

        // 1. Check if voucher exists
        if (! $voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher tidak ditemukan',
            ], 404);
        }

        // 2. Check if active
        if (! $voucher->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher tidak aktif',
            ], 422);
        }

        // 3. Check date range
        $now = now();
        if ($now->lt($voucher->start_date)) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher belum berlaku',
            ], 422);
        }
        if ($now->gt($voucher->end_date)) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher sudah kadaluarsa',
            ], 422);
        }

        // 4. Check global quota
        if ($voucher->quota <= $voucher->used_count) {
             return response()->json([
                'success' => false,
                'message' => 'Kuota voucher telah habis',
            ], 422);
        }

        // 5. Check user quota (if limit_per_user is set)
        if ($voucher->limit_per_user > 0) {
            if ($request->customer_id) {
                $userUsage = \App\Models\VoucherUsage::where('voucher_id', $voucher->id)
                    ->whereHas('transaction', function($q) use ($request) {
                        $q->where('customer_id', $request->customer_id);
                    })->count();
                
                if ($userUsage >= $voucher->limit_per_user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Batas penggunaan voucher per user tercapai',
                    ], 422);
                }
            }
        }

        // 6. Calculate Net Before Voucher based on Type
        $subtotal = $request->subtotal;
        $manualDiscount = $request->manual_discount ?? 0;
        $shippingCost = $request->shipping_cost ?? 0;
        
        $netBeforeVoucher = 0;
        
        if ($voucher->discount_target === 'subtotal') {
            $netBeforeVoucher = max(0, $subtotal - $manualDiscount);
            $comparisonAmount = $netBeforeVoucher;
        } else {
            // Shipping
            $netBeforeVoucher = $shippingCost;
            // Usually minimum spend for shipping voucher is based on Subtotal
            // Decision: Use Net Subtotal (after manual discount) for min spend check of shipping voucher as well
            $comparisonAmount = max(0, $subtotal - $manualDiscount);
        }

        // 7. Check Minimum Spend
        if ($comparisonAmount < $voucher->min_spend) {
             return response()->json([
                'success' => false,
                'message' => 'Minimal belanja tidak terpenuhi (' . ($voucher->discount_target == 'shipping' ? 'untuk subsidi ongkir' : 'setelah diskon manual') . '). Min: ' . number_format($voucher->min_spend),
            ], 422);
        }

        // 8. Calculate Discount
        $discountAmount = 0;
        if ($voucher->discount_type === 'fixed') {
            $discountAmount = $voucher->amount;
        } else {
            // Percentage
            $baseForPercentage = ($voucher->discount_target === 'subtotal') ? $netBeforeVoucher : $shippingCost;
            $discountAmount = ($baseForPercentage * $voucher->amount) / 100;
            // Check max discount
            if ($voucher->max_discount > 0 && $discountAmount > $voucher->max_discount) {
                $discountAmount = $voucher->max_discount;
            }
        }

        // Ensure discount doesn't exceed the amount to be paid for that component
        // Note: For 'subtotal' type, it's capped by netBeforeVoucher
        // For 'shipping' type, it's capped by shippingCost
        $capAmount = ($voucher->discount_target === 'subtotal') ? $netBeforeVoucher : $shippingCost;
        if ($discountAmount > $capAmount) {
            $discountAmount = $capAmount; 
        }

        return response()->json([
            'success' => true,
            'message' => 'Voucher valid',
            'data' => [
                'code' => $voucher->code,
                'amount' => $discountAmount,
                'type' => $voucher->discount_type,
                'target' => $voucher->discount_target, // subtotal or shipping
                'value' => $voucher->amount
            ]
        ]);
    }

    /**
     * store
     *
     * @param  mixed  $request
     * @return void
     */
    public function store(Request $request, PaymentGatewayManager $paymentGatewayManager)
    {
        $isPayLater = $request->boolean('pay_later');
        $paymentGateway = $isPayLater ? null : $request->input('payment_gateway');
        if ($paymentGateway) {
            $paymentGateway = strtolower($paymentGateway);
        }
        $paymentSetting = null;

        if ($isPayLater && ! $request->filled('due_date')) {
            return redirect()
                ->route('transactions.index')
                ->with('error', 'Tanggal jatuh tempo wajib diisi untuk nota barang.');
        }

        if ($paymentGateway && $paymentGateway !== 'cod') {
            $paymentSetting = PaymentSetting::first();

            if (! $paymentSetting || ! $paymentSetting->isGatewayReady($paymentGateway)) {
                return redirect()
                    ->route('transactions.index')
                    ->with('error', 'Gateway pembayaran belum dikonfigurasi.');
            }
        }

        $length = 10;
        $random = '';
        for ($i = 0; $i < $length; $i++) {
            $random .= rand(0, 1) ? rand(0, 9) : chr(rand(ord('a'), ord('z')));
        }

        $invoice = Setting::get('store_code', 'TRX') . '-' . Str::upper($random);
        $isCashPayment = empty($paymentGateway) && ! $isPayLater;
        
        // Re-calculate Logic Server Side
        // 1. Get Carts
        $carts = Cart::where('cashier_id', auth()->user()->id)->get();
        if ($carts->isEmpty()) {
            return back()->with('error', 'Keranjang kosong');
        }
        $subtotal = $carts->sum('price');
        $manualDiscount = $request->discount ?? 0;
        $shippingCost = $request->shipping_cost ?? 0;
        
        // 2. Resolve Vouchers
        // Incoming input can be array 'voucher_codes'
        $voucherCodes = $request->input('voucher_codes', []); 
        // Backward compatibility if single 'voucher_code' sent
        if (empty($voucherCodes) && $request->voucher_code) {
             $voucherCodes = [$request->voucher_code];
        }

        $activeVouchers = [];
        $totalVoucherDiscountSubtotal = 0;
        $totalVoucherDiscountShipping = 0;

        foreach ($voucherCodes as $code) {
             $voucher = \App\Models\Voucher::where('code', $code)->first();
             // Minimal validation just to be safe they are still valid/active
             if ($voucher && $voucher->is_active && $voucher->quota > $voucher->used_count) {
                 $netSubtotal = max(0, $subtotal - $manualDiscount);
                 $comparisonAmount = $netSubtotal; // Min spend always check against subtotal
                 
                 if ($comparisonAmount >= $voucher->min_spend) {
                     $dAmount = 0;
                     if ($voucher->discount_target === 'subtotal') {
                          // Check if we already have a subtotal voucher? Rule says max 1 each.
                          // Ideally controller should reject if multiple of same type, but let's just accept first or accumulate if allowed. 
                          // Requirement: "1 voucher diskon harga total dan 1 voucer diskon ongkir"
                          // So we only take ONE of each type.
                          $alreadyHasSubtotal = collect($activeVouchers)->contains('target', 'subtotal');
                          if (!$alreadyHasSubtotal) {
                                if ($voucher->discount_type === 'fixed') {
                                    $dAmount = $voucher->amount;
                                } else {
                                    $dAmount = ($netSubtotal * $voucher->amount) / 100;
                                    if ($voucher->max_discount > 0) $dAmount = min($dAmount, $voucher->max_discount);
                                }
                                $dAmount = min($dAmount, $netSubtotal);
                                $totalVoucherDiscountSubtotal += $dAmount;
                                $activeVouchers[] = ['model' => $voucher, 'amount' => $dAmount, 'target' => 'subtotal'];
                          }
                     } else {
                          // Shipping
                          $alreadyHasShipping = collect($activeVouchers)->contains('target', 'shipping');
                          if (!$alreadyHasShipping) {
                                if ($voucher->discount_type === 'fixed') {
                                    $dAmount = $voucher->amount;
                                } else {
                                    $dAmount = ($shippingCost * $voucher->amount) / 100;
                                    if ($voucher->max_discount > 0) $dAmount = min($dAmount, $voucher->max_discount);
                                }
                                $dAmount = min($dAmount, $shippingCost);
                                $totalVoucherDiscountShipping += $dAmount;
                                $activeVouchers[] = ['model' => $voucher, 'amount' => $dAmount, 'target' => 'shipping'];
                          }
                     }
                 }
             }
        }

        // 3. Final Calculation
        // Grand Total = (Subtotal - ManualDiscount - VoucherSubtotal) + (ShippingCost - VoucherShipping)
        $msgSubtotal = max(0, $subtotal - $manualDiscount - $totalVoucherDiscountSubtotal);
        $msgShipping = max(0, $shippingCost - $totalVoucherDiscountShipping);
        
        $grandTotal = $msgSubtotal + $msgShipping;

        $cashAmount = $isCashPayment ? $request->cash : 0;
        $changeAmount = $isCashPayment ? ($cashAmount - $grandTotal) : 0;

        $transaction = DB::transaction(function () use (
            $request,
            $invoice,
            $cashAmount,
            $changeAmount,
            $paymentGateway,
            $isCashPayment,
            $isPayLater,
            $grandTotal,
            $totalVoucherDiscountSubtotal,
            $totalVoucherDiscountShipping,
            $activeVouchers,
            $carts,
            $manualDiscount
        ) {
            $transaction = Transaction::create([
                'cashier_id' => auth()->user()->id,
                'customer_id' => $request->customer_id,
                'invoice' => $invoice,
                'cash' => $cashAmount,
                'change' => $changeAmount,
                'discount' => $manualDiscount + $totalVoucherDiscountSubtotal + $totalVoucherDiscountShipping, // Store total distinct given
                'shipping_cost' => $request->shipping_cost ?? 0,
                'shipping_method' => $request->shipping_method ?? 'off',
                'grand_total' => $grandTotal,
                'payment_method' => $isPayLater ? 'pay_later' : ($paymentGateway ?: 'cash'),
                'payment_status' => $isCashPayment ? 'paid' : ($isPayLater ? 'unpaid' : 'pending'),
                'bank_account_id' => $paymentGateway === 'bank_transfer' ? $request->bank_account_id : null,
            ]);

            // Save Shipping Detail if using vendor
            if ($request->shipping_method === 'using_vendor') {
                \App\Models\TransactionShipping::create([
                    'transaction_id' => $transaction->id,
                    'shipping_courier_code' => $request->shipping_courier_code,
                    'shipping_courier_service' => $request->shipping_courier_service,
                    'shipping_cost' => $request->shipping_cost,
                    'shipping_status' => 'pending', // Default status
                ]);
            }

            // Save Voucher Usage(s)
            foreach ($activeVouchers as $av) {
                 \App\Models\VoucherUsage::create([
                     'voucher_id' => $av['model']->id,
                     'transaction_id' => $transaction->id,
                     'customer_id' => $request->customer_id,
                     'discount_amount' => $av['amount'],
                     'used_at' => now(),
                 ]);
                 $av['model']->increment('used_count');
            }

            foreach ($carts as $cart) {
                $transaction->details()->create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $cart->product_id,
                    'qty' => $cart->qty,
                    'price' => $cart->price,
                ]);

                $total_buy_price = $cart->product->buy_price * $cart->qty;
                $total_sell_price = $cart->product->sell_price * $cart->qty;
                $profits = $total_sell_price - $total_buy_price;

                $transaction->profits()->create([
                    'transaction_id' => $transaction->id,
                    'total' => $profits,
                ]);

                $product = Product::find($cart->product_id);
                $product->stock = $product->stock - $cart->qty;
                $product->save();
            }

            Cart::where('cashier_id', auth()->user()->id)->delete();

            if ($isPayLater || $paymentGateway === 'cod') {
                Receivable::create([
                    'customer_id' => $request->customer_id,
                    'transaction_id' => $transaction->id,
                    'invoice' => $invoice,
                    'total' => $grandTotal,
                    'paid' => 0,
                    'due_date' => $request->due_date,
                    'status' => 'unpaid',
                ]);
            }

            return $transaction->fresh(['customer']);
        });

        if ($paymentGateway && $paymentGateway !== 'cod') {
            try {
                $paymentResponse = $paymentGatewayManager->createPayment($transaction, $paymentGateway, $paymentSetting);

                $transaction->update([
                    'payment_reference' => $paymentResponse['reference'] ?? null,
                    'payment_url' => $paymentResponse['payment_url'] ?? null,
                ]);
            } catch (PaymentGatewayException $exception) {
                return redirect()
                    ->route('transactions.print', $transaction->invoice)
                    ->with('error', $exception->getMessage());
            }
        }

        return to_route('transactions.print', $transaction->invoice);
    }

    public function print($invoice)
    {
        // get transaction
        $transaction = Transaction::with('details.product', 'cashier', 'customer', 'receivable', 'voucherUsages.voucher', 'shipping')->where('invoice', $invoice)->firstOrFail();

        return Inertia::render('Dashboard/Transactions/Print', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Display transaction history.
     */
    public function history(Request $request)
    {
        $filters = [
            'invoice' => $request->input('invoice'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ];

        $query = Transaction::query()
            ->with(['cashier:id,name', 'customer:id,name', 'receivable'])
            ->withSum('details as total_items', 'qty')
            ->withSum('profits as total_profit', 'total')
            ->orderByDesc('created_at');

        if (! $request->user()->isSuperAdmin()) {
            $query->where('cashier_id', $request->user()->id);
        }

        $query
            ->when($filters['invoice'], function (Builder $builder, $invoice) {
                $builder->where('invoice', 'like', '%'.$invoice.'%');
            })
            ->when($filters['start_date'], function (Builder $builder, $date) {
                $builder->whereDate('created_at', '>=', $date);
            })
            ->when($filters['end_date'], function (Builder $builder, $date) {
                $builder->whereDate('created_at', '<=', $date);
            });

        $transactions = $query->paginate(10)->withQueryString();

        // Calculate summary stats (All Time)
        $statsQuery = Transaction::query();

        if (! $request->user()->isSuperAdmin()) {
            $statsQuery->where('cashier_id', $request->user()->id);
        }

        $stats = $statsQuery->selectRaw("
                count(*) as all_count,
                sum(grand_total) as all_total,
                count(case when payment_status = 'paid' then 1 end) as paid_count,
                sum(case when payment_status = 'paid' then grand_total else 0 end) as paid_total,
                count(case when payment_status = 'pending' then 1 end) as pending_count,
                sum(case when payment_status = 'pending' then grand_total else 0 end) as pending_total,
                count(case when payment_method = 'pay_later' and payment_status = 'unpaid' then 1 end) as receivable_count,
                sum(case when payment_method = 'pay_later' and payment_status = 'unpaid' then grand_total else 0 end) as receivable_total
            ")
            ->first();

        return Inertia::render('Dashboard/Transactions/History', [
            'transactions' => $transactions,
            'filters' => $filters,
            'totalTransactions' => $stats->all_count ?? 0,
            'totalSales' => $stats->all_total ?? 0,
            'paidTransactions' => $stats->paid_count ?? 0,
            'paidSales' => $stats->paid_total ?? 0,
            'pendingTransactions' => $stats->pending_count ?? 0,
            'pendingSales' => $stats->pending_total ?? 0,
            'receivableTransactions' => $stats->receivable_count ?? 0,
            'receivableSales' => $stats->receivable_total ?? 0,
        ]);
    }

    /**
     * Confirm payment for bank transfer transactions
     */
    public function confirmPayment(Transaction $transaction)
    {
        if ($transaction->payment_status === 'paid') {
            return redirect()
                ->back()
                ->with('error', 'Transaksi sudah dibayar.');
        }

        $transaction->update([
            'payment_status' => 'paid',
        ]);

        return redirect()
            ->back()
            ->with('success', "Pembayaran untuk invoice {$transaction->invoice} berhasil dikonfirmasi.");
    }
}
