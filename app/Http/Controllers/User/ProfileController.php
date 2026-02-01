<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get provinces for address modal
        $provinces = \Laravolt\Indonesia\Models\Province::orderBy('name')->get();

        // Get user's saved addresses
        $addresses = \App\Models\CustomerAddress::where('user_id', $user->id)
            ->with(['province', 'city', 'district', 'village'])
            ->orderBy('is_primary', 'desc')
            ->get()
            ->map(function ($addr) {
                return [
                    'id' => $addr->id,
                    'label' => $addr->label,
                    'recipient' => $addr->recipient_name,
                    'recipient_name' => $addr->recipient_name,
                    'phone' => $addr->phone_number,
                    'phone_number' => $addr->phone_number,
                    'address' => $addr->address,
                    'city' => $addr->city->name ?? '',
                    'postal_code' => $addr->postal_code,
                    'is_primary' => $addr->is_primary,
                    'province_code' => $addr->province_code,
                    'city_code' => $addr->city_code,
                    'district_code' => $addr->district_code,
                    'village_code' => $addr->village_code,
                ];
            });

        // return $user->customer;

        // Get user's orders
        $orders = Transaction::where('user_id', $user->id)
            ->with('details.product')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'invoice' => $transaction->invoice,
                    'date' => \Carbon\Carbon::parse($transaction->getRawOriginal('created_at'))->format('d M Y'),
                    'status' => $transaction->order_status,
                    'status_label' => $this->getStatusLabel($transaction->order_status),
                    'total' => $transaction->grand_total,
                    'tracking' => $transaction->tracking_number,
                    'items' => $transaction->details->map(function ($detail) {
                        return [
                            'name' => $detail->product->title ?? 'Unknown',
                            'image' => $detail->product->image ?? null,
                        ];
                    }),
                ];
            });

        // Get wishlist (placeholder - implement if you have wishlist)
        $wishlist = [];

        // Get pending reviews (placeholder - implement if you have reviews)
        $pendingReviews = [];

        return Inertia::render('EndUser/Profile/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '-',
                'avatar' => $user->avatar ?? 'https://ui-avatars.com/api/?name='.urlencode($user->name),
                'joined_at' => $user->created_at->format('F Y'),
            ],
            'provinces' => $provinces,
            'addresses' => $addresses,
            'orders' => $orders,
            'wishlist' => $wishlist,
            'pendingReviews' => $pendingReviews,
        ]);
    }

    private function getStatusLabel($status)
    {
        return match ($status) {
            'pending' => 'Belum Bayar',
            'processing' => 'Diproses',
            'shipped' => 'Dikirim',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            default => ucfirst($status),
        };
    }
}
