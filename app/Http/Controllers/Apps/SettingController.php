<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ThemeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Province;
use Laravolt\Indonesia\Models\Village;

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
        $provinceCode = Setting::get('store_province_code', '');
        $cityCode = Setting::get('store_city_code', '');
        $districtCode = Setting::get('store_district_code', '');
        $villageCode = Setting::get('store_village_code', '');

        $settings = [
            'store_name' => Setting::get('store_name', ''),
            'store_code' => Setting::get('store_code', ''),
            'store_logo' => Setting::get('store_logo', ''),
            'store_address' => Setting::get('store_address', ''),
            'store_phone' => Setting::get('store_phone', ''),
            'store_email' => Setting::get('store_email', ''),
            'store_website' => Setting::get('store_website', ''),
            'store_province_code' => $provinceCode,
            'store_city_code' => $cityCode,
            'store_district_code' => $districtCode,
            'store_village_code' => $villageCode,
        ];

        // Pre-load dependent lists so selects are populated on page load
        $cities = $provinceCode ? City::where('province_code', $provinceCode)->select('code', 'name')->orderBy('name')->get() : [];
        $districts = $cityCode ? District::where('city_code', $cityCode)->select('code', 'name')->orderBy('name')->get() : [];
        $villages = $districtCode ? Village::where('district_code', $districtCode)->select('code', 'name', 'meta')->orderBy('name')->get() : [];

        return Inertia::render('Dashboard/Settings/Store', [
            'settings' => $settings,
            'provinces' => Province::select('code', 'name')->orderBy('name')->get(),
            'cities' => $cities,
            'districts' => $districts,
            'villages' => $villages,
        ]);
    }

    /**
     * Update store profile settings
     */
    public function updateStoreProfile(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_code' => ['required', 'string', 'max:10', 'regex:/^\S*$/'],
            'store_address' => 'required|string|max:500',
            'store_phone' => 'nullable|string|max:50',
            'store_email' => 'nullable|email|max:255',
            'store_website' => 'nullable|string|max:255',
            'store_province_code' => 'nullable|string|max:20',
            'store_city_code' => 'nullable|string|max:20',
            'store_district_code' => 'nullable|string|max:20',
            'store_village_code' => 'nullable|string|max:20',
            'store_logo' => 'nullable|image|max:2048',
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

        // Resolve human-readable city name for backward compatibility (receipts, etc.)
        $cityName = '';
        if ($request->store_city_code) {
            $city = City::where('code', $request->store_city_code)->first();
            $cityName = $city?->name ?? '';
        }

        Setting::set('store_name', $request->store_name, 'Nama toko');
        Setting::set('store_code', strtoupper($request->store_code), 'Kode toko');
        Setting::set('store_address', $request->store_address, 'Alamat toko');
        Setting::set('store_phone', $request->store_phone, 'Telepon toko');
        Setting::set('store_email', $request->store_email, 'Email toko');
        Setting::set('store_website', $request->store_website, 'Website toko');
        Setting::set('store_province_code', $request->store_province_code, 'Kode provinsi toko');
        Setting::set('store_city_code', $request->store_city_code, 'Kode kota/kabupaten toko');
        Setting::set('store_district_code', $request->store_district_code, 'Kode kecamatan toko');
        Setting::set('store_village_code', $request->store_village_code, 'Kode kelurahan toko');
        Setting::set('store_city', $cityName, 'Kota/Kabupaten toko');

        // Auto-update shop_postal_code from village meta
        if ($request->store_village_code) {
            $village = Village::where('code', $request->store_village_code)->first();
            $meta = $village?->meta;
            if (is_string($meta)) {
                $meta = json_decode($meta, true);
            }
            $postalCode = $meta['pos'] ?? '';
            if ($postalCode) {
                Setting::set('shop_postal_code', $postalCode, 'Kode Pos Toko');
            }
        }

        Setting::set('store_logo', $logoPath, 'Logo toko');

        return back()->with('success', 'Profil toko berhasil diperbarui');
    }

    /**
     * Show shipping settings page
     */
    public function shipping()
    {
        $settings = [
            'shop_postal_code' => Setting::get('shop_postal_code', ''),
            'shipping_provider' => Setting::get('shipping_provider', 'biteship'),
            'biteship_api_key' => Setting::get('biteship_api_key', ''),
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

    /**
     * Show flash sale style settings page
     */
    public function flashSaleStyle()
    {
        $settings = [
            'flash_sale_badge_text' => Setting::get('flash_sale_badge_text', 'Flash Sale'),
            'flash_sale_bg_from' => Setting::get('flash_sale_bg_from', '#b91c1c'),
            'flash_sale_bg_via' => Setting::get('flash_sale_bg_via', '#ea580c'),
            'flash_sale_bg_to' => Setting::get('flash_sale_bg_to', '#f59e0b'),
            'flash_sale_text_color' => Setting::get('flash_sale_text_color', '#ffffff'),
            'flash_sale_muted_text_color' => Setting::get('flash_sale_muted_text_color', '#ffe7d6'),
        ];

        return Inertia::render('Dashboard/Settings/FlashSaleStyle', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update flash sale style settings
     */
    public function updateFlashSaleStyle(Request $request)
    {
        $request->validate([
            'flash_sale_badge_text' => 'required|string|max:50',
            'flash_sale_bg_from' => ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'flash_sale_bg_via' => ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'flash_sale_bg_to' => ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'flash_sale_text_color' => ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'flash_sale_muted_text_color' => ['required', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        Setting::set('flash_sale_badge_text', $request->flash_sale_badge_text, 'Teks badge flash sale');
        Setting::set('flash_sale_bg_from', $request->flash_sale_bg_from, 'Warna awal background flash sale');
        Setting::set('flash_sale_bg_via', $request->flash_sale_bg_via, 'Warna tengah background flash sale');
        Setting::set('flash_sale_bg_to', $request->flash_sale_bg_to, 'Warna akhir background flash sale');
        Setting::set('flash_sale_text_color', $request->flash_sale_text_color, 'Warna teks utama flash sale');
        Setting::set('flash_sale_muted_text_color', $request->flash_sale_muted_text_color, 'Warna teks pendukung flash sale');

        return back()->with('success', 'Style flash sale berhasil diperbarui');
    }

    /**
     * Show the theme (primary color) settings page.
     */
    public function theme(ThemeService $theme)
    {
        $hex = $theme->primaryHex();

        return Inertia::render('Dashboard/Settings/Theme', [
            'primaryHex' => $hex,
            'palette' => $theme->palette($hex),
            'defaultHex' => ThemeService::DEFAULT_PRIMARY,
            'presets' => [
                ['name' => 'Gold', 'hex' => '#cfaa08'],
                ['name' => 'Indigo', 'hex' => '#4f46e5'],
                ['name' => 'Emerald', 'hex' => '#059669'],
                ['name' => 'Rose', 'hex' => '#e11d48'],
                ['name' => 'Sky', 'hex' => '#0284c7'],
                ['name' => 'Violet', 'hex' => '#7c3aed'],
                ['name' => 'Orange', 'hex' => '#ea580c'],
                ['name' => 'Slate', 'hex' => '#475569'],
            ],
        ]);
    }

    /**
     * Persist the primary color.
     */
    public function updateTheme(Request $request)
    {
        $request->validate([
            'theme_primary' => ['required', 'regex:/^#([A-Fa-f0-9]{6})$/'],
        ]);

        Setting::set('theme_primary', strtolower($request->theme_primary), 'Warna dasar (primary) dashboard & toko');

        return back()->with('success', 'Warna tema berhasil diperbarui');
    }
}
