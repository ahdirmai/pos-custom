<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Add item to cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'is_buy_now' => 'nullable|boolean',
            'vouchers' => 'nullable|array',
        ]);

        $product = Product::query()
            ->with('activeFlashSaleItem.flashSale')
            ->findOrFail($request->product_id);
        $price = $product->current_price;

        // Check stock
        if ($product->stock < $request->qty) {
            return back()->with('error', 'Stok produk tidak mencukupi.');
        }

        // Check active cart for user
        $cart = Cart::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->whereNull('cashier_id')
            ->first();

        if ($cart) {
            // Update qty
            $newQty = $cart->qty + $request->qty;
            if ($product->stock < $newQty) {
                return back()->with('error', 'Stok produk tidak mencukupi untuk penambahan jumlah.');
            }
            $cart->update([
                'qty' => $newQty,
                'price' => $price,
            ]);
        } else {
            // Create new
            $cart = Cart::create([
                'user_id' => Auth::id(),
                'cashier_id' => null,
                'product_id' => $product->id,
                'qty' => $request->qty,
                'price' => $price,
            ]);
        }

        if ($request->is_buy_now) {
            return redirect()->route('user.checkout', [
                'cart_ids' => [$cart->id],
                'vouchers' => $request->vouchers,
            ]);
        }

        return back()->with('success', 'Produk ditambahkan ke keranjang.');
    }

    /**
     * Remove item from cart.
     */
    public function destroy($id)
    {
        $cart = Cart::where('user_id', Auth::id())
            ->where('id', $id)
            ->whereNull('cashier_id')
            ->firstOrFail();

        $cart->delete();

        return back()->with('success', 'Produk dihapus dari keranjang.');
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $cart = Cart::with('product')->where('user_id', Auth::id())
            ->where('id', $id)
            ->whereNull('cashier_id')
            ->firstOrFail();

        $cart->load('product.activeFlashSaleItem.flashSale');

        if ($cart->product->stock < $request->qty) {
            return back()->with('error', 'Stok produk tidak mencukupi.');
        }

        $cart->update([
            'qty' => $request->qty,
            'price' => $cart->product->current_price,
        ]);

        return back()->with('success', 'Keranjang diperbarui.');
    }
}
