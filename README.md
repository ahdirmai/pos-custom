# PT Riline Velocity Express (RVE) — Car Dealership Showroom

> Branch: `example/car-dealership-landing`
> Studi kasus: platform POS/E-commerce yang sama dipakai sebagai **showroom & dealer mobil listrik** — contoh vertikal otomotif (VinFast EV) di atas basis retail yang sudah ada.

Branch ini membuktikan bahwa platform POS + toko online generik (`pos-custom`) dapat dipakai lintas vertikal tanpa rewrite: **seluruh modul commerce (keranjang, checkout, ongkir/Biteship, voucher, payment gateway, riwayat pesanan) tetap berfungsi apa adanya** — hanya ditambahkan lapisan showcase showroom mobil di atasnya.

Perusahaan contoh: **PT Riline Velocity Express (RVE)** — dealer/showroom digital untuk mobil listrik VinFast.

---

## 🎯 Tujuan Branch

- Menampilkan **landing page showroom mobil** (hero product, spek, galeri, simulasi kredit, lead form) sebagai pengganti homepage retail generik.
- Katalog & detail produk bergaya **configurator Mercedes-Benz**: tab spek di sidebar, kolom harga/CTA di kanan, tanpa tab berulang di bawah.
- Seluruh produk mobil **bisa langsung dibeli** (cart → checkout → bayar → ongkir → voucher) memakai flow self-checkout yang sudah ada, **tanpa menyentuh** controller commerce.
- Data showcase mobil disimpan di tabel terpisah (`product_cars`, relasi 1:1 ke `products`) agar mudah dihapus/di-drop tanpa risiko ke data retail.
- **Lead capture** (booking test drive / konsultasi sales) tersimpan di tabel `leads`, independen dari flow beli langsung.

---

## ✨ Fitur Utama

### 1. Landing Page (`/`) — `EndUser/CarLanding/Index.jsx`

- **Header showroom** (dark, variant `showroom`) + hero product besar dengan CTA.
- Highlight spec, galeri, spesifikasi (tab), **simulasi kredit**, skema pembelian (baterai/pembelian penuh).
- Katalog cross-sell model lain, testimoni, FAQ, **Lead Form** (test drive/konsultasi).
- Sticky WhatsApp button + `CarFooter`.

### 2. Katalog (`/products`) — `EndUser/Products/Index.jsx`

- Halaman katalog generik yang dipakai ulang apa adanya; produk mobil muncul otomatis setelah diseed.
- Header **light** (`variant="light"`), filter/kategori/sort/pagination tetap berfungsi penuh.
- Gaya premium: aksen `gray-900`, kartu `CarCard`, tanpa hijau `primary`.

### 3. Detail Product (`/product/{slug}`) — `EndUser/Products/Show.jsx`

Layout configurator 3 kolom:

- **Kiri — Sidebar tabs**: Performa / Dimensi / Baterai & Charging / Fitur (aktif = `bg-gray-900`), **color picker**, dan **Deskripsi** (di sidebar saja — tidak ada tab "Spesifikasi Lengkap" berulang di bawah).
- **Tengah — Hero image** (aspect 16/10) + galeri thumb + lightbox.
- **Kanan — Kolom info**: judul (font-serif), harga OTR, spec ringkas dari tab aktif, CTA (Beli Sekarang / Tambah ke Keranjang / Tanya Sales via WhatsApp), color picker mobile.
- **Bawah**: Feature Highlights, **Ulasan Pelanggan** (tanpa tab), trust strip, related cars, mobile sticky bar.

### 4. Header 3 Varian (`EndUser/Header.jsx`)

- `showroom` — dark, untuk landing page.
- `light` — putih fixed `h-[68px]`, nav **Beranda `/`** & **Katalog `/products`** + CTA Test Drive + cart badge; dipakai di Katalog & Detail Product.
- `default` — header retail yang sudah ada (untuk halaman lain yang tidak diubah).

### 5. Lead Capture (`POST /leads`)

- Form booking test drive/konsultasi → tabel `leads` (source `car_landing`), validasi nama & no. HP, toast sukses. Tidak membuat order.

---

## 🗄️ Data Layer (tambahan, additive)

| Tabel/Model                   | Keterangan                                                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `product_cars` (`ProductCar`) | Relasi 1:1 ke `products`. Field: `subtitle`, `highlight_specs`, `specs` (group `performa`/`dimensi`/`baterai_charging`/`fitur`), `gallery`, `price_max`, `price_note`, `is_featured`, `cta_whatsapp_message`. |
| `leads` (`Lead`)              | Lead test drive/konsultasi: nama, HP, kota, model, `source`.                                                                                                                                                  |
| `products.slug`               | Kolom slug ditambahkan; routing `/product/{slug}` (fallback ke `id`).                                                                                                                                         |

> Tabel `products` **tidak** ditambah kolom khusus mobil — semua atribut showcase hidup di `product_cars`.

**Settings** (via `Setting`/`ThemeService`):

- `store_name` = **PT Riline Velocity Express (RVE)**
- `store_whatsapp` = nomor WhatsApp dealer (mis. `628111222333`)
- `theme_primary` = hijau EV `#0f9d58` (di-set seeder; di frontend showroom aksen memakai `gray-900`)

---

## 🚀 Setup di Local

```bash
# 1. Clone & masuk branch
git clone https://github.com/ahdirmai/pos-custom.git
cd pos-custom
git checkout example/car-dealership-landing

# 2. Environment
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan storage:link

# 3. Migrasi + seed data showroom
php artisan migrate:fresh --seed        # DatabaseSeeder → CarSampleDataSeeder (7 model VinFast, 3 kategori, leads, StockBatch)

# 4. Aset frontend
npm run dev       # atau npm run build
```

Akses:

- Landing: `http://pos-custom.test/`
- Katalog: `http://pos-custom.test/products`
- Detail: `http://pos-custom.test/product/vinfast-vf-3` (dan slug lain)

### Akun Default (Dashboard admin tetap tersedia)

- **Admin Utama**: `arya@gmail.com` / `password`
- **User Kasir**: `cashier@gmail.com` / `password`

---

## 🧪 Testing

```bash
php artisan test --filter="CarLanding|Lead|Checkout"
```

Hasil saat ini: **25 tests passed (134 assertions)** — mencakup:

- `CarLandingPageTest` — landing 200, hero product, catalog, kategori, whatsapp, wishlist.
- `LeadTest` — valid & invalid payload pada `LeadController@store`.
- `CarCheckoutTest` — checkout end-to-end produk mobil (cart → checkout → stok berkurang via `StockBatch`).

---

## 📁 Struktur File Baru (branch ini)

```
app/Http/Controllers/User/LeadController.php   # Lead capture
app/Models/Lead.php
app/Models/ProductCar.php
database/migrations/2026_08_10_*_product_cars, _leads, add_slug
database/seeders/CarSampleDataSeeder.php       # 7 VinFast + kategori + settings
resources/js/Pages/EndUser/CarLanding/Index.jsx
resources/js/Components/CarLanding/            # SpecTabs, CreditSimulator, LeadForm, CarFooter, dll.
resources/js/Components/EndUser/Header.jsx     # + ShowroomHeader & LightHeader
resources/js/Pages/EndUser/Products/Index.jsx  # Katalog (light header)
resources/js/Pages/EndUser/Products/Show.jsx   # Detail configurator
tests/Feature/CarLandingPageTest.php
tests/Feature/LeadTest.php
tests/Feature/CarCheckoutTest.php
docs/car-showroom/                              # PRD, plan, tasks, screenshot
```

---

## ⚠️ Batasan & Konvensi

- **Jangan mengubah**: `CartController`, `CheckoutController`, `PaymentGatewayManager`, `OrderController`, `VoucherService`, `BiteshipService`, `SampleDataSeeder` (retail).
- `CarSampleDataSeeder` bersifat **terisolasi**: pada branch ini `DatabaseSeeder` memanggilnya (lihat `database/seeders/DatabaseSeeder.php`) menggantikan `SampleDataSeeder` retail, sehingga data retail tidak tertimpa dan seluruh data showroom di-reset bersih lewat `migrate:fresh --seed`.
- Slug route: gunakan path literal (`/products`) di `usePage().url` — Ziggy `route()` mengembalikan URL absolut.
- `pt-[68px]` (header fixed) jangan digabung dengan `py-*` di elemen yang sama — pakai wrapper terpisah agar tidak tertimpa urutan utility Tailwind.
- Gaya: aksen CTA `gray-900` (bukan hijau `primary`), `rounded-xl`/`rounded-lg` maksimal, font-serif untuk judul hero/detail.

---

## 👨‍💻 Authors

- **Ridha (Ahdirmai)** – Rekayasa & pembaruan fitur POS, pengembang branch contoh showroom mobil ini.
- **[Arya Dwi Putra](https://www.github.com/aryadwiputra)** – Developer pionir platform POS _open-source_ modern.
- Tampilan dasar awalnya menggunakan set pendukung UI dari [RILT-Starter](https://github.com/Raf-Taufiqurrahman/RILT-Starter).

---

## 📸 Screenshot

Lihat `docs/car-showroom/` untuk tangkapan layar landing, katalog, dan detail product.
