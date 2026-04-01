<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        // Fetch active banners
        $heroBanners = \App\Models\Banner::where('type', 'hero')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        $promoBanners = \App\Models\Banner::where('type', 'promo')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        $productCategories = Category::all();

        $products = Product::with('category')
            ->withSum('transactionDetails as sold_count', 'qty')
            ->withCount(['reviews as reviews_count' => function ($q) {
                $q->where('is_hidden', false);
            }])
            ->withAvg('reviews as average_rating', 'rating')
            ->orderByDesc('sold_count')
            ->take(10)
            ->get();

        $latestPosts = \App\Models\BlogPost::with('category')
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'slug' => $post->slug,
                    'category' => $post->category ? $post->category->name : 'Uncategorized',
                    'title' => $post->title,
                    'excerpt' => $post->excerpt ?? \Illuminate\Support\Str::limit(strip_tags($post->content), 100),
                    'date' => $post->created_at, // using accessor
                    'image' => $post->image,
                ];
            });

        $wishlistIds = Auth::check()
            ? Auth::user()->wishlistedProducts()->pluck('products.id')->all()
            : [];

        return Inertia::render('EndUser/Home/Index', [
            'heroBanners' => $heroBanners,
            'promoBanners' => $promoBanners,
            'productCategories' => $productCategories,
            'products' => $products,
            'latestPosts' => $latestPosts,
            'wishlist_ids' => $wishlistIds,
        ]);
    }

    // Products methods moved to ProductController

    public function articles()
    {
        $articles = \App\Models\BlogPost::with('category')
            ->where('is_active', true)
            ->latest()
            ->paginate(9)
            ->through(function ($post) {
                return [
                    'id' => $post->id,
                    'slug' => $post->slug,
                    'title' => $post->title,
                    'category' => $post->category ? $post->category->name : 'Uncategorized',
                    'excerpt' => $post->excerpt ?? \Illuminate\Support\Str::limit(strip_tags($post->content), 150),
                    'image' => $post->image,
                    'date' => $post->created_at, // using accessor
                ];
            });

        return Inertia::render('EndUser/Articles/Index', [
            'articles' => $articles,
        ]);
    }

    public function articleShow($slug)
    {
        $article = \App\Models\BlogPost::with(['category', 'user', 'tags'])
            ->where('is_active', true)
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $article->increment('views_count');

        $articleData = [
            'id' => $article->id,
            'title' => $article->title,
            'category' => $article->category ? $article->category->name : 'Uncategorized',
            'author' => $article->user ? $article->user->name : 'Admin',
            'date' => $article->created_at, // using accessor
            'image' => $article->image,
            'content' => $article->content,
            'tags' => $article->tags->pluck('name')->toArray(),
        ];

        // Related Articles
        $relatedArticles = \App\Models\BlogPost::where('blog_category_id', $article->blog_category_id)
            ->where('id', '!=', $article->id)
            ->where('is_active', true)
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'slug' => $post->slug,
                    'title' => $post->title,
                    'category' => $post->category ? $post->category->name : 'Uncategorized',
                    'date' => $post->created_at, // using accessor
                    'image' => $post->image,
                ];
            });

        return Inertia::render('EndUser/Articles/Show', [
            'article' => $articleData,
            'relatedArticles' => $relatedArticles,
        ]);
    }

    public function checkout()
    {
        return Inertia::render('EndUser/Checkout/Index');
    }

    public function invoice($id)
    {
        // Dummy order data (In real app, fetch from DB by $id)
        $order = [
            'id' => $id,
            'invoice' => 'INV-'.strtoupper(substr(md5($id.time()), 0, 8)),
            'date' => now()->format('d M Y H:i'),
            'status' => 'pending',
            'payment_method' => 'cod',
            'customer' => [
                'name' => 'Pelanggan',
                'phone' => '081234567890',
                'address' => 'Alamat pengiriman akan ditampilkan di sini',
            ],
            'items' => [],
            'subtotal' => 0,
            'shipping' => 0,
            'total' => 0,
        ];

        return Inertia::render('EndUser/Invoice/Index', [
            'order' => $order,
        ]);
    }

    public function profile()
    {
        // Dummy User Data
        $user = [
            'id' => 1,
            'name' => 'Sarah Putri',
            'email' => 'sarah.putri@email.com',
            'phone' => '081234567890',
            'avatar' => 'https://picsum.photos/200/200?random=999',
            'joined_at' => '10 Desember 2024',
        ];

        // Dummy Addresses
        $addresses = [
            [
                'id' => 1,
                'label' => 'Rumah',
                'is_primary' => true,
                'recipient' => 'Sarah Putri',
                'phone' => '081234567890',
                'address' => 'Jl. Melati No. 123, RT 01/RW 02, Kel. Sukamaju, Kec. Cilandak',
                'city' => 'Jakarta Selatan',
                'postal_code' => '12430',
            ],
            [
                'id' => 2,
                'label' => 'Kantor',
                'is_primary' => false,
                'recipient' => 'Sarah Putri',
                'phone' => '081234567890',
                'address' => 'Gedung Graha Mandiri Lt. 5, Jl. Imam Bonjol No. 61',
                'city' => 'Jakarta Pusat',
                'postal_code' => '10310',
            ],
        ];

        // Dummy Orders with various statuses
        $orders = [
            [
                'id' => 'ORD-001',
                'invoice' => 'INV-20250120-001',
                'date' => '20 Jan 2025',
                'status' => 'pending',
                'status_label' => 'Belum Bayar',
                'total' => 450000,
                'items' => [
                    ['name' => 'Gamis Syari Premium', 'qty' => 1, 'image' => 'https://picsum.photos/100/100?random=301'],
                    ['name' => 'Jilbab Instan', 'qty' => 2, 'image' => 'https://picsum.photos/100/100?random=302'],
                ],
            ],
            [
                'id' => 'ORD-002',
                'invoice' => 'INV-20250118-002',
                'date' => '18 Jan 2025',
                'status' => 'processing',
                'status_label' => 'Diproses',
                'total' => 275000,
                'items' => [
                    ['name' => 'Mukena Travel', 'qty' => 1, 'image' => 'https://picsum.photos/100/100?random=303'],
                ],
            ],
            [
                'id' => 'ORD-003',
                'invoice' => 'INV-20250115-003',
                'date' => '15 Jan 2025',
                'status' => 'shipped',
                'status_label' => 'Dikirim',
                'total' => 180000,
                'tracking' => 'JNE-123456789',
                'items' => [
                    ['name' => 'Koko Anak Premium', 'qty' => 1, 'image' => 'https://picsum.photos/100/100?random=304'],
                ],
            ],
            [
                'id' => 'ORD-004',
                'invoice' => 'INV-20250110-004',
                'date' => '10 Jan 2025',
                'status' => 'completed',
                'status_label' => 'Selesai',
                'total' => 520000,
                'items' => [
                    ['name' => 'Set Baju Couple', 'qty' => 1, 'image' => 'https://picsum.photos/100/100?random=305'],
                    ['name' => 'Sajadah Premium', 'qty' => 1, 'image' => 'https://picsum.photos/100/100?random=306'],
                ],
            ],
        ];

        // Dummy Wishlist
        $wishlist = [];
        for ($i = 1; $i <= 6; $i++) {
            $wishlist[] = [
                'id' => $i,
                'name' => "Produk Favorit $i",
                'price' => rand(100000, 500000),
                'image' => 'https://picsum.photos/200/300?random='.(400 + $i),
                'stock' => rand(0, 20),
            ];
        }

        // Dummy Reviews to Write
        $pendingReviews = [
            [
                'id' => 1,
                'order_id' => 'ORD-004',
                'product_name' => 'Set Baju Couple',
                'product_image' => 'https://picsum.photos/100/100?random=305',
                'purchased_at' => '10 Jan 2025',
            ],
            [
                'id' => 2,
                'order_id' => 'ORD-004',
                'product_name' => 'Sajadah Premium',
                'product_image' => 'https://picsum.photos/100/100?random=306',
                'purchased_at' => '10 Jan 2025',
            ],
        ];

        return Inertia::render('EndUser/Profile/Index', [
            'user' => $user,
            'addresses' => $addresses,
            'orders' => $orders,
            'wishlist' => $wishlist,
            'pendingReviews' => $pendingReviews,
        ]);
    }

    // Show method moved to ProductController
}
