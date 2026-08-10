<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $effectivePriceSql =
            "COALESCE(active_flash_sale_products.discount_price, products.sell_price)";

        $query = Product::query()
            ->withActiveFlashSale()
            ->with("category")
            ->withSum("transactionDetails as sold_count", "qty")
            ->withAvg("reviews as average_rating", "rating")
            ->withCount([
                "reviews" => function ($q) {
                    $q->where("is_hidden", false);
                },
            ]);

        // Filter by Category
        if ($request->filled("category") && $request->category != "Semua") {
            $query->whereHas("category", function ($q) use ($request) {
                $q->where("name", $request->category);
            });
        }

        // Filter by Price Range (Example: min-max)
        if ($request->filled("min_price")) {
            $query->whereRaw("{$effectivePriceSql} >= ?", [(int) $request->min_price]);
        }
        if ($request->filled("max_price")) {
            $query->whereRaw("{$effectivePriceSql} <= ?", [(int) $request->max_price]);
        }

        // Search
        if ($request->filled("q")) {
            $query->where("title", "like", "%" . $request->q . "%");
        }

        // Sorting
        if ($request->filled("sort")) {
            switch ($request->sort) {
                case "price_asc":
                    $query->orderByRaw("{$effectivePriceSql} asc");
                    break;
                case "price_desc":
                    $query->orderByRaw("{$effectivePriceSql} desc");
                    break;
                case "newest":
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
        if ($request->filled("min_rating")) {
            $query->having("average_rating", ">=", (float) $request->min_rating);
        }

        $products = $query
            ->paginate(12)
            ->withQueryString()
            ->through(function ($product) {
                return $product->append([
                    "current_price",
                    "original_price",
                    "has_flash_sale",
                    "discount_percentage",
                ]);
            });

        $wishlistIds = Auth::check()
            ? Auth::user()->wishlistedProducts()->pluck("products.id")->all()
            : [];

        return Inertia::render("EndUser/Products/Index", [
            "products" => $products,
            "filters" => $request->all([
                "category",
                "q",
                "min_price",
                "max_price",
                "sort",
                "min_rating",
            ]),
            "categories" => Category::all(),
            "wishlist_ids" => $wishlistIds,
        ]);
    }

    public function show($slug)
    {
        $product = Product::query()
            ->withActiveFlashSale()
            ->with(["category", "productDetail", "car"])
            ->withSum("transactionDetails as sold_count", "qty")
            ->withAvg("reviews as average_rating", "rating")
            ->withCount([
                "reviews" => function ($q) {
                    $q->where("is_hidden", false);
                },
            ])
            ->where("slug", $slug)
            ->orWhere("id", $slug)
            ->firstOrFail()
            ->append(["current_price", "original_price", "has_flash_sale", "discount_percentage"]);

        // Get visible reviews with user info
        $reviews = $product
            ->reviews()
            ->where("is_hidden", false)
            ->with("user:id,name,avatar")
            ->latest()
            ->paginate(10);

        // Get related products (same category)
        $relatedProducts = Product::query()
            ->withActiveFlashSale()
            ->with("category")
            ->where("category_id", $product->category_id)
            ->where("id", "!=", $product->id)
            ->take(4)
            ->get()
            ->each->append([
                "current_price",
                "original_price",
                "has_flash_sale",
                "discount_percentage",
            ]);

        $vouchers = \App\Models\Voucher::active()->get();

        return Inertia::render("EndUser/Products/Show", [
            "product" => $product,
            "reviews" => $reviews,
            "relatedProducts" => $relatedProducts,
            "vouchers" => $vouchers,
        ]);
    }

    public function search(Request $request)
    {
        // Popular products (most sold)
        $popularProducts = Product::query()
            ->withActiveFlashSale()
            ->with("category")
            ->withSum("transactionDetails as sold_count", "qty")
            ->withAvg("reviews as average_rating", "rating")
            ->withCount([
                "reviews as reviews_count" => function ($q) {
                    $q->where("is_hidden", false);
                },
            ])
            ->orderByDesc("sold_count")
            ->take(8)
            ->get()
            ->each->append([
                "current_price",
                "original_price",
                "has_flash_sale",
                "discount_percentage",
            ]);

        // Latest products
        $latestProducts = Product::query()
            ->withActiveFlashSale()
            ->with("category")
            ->withSum("transactionDetails as sold_count", "qty")
            ->withAvg("reviews as average_rating", "rating")
            ->withCount([
                "reviews as reviews_count" => function ($q) {
                    $q->where("is_hidden", false);
                },
            ])
            ->latest()
            ->take(8)
            ->get()
            ->each->append([
                "current_price",
                "original_price",
                "has_flash_sale",
                "discount_percentage",
            ]);

        // Categories
        $categories = Category::withCount("products")->get();

        return Inertia::render("EndUser/Search/Index", [
            "popularProducts" => $popularProducts,
            "latestProducts" => $latestProducts,
            "categories" => $categories,
        ]);
    }

    public function categories()
    {
        $categories = Category::withCount("products")->get();

        return Inertia::render("EndUser/Categories/Index", [
            "categories" => $categories,
        ]);
    }
}
