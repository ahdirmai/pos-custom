<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    /**
     * Store a new lead (test drive booking / consultation request).
     *
     * This is additive to the self-checkout flow: customers can either
     * buy directly (cart -> checkout) or submit a lead to be contacted
     * by sales for a test drive.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:100'],
            'interested_product_id' => ['nullable', 'integer', 'exists:products,id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        Lead::create([
            ...$validated,
            'source' => 'car_landing',
        ]);

        return back()->with('success', 'Terima kasih! Tim sales kami akan segera menghubungi Anda.');
    }
}
