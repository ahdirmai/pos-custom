<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TransactionShipping;
use App\Models\VoucherUsage;
use App\Services\BiteshipService;
use App\Services\VoucherService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected $biteshipService;

    protected $voucherService;

    public function __construct(BiteshipService $biteshipService, VoucherService $voucherService)
    {
        $this->biteshipService = $biteshipService;
        $this->voucherService = $voucherService;
    }

    /**
     * Show the checkout page.
     */
    public function index()
    {
        $cartIds = request('cart_ids'); // Optional: Filter by selected IDs
        $vouchers = request('vouchers'); // Optional: Auto apply vouchers

        $carts = Cart::with('product.activeFlashSaleItem.flashSale')
            ->where('user_id', Auth::id())
            ->whereNull('cashier_id') // Ensure it's online cart
            ->when($cartIds, function ($query, $cartIds) {
                return $query->whereIn('id', $cartIds);
            })
            ->get();

        if ($carts->isEmpty()) {
            return redirect()->route('user.products')->with('error', 'Keranjang belanja Anda kosong.');
        }

        // Calculate subtotal
        $subtotal = $carts->sum(function ($cart) {
            return $cart->product->current_price * $cart->qty;
        });

        // Calculate total weight
        $totalWeight = $carts->sum(function ($cart) {
            // Assume product has weight, default 1000g if null
            return ($cart->product->weight ?? 1000) * $cart->qty;
        });

        // Fetch saved addresses
        $savedAddresses = \App\Models\CustomerAddress::where('user_id', Auth::id())
            ->with(['province', 'city', 'district', 'village'])
            ->orderBy('is_primary', 'desc')
            ->get();

        $userId = Auth::id();
        $customer = Auth::user()->customer;
        $customerId = $customer instanceof \Illuminate\Database\Eloquent\Collection ? $customer->first()?->id : $customer?->id;

        // Fetch available vouchers
        $availableVouchers = \App\Models\Voucher::where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->whereColumn('used_count', '<', 'quota')
            ->get()
            ->filter(function ($voucher) use ($userId, $customerId) {
                if ($voucher->limit_per_user) {
                    $userUsageCount = \App\Models\VoucherUsage::where('voucher_id', $voucher->id)
                        ->where(function($q) use ($userId, $customerId) {
                            $q->where('user_id', $userId);
                            if ($customerId) {
                                $q->orWhere('customer_id', $customerId);
                            }
                        })
                        ->count();
                    
                    if ($userUsageCount >= $voucher->limit_per_user) {
                        return false;
                    }
                }
                return true;
            })->values();

        return Inertia::render('EndUser/Checkout/Index', [
            'carts' => $carts->map(function ($cart) {
                return [
                    'id' => $cart->id,
                    'qty' => $cart->qty,
                    'price' => $cart->product->current_price,
                    'original_price' => $cart->product->original_price,
                    'has_flash_sale' => $cart->product->has_flash_sale,
                    'product' => [
                        'id' => $cart->product->id,
                        'title' => $cart->product->title,
                        'image' => $cart->product->image,
                    ],
                ];
            })->values(),
            'subtotal' => $subtotal,
            'totalWeight' => $totalWeight,
            'provinces' => \Laravolt\Indonesia\Models\Province::all(),
            'savedAddresses' => $savedAddresses,
            'initialVouchers' => $vouchers,
            'availableVouchers' => $availableVouchers,
        ]);
    }

    /**
     * Check shipping rates via Biteship.
     */
    public function checkRates(Request $request)
    {
        $request->validate([
            'postal_code' => 'required|numeric|digits:5',
        ]);

        $carts = Cart::with('product.activeFlashSaleItem.flashSale')
            ->where('user_id', Auth::id())
            ->whereNull('cashier_id')
            ->get();

        if ($carts->isEmpty()) {
            return response()->json(['error' => 'Keranjang kosong'], 400);
        }

        // Build items array for Biteship
        $items = $carts->map(function ($cart) {
            return [
                'name' => $cart->product->title,
                'description' => $cart->product->description ?? 'Item',
                'value' => $cart->product->current_price,
                'length' => 10, // Default dimensions if not in DB
                'width' => 10,
                'height' => 10,
                'weight' => $cart->product->weight ?? 1000,
                'quantity' => $cart->qty,
            ];
        })->toArray();

        $destination = [
            'postal_code' => $request->postal_code,
        ];

        $result = $this->biteshipService->checkRates($destination, $items);

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], 500);
        }

        return response()->json([
            'rates' => $result['pricing'] ?? [],
        ]);
    }

    /**
     * Check voucher validity.
     */
    public function checkVoucher(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'cart_ids' => 'nullable|array',
            'cart_ids.*' => 'integer'
        ]);

        $carts = Cart::with('product.activeFlashSaleItem.flashSale')
            ->where('user_id', Auth::id())
            ->whereNull('cashier_id')
            ->when($request->cart_ids, function ($query, $cartIds) {
                return $query->whereIn('id', $cartIds);
            })
            ->get();
            
        $subtotal = $carts->sum(fn ($c) => $c->product->current_price * $c->qty);

        $result = $this->voucherService->validate($request->code, $subtotal, Auth::id());

        if (! $result['valid']) {
            return response()->json(['valid' => false, 'message' => $result['message']], 422);
        }

        $voucher = $result['voucher'];
        // Note: Shipping cost is needed for full calculation if voucher targets shipping.
        // Frontend should send estimated shipping if selected, or we define it here.
        // For simple check, we return voucher info. Actual calc happens on store or frontend preliminary.

        return response()->json([
            'valid' => true,
            'voucher' => $voucher,
            'message' => 'Voucher berhasil digunakan!',
        ]);
    }

    /**
     * Store the order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'province_code' => 'required|string',
            'city_code' => 'required|string',
            'district_code' => 'required|string',
            'village_code' => 'required|string',
            'postal_code' => 'nullable|string|max:10',
            'shipping_courier' => 'required|string',
            'shipping_service' => 'required|string',
            'shipping_cost' => 'required|numeric|min:0',
            'voucher_codes' => 'nullable|array',
            'payment_proof' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // return $request->all();
        return DB::transaction(function () use ($request) {
            $user = Auth::user();

            // 1. Get Cart
            $carts = Cart::with('product.activeFlashSaleItem.flashSale')
                ->where('user_id', $user->id)
                ->whereNull('cashier_id')
                ->when($request->cart_ids, function ($query, $cartIds) {
                    return $query->whereIn('id', $cartIds);
                })
                ->get(); // Lock for update?

            if ($carts->isEmpty()) {
                return back()->with('error', 'Keranjang belanja kosong.');
            }

            // 2. Validate Stock & Calculate Subtotal
            $subtotal = 0;
            foreach ($carts as $cart) {
                if ($cart->product->stock < $cart->qty) {
                    throw new \Exception("Stok produk {$cart->product->title} tidak mencukupi.");
                }
                $subtotal += $cart->product->current_price * $cart->qty;
            }

            // 3. Validate Voucher (Server Side Check)
            $discountAmount = 0;
            $voucherIds = [];
            if ($request->voucher_codes && is_array($request->voucher_codes)) {
                foreach ($request->voucher_codes as $code) {
                    $vCheck = $this->voucherService->validate($code, $subtotal, $user->id);
                    if ($vCheck['valid']) {
                        $voucher = $vCheck['voucher'];
                        $discountAmount += $this->voucherService->calculateDiscount($voucher, $subtotal, $request->shipping_cost);
                        $voucherIds[] = $voucher->id;
                    }
                }
            }

            // Handle Payment Proof Upload
            $paymentProofPath = null;
            if ($request->hasFile('payment_proof')) {
                $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'public');
            }

            // 4. Create Transaction
            $grandTotal = ($subtotal + $request->shipping_cost) - $discountAmount;
            if ($grandTotal < 0) {
                $grandTotal = 0;
            }

            // Generate Invoice
            $length = 5;
            $random = '';
            for ($i = 0; $i < $length; $i++) {
                $random .= rand(0, 1) ? rand(0, 9) : chr(rand(ord('a'), ord('z')));
            }
            $invoice = 'TRX-'.strtoupper($random);

            // Get region names from Laravolt
            $province = \Laravolt\Indonesia\Models\Province::where('code', $request->province_code)->first();
            $city = \Laravolt\Indonesia\Models\City::where('code', $request->city_code)->first();
            $district = \Laravolt\Indonesia\Models\District::where('code', $request->district_code)->first();
            $village = \Laravolt\Indonesia\Models\Village::where('code', $request->village_code)->first();

            // Resolve Customer (Handle BelongsToMany returning Collection)
            $customer = $user->customer;
            if ($customer instanceof \Illuminate\Database\Eloquent\Collection) {
                $customer = $customer->first();
            }

            // return $user->customer;
            // Save Address if requested
            if ($request->save_address && $customer) {
                // Add to CustomerAddress List
                // Check if user has any address, if not, make this primary
                $hasAddress = \App\Models\CustomerAddress::where('user_id', $user->id)->exists();
                
                // Validate Label
                if (!$request->address_label) {
                    throw new \Exception('Label alamat wajib diisi jika simpan alamat dipilih.');
                }

                \App\Models\CustomerAddress::create([
                    'user_id' => $user->id,
                    'customer_id' => $customer->id,
                    'label' => $request->address_label,
                    'recipient_name' => $request->recipient_name,
                    'phone_number' => $request->phone_number,
                    'address' => $request->address,
                    'province_code' => $request->province_code,
                    'city_code' => $request->city_code,
                    'district_code' => $request->district_code,
                    'village_code' => $request->village_code,
                    'postal_code' => $request->postal_code,
                    'is_primary' => !$hasAddress,
                ]);
            }

            $transaction = Transaction::create([
                'cashier_id' => null, // Online Order
                'customer_id' => $customer ? $customer->id : null,
                'user_id' => $user->id,
                'invoice' => $invoice,
                'cash' => 0, // Not paid yet
                'change' => 0,
                'discount' => $discountAmount,
                'shipping_cost' => $request->shipping_cost,
                'shipping_method' => 'using_vendor', // or 'biteship'
                'grand_total' => $grandTotal,
                'payment_method' => 'manual_transfer', // Default for now
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'shipping_address' => json_encode([
                    'recipient' => $request->recipient_name,
                    'phone' => $request->phone_number,
                    'address' => $request->address,
                    'province_code' => $request->province_code,
                    'province_name' => $province->name ?? '',
                    'city_code' => $request->city_code,
                    'city_name' => $city->name ?? '',
                    'district_code' => $request->district_code,
                    'district_name' => $district->name ?? '',
                    'village_code' => $request->village_code,
                    'village_name' => $village->name ?? '',
                    'postal_code' => $request->postal_code,
                ]),
                'shipping_courier' => $request->shipping_courier.' - '.$request->shipping_service,
                'voucher_id' => $voucherIds[0] ?? null,
                'payment_proof' => $paymentProofPath,
            ]);

            // 5. Create Transaction Details & Reduce Stock
            foreach ($carts as $cart) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $cart->product_id,
                    'qty' => $cart->qty,
                    'price' => $cart->product->current_price,
                ]);

                // Reduce Stock
                $cart->product->decrement('stock', $cart->qty);
            }

            // 6. Create Transaction Shipping (Biteship Info)
            TransactionShipping::create([
                'transaction_id' => $transaction->id,
                'shipping_courier_code' => explode(' ', $request->shipping_courier)[0] ?? 'courier', // crude parsing
                'shipping_courier_service' => $request->shipping_service,
                'shipping_cost' => $request->shipping_cost,
                // 'biteship_order_id' => ..., // Only created after confirmed payment if we order immediately, or now if we draft
                'shipping_status' => 'placed',
            ]);

            // 7. Record Voucher Usage
            if (!empty($voucherIds)) {
                foreach ($voucherIds as $vId) {
                    $v = \App\Models\Voucher::find($vId);
                    $vDiscount = $this->voucherService->calculateDiscount($v, $subtotal, $request->shipping_cost);
                    VoucherUsage::create([
                        'voucher_id' => $vId,
                        'transaction_id' => $transaction->id,
                        'customer_id' => null,
                        'user_id' => $user->id,
                        'discount_amount' => $vDiscount,
                        'used_at' => now(),
                    ]);
                    $v->increment('used_count');
                }
            }

            // 8. Clear Cart
            // 8. Clear Cart
            // Only delete the items that were actually purchased
            $processedCartIds = $carts->pluck('id');
            Cart::whereIn('id', $processedCartIds)->delete();

            return redirect()->route('user.invoice', $transaction->id)->with('success', 'Pesanan berhasil dibuat!');
        });
    }
}
