<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductNotificationRead;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Mark a single low-stock notification as read for the current user.
     */
    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request)
    {
        $request->validate([
            'id' => ['required', 'uuid', 'exists:notifications,id'],
        ]);

        $notification = $request->user()
            ->notifications()
            ->where('id', $request->id)
            ->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return back();
    }
}
