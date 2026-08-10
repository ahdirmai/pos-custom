# PRD: Car Dealership Landing Page (Example Branch)

> Branch: `example/car-dealership-landing`
> Status dokumen: Draft v1 — disusun dari `brief-landing-page-limo-green.md` & `plan.md`
> Terakhir diperbarui: berdasarkan audit kode per hari ini (lihat `tasks.md` untuk status implementasi terkini)

## 1. Latar Belakang & Problem Statement

Aplikasi ini saat ini adalah POS + toko online generik (contoh: fashion/retail) dengan homepage yang berfungsi sebagai landing generik. Kita ingin membuat **contoh branch alternatif** yang menunjukkan bahwa platform yang sama bisa dipakai untuk **showroom/dealer mobil** (studi kasus: VinFast, hero product "Limo Green" MPV listrik 7-seater), tanpa:

- Mengubah struktur data & logic retail/POS yang sudah ada (`products`, `SampleDataSeeder`, checkout, dsb).
- Mengubah halaman katalog generik (`/products`, `/categories`, `/search`) yang harus tetap bekerja apa adanya untuk produk apa pun, termasuk mobil.
- Membuat brosur statis — toko mobil ini harus **fully functional**: pengunjung bisa benar-benar checkout, bayar, dapat ongkir, pakai voucher, dsb., persis seperti produk retail lain.

Masalah yang ingin diselesaikan:
1. Homepage default (retail landing) tidak representatif untuk kebutuhan showroom mobil (butuh hero product besar, spek detail, galeri, simulasi kredit, skema pembelian baterai, dsb).
2. Belum ada mekanisme "lead capture" (booking test drive/konsultasi) yang terpisah dari flow beli langsung — dealer mobil biasanya butuh keduanya (beli online langsung ATAU dihubungi sales dulu).
3. Data showcase mobil (spek, galeri, WA CTA) tidak sesuai dimasukkan ke tabel `products` karena akan mengotori model retail generik.

## 2. Goals

- **G1.** Homepage (`/`, route `user.index`) pada branch ini menampilkan landing page dealer mobil VinFast, bukan homepage retail generik.
- **G2.** Hero product (Limo Green) dan katalog cross-sell (6 model VinFast lain) dapat langsung ditambahkan ke cart dan checkout menggunakan flow self-checkout yang sudah ada (cart, checkout, shipping/Biteship, payment gateway, voucher, order history) **tanpa modifikasi** pada modul-modul tersebut.
- **G3.** Data showcase mobil (spek, galeri foto, highlight spec, rentang harga, CTA WhatsApp) tersimpan di tabel terpisah `product_cars`, berelasi 1:1 ke `products`, sehingga bisa dihapus/di-drop tanpa risiko ke data retail.
- **G4.** Tersedia mekanisme Lead Capture (form booking test drive/konsultasi) yang independen dari tombol beli, tersimpan di tabel `leads`.
- **G5.** Halaman katalog generik (`/products`, `/categories`, `/search`) tetap berfungsi 100% seperti sebelumnya dan otomatis menampilkan produk mobil begitu diseed — tanpa hardcode kategori/domain tertentu.
- **G6.** Tersedia seeder terpisah (`CarSampleDataSeeder`) yang tidak mengganggu/menimpa seeder retail (`SampleDataSeeder`) dan bisa dijalankan manual.
- **G7.** Branding sederhana (warna primer hijau EV, nomor WhatsApp dealer) dikonfigurasi lewat `Setting` yang sudah ada (`ThemeService`), bukan hardcode di frontend.

## 3. Non-Goals

- **NG1.** Tidak membangun sistem CRM/lead management lanjutan (assignment ke sales, status follow-up, dsb) — cukup simpan lead ke DB.
- **NG2.** Tidak membangun kalkulator kredit yang terhubung ke bank/API resmi — hanya simulasi estimasi flat di frontend dengan disclaimer "bukan penawaran resmi".
- **NG3.** Tidak mengubah `SampleDataSeeder`, `ProductFactory`, atau homepage retail lama — semuanya harus tetap ada sebagai basis/contoh retail (agar branch `main`/`development` tidak terpengaruh).
- **NG4.** Tidak menambah kolom baru ke tabel `products` — semua atribut khas mobil hidup di `product_cars`.
- **NG5.** Tidak membangun admin CRUD khusus untuk mengelola `product_cars`/`leads` dari dashboard — pengelolaan cukup lewat seeder & (opsional) tinkering manual, karena ini branch contoh/demo.
- **NG6.** Tidak mengubah `CartController`, `CheckoutController`, `PaymentGatewayManager`, `OrderController`, `VoucherService`, `BiteshipService`.

## 4. Target Pengguna & Use Case

| Persona | Kebutuhan |
|---|---|
| Calon pembeli mobil (end user) | Lihat spek lengkap, galeri, simulasi kredit, langsung beli online ATAU booking test drive dulu |
| Pemilik showroom (demo audience / stakeholder internal) | Melihat bahwa platform bisa dipakai lintas vertikal (retail → otomotif) tanpa rewrite besar |
| Developer lain yang membaca kode | Contoh pola "tabel showcase terpisah 1:1" yang bisa ditiru untuk vertikal lain |

## 5. Ruang Lingkup Fitur

### 5.1 Data Layer
- Tabel baru `product_cars` (1:1 ke `products`), model `ProductCar`, relasi `Product::car()`.
- Tabel baru `leads`, model `Lead`.

### 5.2 Backend
- `HomeController@index` (khusus branch ini) mengambil `heroProduct` (produk dengan `car.is_featured = true`) & `catalog` (produk lain yang punya relasi `car`), lalu me-render halaman landing mobil.
- `LeadController@store` — endpoint publik untuk submit lead.
- Seeder `CarSampleDataSeeder` — 3 kategori (City Car/SUV/MPV) + 7 produk VinFast + `ProductCar` + `StockBatch` per produk.
- Setting tambahan: `store_whatsapp`, `theme_primary` (hijau).

### 5.3 Frontend
- Halaman `EndUser/CarLanding/Index.jsx` dengan 12 section (Hero, Highlight Spec, Galeri, Spesifikasi Lengkap/tab, Kalkulator Kredit, Skema Pembelian, Katalog Mobil Lain, Testimoni, FAQ, Lead Form, Sticky WA Button, Footer).
- Komponen baru di `resources/js/Components/CarLanding/`: `SpecBadge`, `SpecTabs`, `CreditSimulator`, `PurchaseSchemeToggle`, `FaqAccordion`, `LeadForm`, `StickyWhatsAppButton`.
- Reuse komponen existing: `ProductCard`, `UserLayout`, `CartContext`, `WishlistProvider`, `Footer`.

### 5.4 Testing
- Pest test: landing page render (200, hero + jumlah catalog benar).
- Pest test: checkout end-to-end untuk produk mobil (cart → checkout → stok berkurang).
- Pest test: `LeadController@store` (valid & invalid payload).

## 6. Functional Requirements & Acceptance Criteria

### FR1 — Homepage menampilkan landing mobil
- **Given** branch `example/car-dealership-landing` sudah diseed dengan `CarSampleDataSeeder`,
- **When** user mengakses `/`,
- **Then** halaman `EndUser/CarLanding/Index` dirender dengan HTTP 200, menampilkan hero product (Limo Green) dan minimal 6 produk lain di katalog cross-sell.

### FR2 — Hero & katalog bisa langsung dibeli
- **Given** user berada di landing page,
- **When** user klik "Tambah ke Keranjang"/"Beli Sekarang" pada hero atau salah satu card katalog,
- **Then** produk masuk cart (via `CartContext` existing) dan user bisa lanjut ke `/checkout` dan menyelesaikan transaksi seperti produk retail biasa (termasuk pengurangan stok via FIFO `StockBatch`).

### FR3 — Data showcase terpisah dari `products`
- **Given** migration `create_product_cars_table` sudah dijalankan,
- **Then** tabel `products` tidak memiliki kolom baru apa pun; seluruh field showcase (`subtitle`, `highlight_specs`, `specs`, `gallery`, `price_max`, `price_note`, `is_featured`, `cta_whatsapp_message`) berada di `product_cars` dan diakses lewat `$product->car`.

### FR4 — Lead capture independen
- **Given** user mengisi form Lead (Nama, No. HP, Kota, Model yang diminati) di section Lead Form,
- **When** submit,
- **Then** row baru tersimpan di tabel `leads` dengan `source = 'car_landing'`, dan user melihat toast sukses; submit tidak membuat order/transaksi apa pun.
- **Given** field wajib (nama/HP) kosong,
- **When** submit,
- **Then** validasi gagal dan pesan error ditampilkan, tidak ada row tersimpan.

### FR5 — Katalog generik tetap jalan
- **Given** produk mobil sudah diseed,
- **When** user mengakses `/products`, `/categories`, atau `/search`,
- **Then** produk mobil muncul secara otomatis mengikuti logic filter/kategori/harga/rating yang sama seperti produk retail, tanpa perubahan kode di `ProductController`.

### FR6 — Seeder idempotent & terisolasi
- **Given** seeder retail (`SampleDataSeeder`) sudah pernah dijalankan,
- **When** menjalankan `php artisan db:seed --class=CarSampleDataSeeder`,
- **Then** data retail tidak terhapus/berubah; hanya data kategori (`City Car`/`SUV`/`MPV / Fleet`) dan produk terkait `product_cars` yang di-reset & diseed ulang.

### FR7 — Branding hijau
- **Given** seeder sudah dijalankan,
- **When** halaman apa pun (dashboard/landing) dirender,
- **Then** warna primer mengikuti `Setting::get('theme_primary')` = hex hijau, bukan default gold.

## 7. Batasan Teknis / Constraints
- Tidak boleh mengubah `$fillable`/`$casts` existing pada model `Product`.
- Tidak boleh mengubah `CartController`, `CheckoutController`, `PaymentGatewayManager`, `OrderController`, `VoucherService`, `BiteshipService`.
- Seeder mobil **tidak** didaftarkan di `DatabaseSeeder::run()` default — harus dijalankan manual.
- Semua file PHP yang disentuh harus lolos `vendor/bin/pint --dirty --format agent`.
- Foto memakai placeholder (Unsplash) dengan pola `downloadImage()` yang sama seperti `SampleDataSeeder`, nama file jelas agar mudah diganti nanti.

## 8. Metrik Keberhasilan (untuk demo/contoh, bukan produksi)
- `/` render tanpa error dan menampilkan hero + katalog lengkap.
- Transaksi end-to-end (cart → checkout → payment → stok berkurang) berhasil untuk produk mobil tanpa error.
- Lead form berhasil submit dan tervalidasi.
- Seluruh test Pest terkait (`CarLanding`, `Checkout`, `Lead`) hijau.
- `git diff` menunjukkan tidak ada perubahan pada file-file yang dilarang disentuh (lihat §7).

## 9. Open Questions / Assumptions
Lihat bagian **Assumptions** di `plan.md` — tetap berlaku:
- Data mobil di tabel terpisah agar mudah dihapus tanpa risiko ke data retail.
- Ini bukan brosur statis; seluruh flow commerce aktif dan dipakai ulang.
- Katalog generik tetap jalur belanja utama; landing hanya menambah showcase di homepage.
- Lead form bersifat tambahan, tidak menggantikan tombol beli.
- Foto placeholder dipakai karena foto asli belum tersedia.
- Harga & spesifikasi mengikuti brief; karena bersifat promosi/sementara, disclaimer ditampilkan di setiap tempat harga muncul.
