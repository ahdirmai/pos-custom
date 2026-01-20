<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
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

        $productCategories = [
            ['id' => 1, 'name' => 'Fashion', 'image' => 'https://picsum.photos/200/200?random=2'],
            ['id' => 2, 'name' => 'Electronics', 'image' => 'https://picsum.photos/200/200?random=3'],
            ['id' => 3, 'name' => 'Home', 'image' => 'https://picsum.photos/200/200?random=4'],
            ['id' => 4, 'name' => 'Beauty', 'image' => 'https://picsum.photos/200/200?random=5'],
            ['id' => 5, 'name' => 'Sports', 'image' => 'https://picsum.photos/200/200?random=6'],
        ];

        $promoBanner = [
             'image' => 'https://picsum.photos/1200/200?random=7',
             'link' => '#',
        ];

        $topCategories = [];
        for ($i = 1; $i <= 4; $i++) {
            $products = [];
            for ($j = 1; $j <= 10; $j++) {
                $products[] = [
                    'id' => $j,
                    'name' => "Product $j - Cat $i",
                    'price' => rand(10000, 500000),
                    'stock' => rand(0, 20), // Added random stock
                    'image' => 'https://picsum.photos/200/300?random=' . ($i * 10 + $j),
                    'category' => "Category $i",
                ];
            }
            $topCategories[] = [
                'id' => $i,
                'name' => "Top Category $i",
                'products' => $products,
            ];
        }

        $latestPosts = [
            ['id' => 1, 'title' => 'New Arrival', 'excerpt' => 'Check out our new collection.', 'image' => 'https://picsum.photos/300/200?random=100'],
            ['id' => 2, 'title' => 'Promo Alert', 'excerpt' => 'Get 50% off this weekend.', 'image' => 'https://picsum.photos/300/200?random=101'],
            ['id' => 3, 'title' => 'Tips & Tricks', 'excerpt' => 'How to style your outfit.', 'image' => 'https://picsum.photos/300/200?random=102'],
        ];

        return Inertia::render('EndUser/Home/Index', [
            'storeBanner' => $storeBanner,
            'productCategories' => $productCategories,
            'promoBanner' => $promoBanner,
            'topCategories' => $topCategories,
            'latestPosts' => $latestPosts,
        ]);
    }

    public function products()
    {
        $products = [];
        for ($i = 1; $i <= 20; $i++) {
            $products[] = [
                'id' => $i,
                'name' => "Product $i",
                'price' => rand(10000, 500000),
                'stock' => rand(0, 20), // Added random stock
                'image' => 'https://picsum.photos/200/300?random=' . ($i + 50),
                'category' => "Category " . rand(1, 4),
            ];
        }

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
                 'image' => 'https://picsum.photos/150/150?random=' . ($i + 100),
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
                'excerpt' => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                'image' => 'https://picsum.photos/600/400?random=' . ($i + 200),
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
            'invoice' => 'INV-' . strtoupper(substr(md5($id . time()), 0, 8)),
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
}
