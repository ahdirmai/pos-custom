<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')
            ->withSum('transactionDetails as sold_count', 'qty')
            ->withAvg('reviews as average_rating', 'rating')
            ->withCount(['reviews' => function ($q) {
                $q->where('is_hidden', false);
            }]);

        // Filter by Category
        if ($request->filled('category') && $request->category != 'Semua') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        // Filter by Price Range (Example: min-max)
        if ($request->filled('min_price')) {
            $query->where('sell_price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('sell_price', '<=', $request->max_price);
        }

        // Search
        if ($request->filled('q')) {
            $query->where('title', 'like', '%'.$request->q.'%');
        }

        // Sorting
        if ($request->filled('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('sell_price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('sell_price', 'desc');
                    break;
                case 'newest':
                    $query->latest();
                    break;
                default:
                    $query->latest();
                    break;
            }
        } else {
            $query->latest();
        }

        // Filter by minimum average rating
        if ($request->filled('min_rating')) {
            $query->having('average_rating', '>=', (float) $request->min_rating);
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('EndUser/Products/Index', [
            'products' => $products,
            'filters' => $request->all(['category', 'q', 'min_price', 'max_price', 'sort', 'min_rating']),
            'categories' => Category::all(),
        ]);
    }

    public function show($slug)
    {
        // Using ID for now as slug column verification was inconclusive/not found in fillable
        $product = Product::with(['category', 'productDetail'])
            ->withSum('transactionDetails as sold_count', 'qty')
            ->withAvg('reviews as average_rating', 'rating')
            ->withCount(['reviews' => function ($q) {
                $q->where('is_hidden', false);
            }])
            ->findOrFail($slug);

        // Get visible reviews with user info
        $reviews = $product->reviews()
            ->where('is_hidden', false)
            ->with('user:id,name,avatar')
            ->latest()
            ->paginate(10);

        // Get related products (same category)
        $relatedProducts = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return Inertia::render('EndUser/Products/Show', [
            'product' => $product,
            'reviews' => $reviews,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function search(Request $request)
    {
        // Popular products (most sold)
        $popularProducts = Product::with('category')
            ->withSum('transactionDetails as sold_count', 'qty')
            ->orderByDesc('sold_count')
            ->take(8)
            ->get();

        // Latest products
        $latestProducts = Product::with('category')
            ->latest()
            ->take(8)
            ->get();

        // Categories
        $categories = Category::withCount('products')->get();

        return Inertia::render('EndUser/Search/Index', [
            'popularProducts' => $popularProducts,
            'latestProducts' => $latestProducts,
            'categories' => $categories,
        ]);
    }
}
