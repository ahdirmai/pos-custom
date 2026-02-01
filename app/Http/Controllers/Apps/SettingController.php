<?php
namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Show the target settings page
     */
    public function target()
    {
        $settings = [
            'monthly_sales_target' => Setting::get('monthly_sales_target', 0),
        ];

        return Inertia::render('Dashboard/Settings/Target', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update target settings
     */
    public function updateTarget(Request $request)
    {
        $request->validate([
            'monthly_sales_target' => 'required|numeric|min:0',
        ]);

        Setting::set(
            'monthly_sales_target',
            $request->monthly_sales_target,
            'Target penjualan bulanan'
        );

        return back()->with('success', 'Target berhasil disimpan');
    }

    /**
     * Store profile settings page
     */
    public function storeProfile()
    {
        $settings = [
            'store_name'    => Setting::get('store_name', ''),
            'store_code'    => Setting::get('store_code', ''),
            'store_logo'    => Setting::get('store_logo', ''),
            'store_address' => Setting::get('store_address', ''),
            'store_phone'   => Setting::get('store_phone', ''),
            'store_email'   => Setting::get('store_email', ''),
            'store_website' => Setting::get('store_website', ''),
            'store_city'    => Setting::get('store_city', ''),
        ];

        return Inertia::render('Dashboard/Settings/Store', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update store profile settings
     */
    public function updateStoreProfile(Request $request)
    {
        $request->validate([
            'store_name'    => 'required|string|max:255',
            'store_code'    => ['required', 'string', 'max:10', 'regex:/^\S*$/'], // No spaces allowed
            'store_address' => 'required|string|max:500',
            'store_phone'   => 'nullable|string|max:50',
            'store_email'   => 'nullable|email|max:255',
            'store_website' => 'nullable|string|max:255',
            'store_city'    => 'nullable|string|max:255',
            'store_logo'    => 'nullable|image|max:2048',
        ], [
            'store_code.regex' => 'Kode toko tidak boleh mengandung spasi.',
        ]);

        $logoPath = Setting::get('store_logo');

        if ($request->file('store_logo')) {
            if ($logoPath) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('store_logo')->store('store', 'public');
        }

        Setting::set('store_name', $request->store_name, 'Nama toko');
        Setting::set('store_code', strtoupper($request->store_code), 'Kode toko');
        Setting::set('store_address', $request->store_address, 'Alamat toko');
        Setting::set('store_phone', $request->store_phone, 'Telepon toko');
        Setting::set('store_email', $request->store_email, 'Email toko');
        Setting::set('store_website', $request->store_website, 'Website toko');
        Setting::set('store_city', $request->store_city, 'Kota/Kabupaten toko');
        Setting::set('store_logo', $logoPath, 'Logo toko');

        return back()->with('success', 'Profil toko berhasil diperbarui');
    }

    /**
     * Show shipping settings page
     */
    public function shipping()
    {
        $settings = [
            'shop_postal_code'  => Setting::get('shop_postal_code', ''),
            'shipping_provider' => Setting::get('shipping_provider', 'biteship'),
            'biteship_api_key'  => Setting::get('biteship_api_key', ''),
            'biteship_base_url' => Setting::get('biteship_base_url', 'https://api.biteship.com'),
        ];

        return Inertia::render('Dashboard/Settings/Shipping', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update shipping settings
     */
    public function updateShipping(Request $request)
    {
        $request->validate([
            'shop_postal_code' => 'required|string|max:10',
            'shipping_provider' => 'required|string|in:biteship',
            'biteship_api_key' => 'required|string',
            'biteship_base_url' => 'required|string|url',
        ]);

        Setting::set('shop_postal_code', $request->shop_postal_code, 'Kode Pos Toko');
        Setting::set('shipping_provider', $request->shipping_provider, 'Provider Pengiriman');
        Setting::set('biteship_api_key', $request->biteship_api_key, 'API Key Biteship');
        Setting::set('biteship_base_url', $request->biteship_base_url, 'Base URL Biteship');

        return back()->with('success', 'Konfigurasi pengiriman berhasil diperbarui');
    }
}
