<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\ShippingCourier;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BiteshipService
{
    protected $apiKey;

    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = Setting::get('biteship_api_key');
        $this->baseUrl = Setting::get('biteship_base_url', 'https://api.biteship.com');
    }

    /**
     * Get available couriers
     */
    public function getCouriers()
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->get("{$this->baseUrl}/v1/couriers");

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Biteship getCouriers Error: '.$response->body());

            return null;
        } catch (\Exception $e) {
            Log::error('Biteship getCouriers Exception: '.$e->getMessage());

            return null;
        }
    }

    /**
     * Check shipping rates
     * Implements specifications from app/docs/check_rates_bitship.md
     *
     * @param  array  $destinationDTO  ['postal_code' => string, 'latitude' => ?float, 'longitude' => ?float]
     * @param  array  $items  [['name' => string, 'value' => int, 'weight' => int, 'quantity' => int]]
     */
    public function checkRates($destinationDTO, $items)
    {
        // $destinationDTO expects: ['postal_code' => '...', 'latitude' => '...', 'longitude' => '...']
        // OR just postal_code area_id if enabled.
        // For this implementation, we'll try to use postal_code logic if supported,
        // OR we might need to search for area_id first.

        // Let's implement the standard /v1/rates endpoint

        $originPostalCode = Setting::get('shop_postal_code');
        if (! $originPostalCode) {
            return ['error' => 'Kode pos toko belum diatur.'];
        }

        // Get active couriers from database
        $activeCouriers = ShippingCourier::where('is_active', true)->pluck('code')->toArray();
        $couriersList = ! empty($activeCouriers) ? implode(',', $activeCouriers) : 'biteship'; // Default to biteship (all) if none active or prevent error

        try {
            $payload = [
                'origin_postal_code' => $originPostalCode,
                'destination_postal_code' => $destinationDTO['postal_code'], // We assume user will provide postal code for testing
                // 'destination_latitude' => ..., // Optional for better accuracy
                // 'destination_longitude' => ...,
                'couriers' => $couriersList,
                'items' => $items, // Example: [['name' => 'Item 1', 'value' => 10000, 'weight' => 200, 'quantity' => 1]]
            ];

            // If we have active couriers in DB, we could filter here.
            // But for testing, let's send standard list or 'biteship' (all)

            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/v1/rates/couriers", $payload);

            if ($response->successful()) {
                // Parse response to ensure correct format
                return $response->json();
            }

            Log::error('Biteship checkRates Error: '.$response->body());

            // Handle specific Biteship errors if possible
            $errorMsg = $response->json('error') ?? 'Gagal mengambil tarif pengiriman.';
            return ['error' => $errorMsg];

        } catch (\Exception $e) {
            Log::error('Biteship checkRates Exception: '.$e->getMessage());

            return ['error' => 'Terjadi kesalahan sistem saat cek ongkir.'];
        }
    }
}
