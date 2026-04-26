# Point of Sales – Laravel & Inertia (pos-custom)

> Sistem kasir modern dengan alur transaksi cepat, dukungan laporan, fitur manajemen pelanggan (E-Commerce), dan mode cetak invoice yang rapi. 

## ✨ Keseluruhan Fitur

Aplikasi Point of Sales modern yang memiliki fitur lengkap untuk administrasi toko (*kasir & dashboard*) sekaligus antarmuka publik untuk pelanggan:

### 🛍️ Modul Point of Sales (POS) & Admin
- **Kasir Cepat & Intuitif**: Mendukung pencarian barcode, manajemen keranjang belanja, ringkasan pembayaran, dan kalkulasi diskon otomatis.
- **Hold Transaction & Customer History**: Menyimpan antrean keranjang sementara untuk dilanjutkan nantinya dan memantau riwayat transaksi pelanggan langsung dari layar kasir.
- **Invoice & Thermal Receipt**: Antarmuka cetak nota pelanggan spesifik ukuran struk printer thermal 58mm maupun 80mm.
- **Laporan Laba & Analitik**: *Dashboard* statistik memvisualisasikan ringkasan pendapatan, kategori, profit, laporan penjualan, hingga perhitungan Pajak PPh23.
- **Manajemen Produk & Stok**: Operasi CRUD pengelolaan produk yang tersinkronisasi, lengkap dengan Flash Sale, Kategori, dan otomatisasi barcode.
- **Manajemen Piutang & Hutang (*Receivables/Payables*)**: Sistem pencatatan invoice yang belum lunas baik ke pelanggan maupun ke pihak supplier.
- **Pengaturan & Integrasi Ekspedy/Pembayaran**: Kalkulasi ongkos kirim otomatis (*check rates*), pengaturan layanan bank, hingga opsi sistem payment link via Midtrans & Xendit.

### 🛒 Modul Pelanggan (Customer / Frontend)
- **Katalog Eksternal & Checkout**: Halaman depan toko yang menyajikan list produk, fungsionalitas cari/filter barang, keranjang, hingga ke modul checkout mandiri.
- **Riwayat Pesanan & Bukti Pembayaran**: Lacak status *order*, upload bukti transfer bank manual, dan penyertaan integrasi modul penilaian/ulasan (*reviews*) dari pelanggan.
- **Manajemen Alamat & Wishlist**: Fitur simpan daftar tempat/alamat untuk pengiriman, serta produk yang difavoritkan (*wishlist*).
- **Blog Content Management System**: Dokumentasi dan pembuatan rilis artikel (berita promo/toko) lengkap mendukung *tag* maupun *categories*.

## 🔧 Teknologi Inti

- **Backend**: [Laravel 11/12](https://laravel.com) + [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)
- **Frontend**: [Inertia.js V3](https://inertiajs.com) + [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com) + Tabler Icons
- **Database & Testing**: MySQL dan arsitektur pengujian dari framework [Pest PHP](https://pestphp.com/).

---

## 🚀 Instalasi di Local

Ikuti panduan berikut untuk menyesuaikan dan menjalankan aplikasi pada lingkungan *localhost* atau terminal server pengembang:

```bash
# 1. Kloning Repositori
git clone https://github.com/ahdirmai/pos-custom.git
cd pos-custom

# 2. Persiapkan Variabel Environment
cp .env.example .env

# 3. Instalasi Pustaka Dependensi
composer install
npm install

# 4. Generate Kunci Aplikasi & Binding Storage
php artisan key:generate
php artisan storage:link

# 5. Konfigurasi Database & Layanan API Integrasi
# Edit file '.env' pada root folder, kemudian atur bagian kredensial relasi ke database MySQL/PostgreSQL.
# Apabila API gateway pembayaran digunakan, set juga keys Midtrans/Xendit-nya.

# 6. Migrasi Tabel & Pembuatan Struktur Basis Data
php artisan migrate --seed

# [Tip] Bila ingin menggunakan visual data awal sampel (foto produk dummy lengkap dsb):
# php artisan db:seed --class=SampleDataSeeder

# 7. Pengumpulan & Pengaitan Aset Frontend Vite
npm run dev

# 8. Menjalankan Server Lokal (Jika kamu tak menggunakan Laravel Herd)
php artisan serve
```

### Akun Default (Login Dashboard)

- **Admin Utama**: `arya@gmail.com` / `password`
- **User Kasir**: `cashier@gmail.com` / `password`

---

## 👨‍💻 Authors

- **Ridha (Ahdirmai)** – Mengadopsi (*meng-fork*) dari proyek orisinil dan melakukan rekayasa serta pembaruan fitur (*customizations*) internal mendalam untuk Point of Sales ini.
- **[Arya Dwi Putra](https://www.github.com/aryadwiputra)** – Developer pionir yang menginisiasi platform Point of Sales *open-source* modern ini.
- Tampilan dasar pada mulanya menggunakan set pendukung UI dari [RILT-Starter](https://github.com/Raf-Taufiqurrahman/RILT-Starter).
