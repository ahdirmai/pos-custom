<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Dummy Data
        $storeBanner = [
            'image' => 'https://picsum.photos/1200/400?random=1',
            'title' => 'Welcome to Our Store',
            'subtitle' => 'Best products for you',
        ];

        $productCategories = Category::all();

        $promoBanner = [
            'image' => 'https://picsum.photos/1200/200?random=7',
            'link' => '#',
        ];

        $products = Product::with('category')
            ->withSum('transactionDetails as sold_count', 'qty')
            ->orderByDesc('sold_count')
            ->take(10)
            ->get();

        $latestPosts = [
            ['id' => 1, 'title' => 'New Arrival', 'excerpt' => 'Check out our new collection.', 'image' => 'https://picsum.photos/300/200?random=100'],
            ['id' => 2, 'title' => 'Promo Alert', 'excerpt' => 'Get 50% off this weekend.', 'image' => 'https://picsum.photos/300/200?random=101'],
            ['id' => 3, 'title' => 'Tips & Tricks', 'excerpt' => 'How to style your outfit.', 'image' => 'https://picsum.photos/300/200?random=102'],
        ];

        return Inertia::render('EndUser/Home/Index', [
            'storeBanner' => $storeBanner,
            'productCategories' => $productCategories,
            'promoBanner' => $promoBanner,
            'products' => $products,
            'latestPosts' => $latestPosts,
        ]);
    }

    public function products()
    {
        $products = Product::with('category')
            ->withSum('transactionDetails as sold_count', 'qty')
            ->latest()
            ->paginate(12);

        return Inertia::render('EndUser/Products/Index', [
            'products' => $products,
        ]);
    }

    public function search()
    {
        $recentSearches = ['Baju Muslim', 'Gamis', 'Jilbab Instan', 'Koko'];
        $popularProducts = [];
        for ($i = 1; $i <= 6; $i++) {
            $popularProducts[] = [
                'id' => $i,
                'name' => "Popular Item $i",
                'price' => rand(50000, 250000),
                'image' => 'https://picsum.photos/150/150?random='.($i + 100),
                'stock' => rand(0, 20),
                'category' => 'Popular',
                'rating' => round(rand(40, 50) / 10, 1),
                'sold_count' => rand(100, 1000),
            ];
        }

        return Inertia::render('EndUser/Search/Index', [
            'recentSearches' => $recentSearches,
            'popularProducts' => $popularProducts,
        ]);
    }

    public function articles()
    {
        $articles = [];
        for ($i = 1; $i <= 10; $i++) {
            $articles[] = [
                'id' => $i,
                'title' => "Article Title $i: Tips for Muslimah Fashion",
                'excerpt' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'image' => 'https://picsum.photos/600/400?random='.($i + 200),
                'date' => now()->subDays($i)->format('d M Y'),
            ];
        }

        return Inertia::render('EndUser/Articles/Index', [
            'articles' => $articles,
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

    public function show($id)
    {
        // Dummy Product Data
        $product = [
            'id' => $id,
            'name' => 'Gamis Syari Premium Elegant Collection',
            'slug' => 'gamis-syari-premium-elegant-collection',
            'price' => 450000,
            'original_price' => 550000,
            'discount_percent' => 18,
            'rating' => 4.8,
            'review_count' => 156,
            'sold_count' => 1250,
            'stock' => 15,
            'sku' => 'GMS-PRE-001',
            'category' => 'Gamis',
            'brand' => 'Muslimah Collection',
            'weight' => 500,
            'images' => [
                'https://picsum.photos/800/1000?random=501',
                'https://picsum.photos/800/1000?random=502',
                'https://picsum.photos/800/1000?random=503',
                'https://picsum.photos/800/1000?random=504',
                'https://picsum.photos/800/1000?random=505',
            ],
            'variants' => [
                'colors' => [
                    ['id' => 1, 'name' => 'Navy', 'hex' => '#1e3a5f', 'stock' => 5],
                    ['id' => 2, 'name' => 'Maroon', 'hex' => '#800020', 'stock' => 4],
                    ['id' => 3, 'name' => 'Dusty Pink', 'hex' => '#d4a5a5', 'stock' => 3],
                    ['id' => 4, 'name' => 'Sage Green', 'hex' => '#9caf88', 'stock' => 3],
                ],
                'sizes' => [
                    ['id' => 1, 'name' => 'S', 'stock' => 2],
                    ['id' => 2, 'name' => 'M', 'stock' => 5],
                    ['id' => 3, 'name' => 'L', 'stock' => 5],
                    ['id' => 4, 'name' => 'XL', 'stock' => 3],
                    ['id' => 5, 'name' => 'XXL', 'stock' => 0],
                ],
            ],
            'description' => '<p>Gamis Syari Premium dengan desain elegan dan modern. Cocok untuk acara formal maupun sehari-hari.</p><ul><li>Bahan premium berkualitas tinggi</li><li>Nyaman dipakai seharian</li><li>Tidak menerawang</li><li>Mudah disetrika</li></ul>',
            'specifications' => [
                ['label' => 'Bahan', 'value' => 'Wollycrepe Premium'],
                ['label' => 'Berat', 'value' => '500 gram'],
                ['label' => 'Panjang', 'value' => '140 cm'],
                ['label' => 'Lebar Dada', 'value' => '110 cm'],
                ['label' => 'Panjang Lengan', 'value' => '58 cm'],
                ['label' => 'Model', 'value' => 'Busui Friendly'],
            ],
            'size_chart' => [
                ['size' => 'S', 'chest' => '96 cm', 'length' => '135 cm', 'sleeve' => '55 cm'],
                ['size' => 'M', 'chest' => '100 cm', 'length' => '138 cm', 'sleeve' => '56 cm'],
                ['size' => 'L', 'chest' => '106 cm', 'length' => '140 cm', 'sleeve' => '57 cm'],
                ['size' => 'XL', 'chest' => '112 cm', 'length' => '142 cm', 'sleeve' => '58 cm'],
                ['size' => 'XXL', 'chest' => '118 cm', 'length' => '144 cm', 'sleeve' => '59 cm'],
            ],
            'shipping' => [
                'origin' => 'Jakarta Selatan',
                'weight' => '500 gram',
                'free_shipping' => true,
            ],
        ];

        // Dummy Reviews
        $reviews = [
            [
                'id' => 1,
                'user' => 'Aisyah R.',
                'avatar' => 'https://picsum.photos/50/50?random=601',
                'rating' => 5,
                'date' => '15 Jan 2025',
                'content' => 'Bahannya bagus banget, tidak menerawang. Jahitannya rapi. Sesuai ekspektasi!',
                'images' => ['https://picsum.photos/100/100?random=611', 'https://picsum.photos/100/100?random=612'],
                'variant' => 'Navy, L',
            ],
            [
                'id' => 2,
                'user' => 'Fatimah S.',
                'avatar' => 'https://picsum.photos/50/50?random=602',
                'rating' => 5,
                'date' => '12 Jan 2025',
                'content' => 'Suka banget sama warnanya! Pengiriman cepat, packaging aman.',
                'images' => [],
                'variant' => 'Dusty Pink, M',
            ],
            [
                'id' => 3,
                'user' => 'Khadijah M.',
                'avatar' => 'https://picsum.photos/50/50?random=603',
                'rating' => 4,
                'date' => '10 Jan 2025',
                'content' => 'Overall bagus, cuma agak kebesaran di bagian lengan. Tapi tetap recommended!',
                'images' => ['https://picsum.photos/100/100?random=613'],
                'variant' => 'Sage Green, S',
            ],
        ];

        // Dummy Related Products
        $relatedProducts = [];
        for ($i = 1; $i <= 8; $i++) {
            $relatedProducts[] = [
                'id' => 100 + $i,
                'name' => "Produk Terkait $i",
                'price' => rand(150000, 500000),
                'original_price' => rand(200000, 600000),
                'image' => 'https://picsum.photos/200/300?random='.(700 + $i),
                'rating' => round(rand(40, 50) / 10, 1),
                'sold_count' => rand(50, 500),
                'stock' => rand(0, 30),
            ];
        }

        return Inertia::render('EndUser/Products/Show', [
            'product' => $product,
            'reviews' => $reviews,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
