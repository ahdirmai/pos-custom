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
        $query = Product::with('category');

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

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('EndUser/Products/Index', [
            'products' => $products,
            'filters' => $request->all(['category', 'q', 'min_price', 'max_price', 'sort']),
            'categories' => Category::all(),
        ]);
    }

    public function show($slug)
    {
        // Using ID for now as slug column verification was inconclusive/not found in fillable
        $product = Product::with(['category', 'productDetail'])
            ->withSum('transactionDetails as sold_count', 'qty')
            ->findOrFail($slug);

        // Get related products (same category)
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return Inertia::render('EndUser/Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function search(Request $request)
    {
        return $this->index($request);
    }
}
