<?php

namespace App\Services;

use App\Models\Voucher;
use App\Models\VoucherUsage;
use Carbon\Carbon;

class VoucherService
{
    /**
     * Validate voucher code for a user and cart total.
     *
     * @param string $code
     * @param float $cartSubtotal
     * @param int|null $userId
     * @return array ['valid' => bool, 'voucher' => Voucher|null, 'message' => string]
     */
    public function validate($code, $cartSubtotal, $userId = null)
    {
        $voucher = Voucher::where('code', $code)->first();

        if (! $voucher) {
            return ['valid' => false, 'message' => 'Kode voucher tidak ditemukan.'];
        }

        if (! $voucher->is_active) {
            return ['valid' => false, 'message' => 'Voucher tidak aktif.'];
        }

        $now = Carbon::now();
        if ($now->lt($voucher->start_date)) {
            return ['valid' => false, 'message' => 'Voucher belum berlaku.'];
        }
        if ($now->gt($voucher->end_date)) {
            return ['valid' => false, 'message' => 'Voucher sudah kadaluarsa.'];
        }

        if ($voucher->quota <= $voucher->used_count) {
            return ['valid' => false, 'message' => 'Kuota voucher sudah habis.'];
        }

        if ($voucher->min_spend && $cartSubtotal < $voucher->min_spend) {
            return ['valid' => false, 'message' => 'Minimal belanja tidak terpenuhi (Min: ' . number_format($voucher->min_spend) . ').'];
        }

        if ($userId && $voucher->limit_per_user) {
            $userUsageCount = VoucherUsage::where('voucher_id', $voucher->id)
                ->where(function($q) use ($userId) {
                    $q->where('user_id', $userId)
                      ->orWhere('customer_id', $userId); // Fallback if $userId is passed as customer ID in legacy
                })
                ->count();
            
            if ($userUsageCount >= $voucher->limit_per_user) {
                return ['valid' => false, 'message' => 'Anda sudah mencapai batas penggunaan voucher ini.'];
            }
        }

        return ['valid' => true, 'voucher' => $voucher, 'message' => 'Voucher valid.'];
    }

    /**
     * Calculate discount based on voucher and totals.
     *
     * @param Voucher $voucher
     * @param float $subtotal
     * @param float $shippingCost
     * @return float
     */
    public function calculateDiscount(Voucher $voucher, $subtotal, $shippingCost)
    {
        $baseAmount = ($voucher->discount_target === 'shipping') ? $shippingCost : $subtotal;
        
        if ($baseAmount <= 0) return 0;

        $discount = 0;

        if ($voucher->discount_type === 'fixed') {
            $discount = $voucher->amount;
        } else { // percentage
            $discount = $baseAmount * ($voucher->amount / 100);
        }

        // Apply max discount cap for percentage
        if ($voucher->discount_type === 'percentage' && $voucher->max_discount && $discount > $voucher->max_discount) {
            $discount = $voucher->max_discount;
        }

        // Discount cannot exceed the base amount (e.g. free shipping shouldn't give money back)
        if ($discount > $baseAmount) {
            $discount = $baseAmount;
        }

        return $discount;
    }
}
