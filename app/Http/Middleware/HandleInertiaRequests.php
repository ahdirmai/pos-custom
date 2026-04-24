<?php

namespace App\Http\Middleware;

use App\Models\Payable;
use App\Models\Product;
use App\Models\Receivable;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $notifications = [];

        if ($request->user()) {
            $notifications = $request->user()->unreadNotifications()
                ->latest()
                ->limit(20)
                ->get()
                ->map(function ($n) {
                    $localData = is_string($n->data) ? json_decode($n->data, true) : $n->data;
                    return [
                        'id' => $n->id,
                        'type' => str_contains($n->type, 'StockAlert') ? 'stock' : 
                                 (str_contains($n->type, 'DebtAlert') && ($localData['type'] ?? '') === 'receivable' ? 'receivable' : 'payable'),
                        'data' => $localData,
                        'created_at' => $n->created_at->diffForHumans(),
                        'read_at' => $n->read_at,
                    ];
                });
        }

        $logo = \App\Models\Setting::get('store_logo');
        if ($logo && ! str_starts_with($logo, 'http') && ! str_starts_with($logo, '/storage')) {
            $logo = asset('storage/'.ltrim($logo, '/'));
        }

        $storeProfile = [
            'name' => \App\Models\Setting::get('store_name', 'Toko Anda'),
            'logo' => $logo,
            'address' => \App\Models\Setting::get('store_address', ''),
            'phone' => \App\Models\Setting::get('store_phone', ''),
            'email' => \App\Models\Setting::get('store_email', ''),
            'website' => \App\Models\Setting::get('store_website', ''),
            'city' => \App\Models\Setting::get('store_city', ''),
        ];

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user() ? $request->user()->getPermissions() : [],
                'super' => $request->user() ? $request->user()->isSuperAdmin() : false,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'rates' => fn () => $request->session()->get('rates'),
                'destination' => fn () => $request->session()->get('destination'),
            ],
            'notifications' => $notifications ?? [],
            'storeProfile' => $storeProfile,
            'cart' => function () use ($request) {
                if (!$request->user()) return ['items' => [], 'count' => 0, 'total' => 0];
                
                $cart = \App\Models\Cart::with('product.category', 'product.activeFlashSaleItem.flashSale')
                    ->where('user_id', $request->user()->id)
                    ->whereNull('cashier_id')
                    ->get();

                $items = $cart->map(function ($item) {
                     $price = (float) $item->product->current_price;
                     return [
                        'id' => $item->id, // Cart ID (for update/delete)
                        'product_id' => $item->product_id,
                        'name' => $item->product->title,
                        'image' => $item->product->image,
                        'price' => $price,
                        'original_price' => (float) $item->product->original_price,
                        'has_flash_sale' => (bool) $item->product->has_flash_sale,
                        'qty' => (int) $item->qty,
                        'category' => $item->product->category->name ?? 'Umum',
                     ];
                });

                return [
                    'items' => $items,
                    'count' => $cart->sum('qty'),
                    'total' => $cart->sum(fn($item) => $item->product->current_price * $item->qty),
                ];
            },
        ];
    }
}
