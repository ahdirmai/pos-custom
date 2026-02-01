<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\ShippingCourier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ShippingCourierController extends Controller
{
    public function index()
    {
        $couriers = ShippingCourier::latest()->paginate(10);
        return Inertia::render('Dashboard/ShippingCouriers/Index', [
            'couriers' => $couriers,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:shipping_couriers,code',
            'name' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('shipping_couriers', 'public');
        }

        ShippingCourier::create([
            'code' => $request->code,
            'name' => $request->name,
            'image' => $imagePath, // Stores 'shipping_couriers/filename.jpg'
            'is_active' => $request->has('is_active') ? $request->is_active : true,
        ]);

        return back()->with('success', 'Kurir berhasil ditambahkan');
    }

    public function update(Request $request, ShippingCourier $shippingCourier)
    {
        $request->validate([
            'code' => 'required|string|unique:shipping_couriers,code,' . $shippingCourier->id,
            'name' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        $imagePath = $shippingCourier->getRawOriginal('image');

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('shipping_couriers', 'public');
        }

        $shippingCourier->update([
            'code' => $request->code,
            'name' => $request->name,
            'image' => $imagePath,
            'is_active' => $request->has('is_active') ? $request->is_active : true,
        ]);

        return back()->with('success', 'Kurir berhasil diperbarui');
    }

    public function destroy(ShippingCourier $shippingCourier)
    {
        $imagePath = $shippingCourier->getRawOriginal('image');
        if ($imagePath) {
            Storage::disk('public')->delete($imagePath);
        }
        
        $shippingCourier->delete();

        return back()->with('success', 'Kurir berhasil dihapus');
    }

    public function toggleActive(ShippingCourier $shippingCourier)
    {
        $shippingCourier->update([
            'is_active' => !$shippingCourier->is_active
        ]);

        return back()->with('success', 'Status kurir berhasil diperbarui');
    }
}
