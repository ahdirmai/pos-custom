<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Show the wishlist page.
     */
    public function index()
    {
        $products = Auth::user()
            ->wishlistedProducts()
            ->with('category')
            ->withSum('transactionDetails as sold_count', 'qty')
            ->withAvg('reviews as average_rating', 'rating')
            ->latest('wishlists.created_at')
            ->get();

        $wishlistIds = $products->pluck('id')->all();

        return Inertia::render('EndUser/Wishlist/Index', [
            'products' => $products,
            'wishlist_ids' => $wishlistIds,
        ]);
    }

    /**
     * Toggle product in wishlist (add or remove).
     */
    public function toggle(Product $product)
    {
        $userId = Auth::id();

        $existing = Wishlist::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $wishlisted = false;
        } else {
            Wishlist::create([
                'user_id' => $userId,
                'product_id' => $product->id,
            ]);
            $wishlisted = true;
        }

        $count = Wishlist::where('user_id', $userId)->count();

        return back()->with([
            'wishlisted' => $wishlisted,
            'wishlist_count' => $count,
        ]);
    }
}
