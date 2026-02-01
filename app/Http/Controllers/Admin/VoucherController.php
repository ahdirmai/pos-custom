<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $vouchers = Voucher::query()
            ->when($request->search, function ($query, $search) {
                $query->where('code', 'like', "%{$search}%")
                      ->orWhere('name', 'like', "%{$search}%");
            })
            ->withCount('usages')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Summary Stats
        $totalVouchers = Voucher::count();
        $activeVouchers = Voucher::active()->count(); // Using scopeActive
        $totalUsed = \App\Models\VoucherUsage::count();
        $totalDiscountGiven = \App\Models\VoucherUsage::sum('discount_amount');

        return Inertia::render('Dashboard/Vouchers/Index', [
            'vouchers' => $vouchers,
            'filters' => $request->only(['search']),
            'summary' => [
                'total_vouchers' => $totalVouchers,
                'active_vouchers' => $activeVouchers,
                'total_used' => $totalUsed,
                'total_discount_given' => $totalDiscountGiven,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Voucher $voucher)
    {
        $voucher->load(['usages.transaction', 'usages.customer']);
        
        $usages = $voucher->usages()
            ->with(['transaction', 'customer'])
            ->latest('used_at')
            ->paginate(10); // Pagination for usages list

        return Inertia::render('Dashboard/Vouchers/Show', [
            'voucher' => $voucher,
            'usages' => $usages,
        ]);
    }    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Dashboard/Vouchers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:vouchers,code|max:255',
            'name' => 'required|string|max:255',
            'discount_target' => 'required|in:subtotal,shipping',
            'discount_type' => 'required|in:fixed,percentage',
            'amount' => 'required|numeric|min:0',
            'min_spend' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'quota' => 'required|integer|min:1',
            'limit_per_user' => 'nullable|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        Voucher::create($validated);

        return redirect()->route('vouchers.index')->with('success', 'Voucher created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Voucher $voucher)
    {
        return Inertia::render('Dashboard/Vouchers/Edit', [
            'voucher' => $voucher,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Voucher $voucher)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:vouchers,code,' . $voucher->id,
            'name' => 'required|string|max:255',
            'discount_target' => 'required|in:subtotal,shipping',
            'discount_type' => 'required|in:fixed,percentage',
            'amount' => 'required|numeric|min:0',
            'min_spend' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'quota' => 'required|integer|min:1',
            'limit_per_user' => 'nullable|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        $voucher->update($validated);

        return redirect()->route('vouchers.index')->with('success', 'Voucher updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Voucher $voucher)
    {
        $voucher->delete();

        return redirect()->route('vouchers.index')->with('success', 'Voucher deleted successfully.');
    }
}
