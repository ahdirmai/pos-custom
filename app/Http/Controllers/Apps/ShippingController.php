<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Services\BiteshipService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingController extends Controller
{
    protected $biteshipService;

    public function __construct(BiteshipService $biteshipService)
    {
        $this->biteshipService = $biteshipService;
    }

    public function test()
    {
        return Inertia::render('Dashboard/Shippings/Test');
    }

    public function checkRates(Request $request)
    {
        $request->validate([
            'destination_postal_code' => 'required|numeric|digits:5',
            'weight' => 'required|numeric|min:1',
        ]);

        $items = [
            [
                'name' => 'Test Item',
                'description' => 'Item for testing rates',
                'value' => 10000, // Dummy value
                'length' => 10,
                'width' => 10,
                'height' => 10,
                'weight' => (int) $request->weight,
                'quantity' => 1,
            ],
        ];

        $destinationDTO = [
            'postal_code' => $request->destination_postal_code,
        ];

        $result = $this->biteshipService->checkRates($destinationDTO, $items);

        if (isset($result['error'])) {
            return back()->with('error', $result['error']);
        }

        return back()->with([
            'success' => 'Cek ongkir berhasil.',
            'rates' => $result['pricing'] ?? [],
            'destination' => $result['destination'] ?? null,
        ]);
    }
}
