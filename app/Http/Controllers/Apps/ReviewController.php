<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index(Product $product)
    {
        $product->load('category');

        $reviews = $product->reviews()
            ->with(['user:id,name'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Dashboard/Reviews/Index', [
            'product' => $product,
            'reviews' => $reviews,
        ]);
    }

    public function toggleVisibility(Review $review)
    {
        $review->update([
            'is_hidden' => !$review->is_hidden,
        ]);

        return back()->with('success', $review->is_hidden ? 'Ulasan disembunyikan.' : 'Ulasan ditampilkan.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Ulasan berhasil dihapus.');
    }
}
