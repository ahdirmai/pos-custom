<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Notifications\StockAlert;
use App\Notifications\DebtAlert;

class NotificationService
{
    /**
     * Notify Superadmin about low stock.
     * Handles deduplication.
     */
    public function sendStockAlert($product)
    {
        $users = User::role('super-admin')->get();

        foreach ($users as $user) {
            $data = [
                'p_id' => $product->id,
                'name' => $product->title,
                'qty' => $product->stock,
                'lvl' => $product->stock <= 0 ? 'empty' : 'low',
            ];

            $this->createOrUpdate($user, StockAlert::class, $data, function ($existingData, $newData) {
                // Check if referring to same product
                return isset($existingData['p_id']) && $existingData['p_id'] == $newData['p_id'];
            });
        }
    }

    /**
     * Notify Superadmin about Debt/Receivable.
     * Handles deduplication.
     */
    public function sendDebtAlert($transaction, $type)
    {
        $users = User::role('super-admin')->get();

        foreach ($users as $user) {
            $data = [
                'inv_id' => $type === 'payable' ? $transaction->document_number : $transaction->invoice,
                'name' => $type === 'payable' ? $transaction->supplier->name : $transaction->customer->name,
                'amt' => $transaction->total - $transaction->paid,
                'type' => $type,
                'ref_id' => $transaction->id,
            ];

            $this->createOrUpdate($user, DebtAlert::class, $data, function ($existingData, $newData) {
                // Check if referring to same transaction (unique by type + ref_id, or inv_id)
                return isset($existingData['ref_id']) && 
                       $existingData['ref_id'] == $newData['ref_id'] && 
                       ($existingData['type'] ?? '') == $newData['type'];
            });
        }
    }

    /**
     * Core logic for "Single-Row Update"
     */
    private function createOrUpdate(User $user, string $typeClass, array $data, callable $matchCallback)
    {
        // Find existing unread notifications of this type for this user
        $existing = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', get_class($user))
            ->where('type', $typeClass)
            ->whereNull('read_at')
            ->get();

        $found = null;

        foreach ($existing as $notification) {
            $notificationData = json_decode($notification->data, true);
            if ($matchCallback($notificationData, $data)) {
                $found = $notification;
                break;
            }
        }

        if ($found) {
            // Update existing
            DB::table('notifications')
                ->where('id', $found->id)
                ->update([
                    'data' => json_encode($data),
                    'updated_at' => now(),
                ]);
        } else {
            // Create new
            DB::table('notifications')->insert([
                'id' => (string) Str::uuid(),
                'type' => $typeClass,
                'notifiable_id' => $user->id,
                'notifiable_type' => get_class($user),
                'data' => json_encode($data),
                'read_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
