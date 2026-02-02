<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CustomerAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    /**
     * Store a new address
     */
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'province_code' => 'required|string',
            'city_code' => 'required|string',
            'district_code' => 'required|string',
            'village_code' => 'required|string',
            'postal_code' => 'nullable|string|max:10',
            'is_primary' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // If setting as primary, unset other primary addresses
            if ($request->is_primary) {
                CustomerAddress::where('user_id', Auth::id())
                    ->update(['is_primary' => false]);
            }

            CustomerAddress::create([
                'user_id' => Auth::id(),
                'label' => $request->label,
                'recipient_name' => $request->recipient_name,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'province_code' => $request->province_code,
                'city_code' => $request->city_code,
                'district_code' => $request->district_code,
                'village_code' => $request->village_code,
                'postal_code' => $request->postal_code,
                'is_primary' => $request->is_primary ?? false,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Alamat berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menambahkan alamat: ' . $e->getMessage()]);
        }
    }

    /**
     * Update an existing address
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'label' => 'required|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'province_code' => 'required|string',
            'city_code' => 'required|string',
            'district_code' => 'required|string',
            'village_code' => 'required|string',
            'postal_code' => 'nullable|string|max:10',
            'is_primary' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            $address = CustomerAddress::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // If setting as primary, unset other primary addresses
            if ($request->is_primary) {
                CustomerAddress::where('user_id', Auth::id())
                    ->where('id', '!=', $id)
                    ->update(['is_primary' => false]);
            }

            $address->update([
                'label' => $request->label,
                'recipient_name' => $request->recipient_name,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'province_code' => $request->province_code,
                'city_code' => $request->city_code,
                'district_code' => $request->district_code,
                'village_code' => $request->village_code,
                'postal_code' => $request->postal_code,
                'is_primary' => $request->is_primary ?? false,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Alamat berhasil diperbarui');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui alamat: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete an address
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $address = CustomerAddress::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $address->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Alamat berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus alamat: ' . $e->getMessage()]);
        }
    }

    /**
     * Set address as primary
     */
    public function setPrimary($id)
    {
        try {
            DB::beginTransaction();

            // Unset all primary addresses
            CustomerAddress::where('user_id', Auth::id())
                ->update(['is_primary' => false]);

            // Set selected address as primary
            $address = CustomerAddress::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            $address->update(['is_primary' => true]);

            DB::commit();

            return redirect()->back()->with('success', 'Alamat utama berhasil diatur');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal mengatur alamat utama: ' . $e->getMessage()]);
        }
    }
}
