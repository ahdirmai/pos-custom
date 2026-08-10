# Plan: Car Dealership Landing Example Branch

> Branch: `example/car-dealership-landing`
> Sumber brief: landing page VinFast Limo Green (7-Seater EV) + katalog mobil VinFast lainnya.
> Tujuan: homepage jadi company-profile/landing dengan hero produk + katalog cross-sell, katalog produk generik yang sudah ada tetap dipertahankan, dan self-checkout (cart/checkout/shipping/payment/voucher) tetap sepenuhnya aktif untuk produk mobil, ditambah seeder produk mobil baru. Data showcase mobil disimpan di tabel terpisah `product_cars` agar tabel `products` tidak terganggu.

## 1. Branch Setup
- Buat & checkout branch baru: `example/car-dealership-landing` dari branch saat ini.
- Tidak ada perubahan destruktif ke `SampleDataSeeder`, `ProductFactory`, atau homepage retail lama — semuanya tetap ada sebagai basis/contoh retail.

## 2. Database — Tabel Terpisah `product_cars` (TIDAK menyentuh tabel `products`)
Alih-alih menambah kolom ke `products`, buat migration baru `create_product_cars_table` untuk tabel **baru** `product_cars` yang berelasi 1:1 ke `products` lewat `product_id` (unique foreign key, `onDelete('cascade')`). Tabel `products` beserta seluruh logic POS/retail existing **tidak disentuh sama sekali**:
- `id`
- `product_id` (unsignedBigInteger, unique, foreign key → `products.id`, cascade on delete)
- `subtitle` (string, nullable) — tagline singkat, misal "MPV Listrik 7-Seater".
- `highlight_specs` (json, nullable) — 4–6 badge spek singkat untuk section "Highlight Spesifikasi".
- `specs` (json, nullable) — spek lengkap terstruktur per tab: `performa`, `dimensi`, `fitur`, `baterai_charging`.
- `gallery` (json, nullable) — daftar nama file foto eksterior/interior.
- `price_max` (bigInteger, nullable) — batas atas rentang harga (`products.sell_price` tetap dipakai sebagai harga mulai).
- `price_note` (string, nullable) — disclaimer harga (misal "Harga OTR promo, dapat berubah").
- `is_featured` (boolean, default false) — menandai produk hero (Limo Green).
- `cta_whatsapp_message` (string, nullable) — teks WA pre-filled per model.
- `timestamps`.

Model baru `app/Models/ProductCar.php`:
- `$fillable` sesuai kolom di atas.
- `$casts`: `highlight_specs`, `specs`, `gallery` → `array`; `is_featured` → `boolean`.
- `belongsTo(Product::class)`.
- Accessor `priceRangeLabel` (contoh: "Rp299–389 jutaan", dihitung dari `product.sell_price` + `price_max`).

Update `app/Models/Product.php` — **hanya tambah relasi, tidak ubah `$fillable`/`$casts` existing**:
- Tambah `public function car() { return $this->hasOne(ProductCar::class); }`.
- Semua field & behaviour existing pada `Product` (harga, stok, flash sale, dsb.) tetap 100% sama seperti sekarang; data mobil selalu diakses lewat relasi `->car`.

## 3. Halaman Katalog Produk Existing — TETAP DIPERTAHANKAN, TIDAK DIUBAH
- Route `/products` (`ProductController@index`), `/product/{slug}` (`show`), `/categories`, `/search` tetap seperti sekarang — generik, tidak ada hardcode "fashion", otomatis bekerja untuk produk mobil begitu diseed.
- Tetap jadi jalur belanja utama (search, filter kategori/harga, sort, rating), diakses via menu navbar "Katalog".
- Section "Katalog Mobil Lain" di landing page adalah subset cross-sell (7 model VinFast) dengan tombol "Lihat Semua" mengarah ke `/products` — bukan pengganti halaman katalog penuh.

## 4. Self-Checkout — TETAP AKTIF PENUH, TIDAK DIMODIFIKASI
- Cart, Checkout (`CheckoutController`), Shipping (`BiteshipService`), Payment gateway (Midtrans/Xendit/transfer bank), Voucher (`VoucherService`), Order history (`OrderController`), Reviews, Wishlist — semua dipakai ulang apa adanya untuk produk mobil.
- Hero product & catalog card memakai `ProductCard`/`CartContext` existing sehingga mobil bisa langsung "Tambah ke Keranjang"/"Beli Sekarang", lanjut checkout normal.

## 5. Lead Capture (tambahan, bukan pengganti checkout)
- Migration + model `Lead` (`leads` table): `name`, `phone`, `city`, `interested_product_id` (nullable FK ke `products`), `source` (default `car_landing`), `notes`, timestamps.
- `App\Http\Controllers\User\LeadController@store` — validasi & simpan lead untuk booking test drive/konsultasi. Route: `POST /leads` (public, name `user.leads.store`).
- Terpisah dari tombol beli; hanya untuk keperluan test drive/konsultasi.

## 6. Backend: Landing Page Controller
Modifikasi `App\Http\Controllers\User\HomeController@index` (khusus branch ini) untuk membangun payload landing mobil:
- `heroProduct`: query `Product::whereHas('car', fn ($q) => $q->where('is_featured', true))->with('car')->first()` (Limo Green) — data spek diambil dari relasi `car` (`specs`, `highlight_specs`, `gallery`, `priceRangeLabel`, `cta_whatsapp_message`), digabung dengan field produk standar (id, slug, current_price, available_stock) agar bisa langsung ditambah ke cart.
- `catalog`: produk VinFast lainnya dengan `with('car')`, siap dipakai `ProductCard` (field harga/stok tetap dari `Product`, field showcase dari `car`).
- `productCategories`: `Category::all()` (City Car / SUV / MPV) untuk filter katalog di landing.
- `whatsappNumber`: dari `Setting::get('store_whatsapp', ...)`.
- Render `EndUser/CarLanding/Index` sebagai pengganti `EndUser/Home/Index` untuk route `user.index`.
- Tidak ada perubahan pada `CartController`, `CheckoutController`, `PaymentGatewayManager`, `OrderController`.

## 7. Frontend: Landing Page Baru
Buat `resources/js/Pages/EndUser/CarLanding/Index.jsx`, dibungkus `UserLayout` existing (CartProvider/WishlistProvider/Header/Footer/MobileNavbar/CartDrawer tetap berfungsi), urutan section sesuai brief:
1. **Hero** — foto Limo Green besar, headline/subheadline, badge harga. 3 CTA: "Tambah ke Keranjang/Beli Sekarang" (pakai `CartContext`, lanjut ke checkout normal), "Booking Test Drive" (scroll ke Lead Form), "Chat WhatsApp Sales" (`wa.me` prefilled).
2. **Highlight Spesifikasi** — grid icon card dari `heroProduct.highlight_specs` (pakai `@tabler/icons-react`).
3. **Galeri Foto** — grid foto eksterior/interior dari `heroProduct.gallery`.
4. **Spesifikasi Lengkap** — tab (Performa/Dimensi/Fitur/Baterai & Charging) dari `heroProduct.specs`.
5. **Kalkulator Simulasi Kredit** — input DP% & tenor (12/24/36/48 bulan), hitung estimasi cicilan flat dari harga produk (label jelas: estimasi, bukan resmi bank); hasil mengarahkan ke tombol Beli Sekarang.
6. **Skema Pembelian** — toggle/tabel "Termasuk Baterai" vs "Subscription Baterai" (konten statis).
7. **Katalog Mobil Lain** — grid `catalog` dengan filter kategori (chip dari `productCategories`), reuse `ProductCard` existing (support cart & wishlist otomatis) + link kecil "Tanya Sekarang" (WA) di tiap card + tombol "Lihat Semua" ke `/products`.
8. **Testimoni/Use case** — konten statis (fleet/rental/taksi).
9. **FAQ** — accordion statis (garansi, biaya charging, servis, termasuk FAQ "bisa beli online?").
10. **Lead Form** — Nama, No. HP/WA, Kota, dropdown "Model yang diminati" (dari `catalog` + hero), submit via Inertia `useForm` ke `user.leads.store`, toast sukses (`react-hot-toast`).
11. **Sticky WA button** (mobile, fixed bottom-right) — berdampingan dengan cart icon existing.
12. **Footer** — reuse `Footer` existing + baris disclaimer harga.

Komponen baru di `resources/js/Components/CarLanding/`: `SpecBadge.jsx`, `SpecTabs.jsx`, `CreditSimulator.jsx`, `PurchaseSchemeToggle.jsx`, `FaqAccordion.jsx`, `LeadForm.jsx`, `StickyWhatsAppButton.jsx`. Tidak perlu custom catalog card — reuse `ProductCard` yang sudah ada.

## 8. Seeder Produk Mobil
Buat seeder baru `database/seeders/CarSampleDataSeeder.php` (terpisah dari `SampleDataSeeder`, tidak menimpa contoh retail):
- Truncate `product_cars`/`products`/`categories` dengan pola sama seperti `SampleDataSeeder` (disable FK checks sementara).
- Kategori: `City Car`, `SUV`, `MPV / Fleet` — masing-masing dengan gambar placeholder yang diunduh via `downloadImage()`.
- 7 produk VinFast (VF3, VF5, VF e34, VF6, VF7, VF MPV7, **Limo Green**) dari brief section 3 & 4. Setiap model dibuat sebagai:
  1. Row `Product` standar — `title`, `description`, `category_id`, `barcode`, `sku`, `image`, `sell_price` (harga mulai riil dari brief, dipakai langsung untuk checkout), `is_pph23=false`, `stock` (angka riil, misal 5–10 unit, karena self-checkout akan mengurangi stok sungguhan). Tidak ada field baru di sini — struktur `Product` persis sama seperti contoh retail.
  2. Row `ProductCar` terkait (`product_id` = id produk di atas) — `subtitle`, `price_max`, `price_note` (disclaimer harga dapat berubah), `is_featured` (`true` hanya untuk Limo Green), `highlight_specs`, `specs` (detail lengkap untuk Limo Green; spek ringkas/placeholder untuk model lain sesuai catatan "Cek harga terbaru" di brief), `gallery` (nama file placeholder), `cta_whatsapp_message` (teks WA per model).
- Buat satu `StockBatch` per produk (qty_received/qty_remaining = stock, tanpa expiry) supaya logic FIFO checkout existing tetap berjalan tanpa modifikasi.
- Jalankan manual: `php artisan db:seed --class=CarSampleDataSeeder` (tidak didaftarkan ke `DatabaseSeeder::run()` default, agar tidak mengganggu seed retail).

## 9. Settings / Branding
- Tambahkan default `Setting`: `store_whatsapp` (nomor WA dealer placeholder), `theme_primary` diset ke hex hijau (sesuai branding EV di brief) supaya `ThemeService` merender warna hijau, bukan gold default.

## 10. Assets
- Placeholder foto diunduh dengan pola sama seperti `SampleDataSeeder` ke `storage/app/public/products` & `storage/app/public/category`, nama file jelas (`vinfast-limo-green.jpg`, `vinfast-vf3.jpg`, dst.) agar mudah diganti nanti.

## 11. Testing
- Pest feature test `tests/Feature/CarLandingPageTest.php`: `user.index` return 200, hero product & jumlah catalog tampil (seed via `CarSampleDataSeeder`).
- Pest feature test checkout end-to-end untuk produk mobil: tambah ke cart → `POST /checkout/store` → transaksi terbuat, `order_status` benar, stok batch berkurang.
- Pest test `LeadController@store`: payload valid membuat row `Lead`; payload invalid (misal HP kosong) gagal validasi.
- Jalankan `php artisan test --compact --filter=CarLanding`, `--filter=Checkout`, `--filter=Lead`; jalankan `vendor/bin/pint --dirty --format agent` untuk semua file PHP yang disentuh.

## Assumptions
- Data showcase mobil (spek, galeri, harga range, WA CTA) disimpan di tabel terpisah `product_cars` (relasi 1:1 ke `products`) supaya struktur tabel `products` dan seluruh logic POS/retail existing tidak berubah sama sekali — pendekatan ini juga membuat fitur showcase mudah dihapus/di-drop tanpa risiko ke data retail.
- Ini bukan brosur statis — toko mobil ini fully functional: Cart, Checkout, Shipping, Payment gateway, Voucher, Order history, Reviews, Wishlist semuanya aktif dan dipakai ulang tanpa modifikasi untuk produk VinFast.
- Halaman katalog produk generik (`/products`, `/categories`, `/search`) tetap dipertahankan sebagai jalur belanja utama; landing page hanya menambahkan showcase khusus di homepage.
- Lead Form (test drive/konsultasi) bersifat tambahan, tidak menggantikan tombol beli.
- Foto asli belum tersedia; placeholder stock/CDN dipakai dengan nama file jelas agar mudah diganti pemilik toko nantinya.
- Harga & spesifikasi diambil langsung dari brief; karena brief menyebut harga bersifat promosi/sementara, disclaimer ditampilkan di setiap tempat harga muncul.
