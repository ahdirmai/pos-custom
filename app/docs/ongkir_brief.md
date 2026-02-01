# Dokumentasi Brief Integrasi Biteship - Aplikasi POS

Dokumen ini berisi panduan teknis alur kerja, skema database, dan konfigurasi yang diperlukan untuk mengintegrasikan layanan pengiriman Biteship ke dalam sistem Point of Sales (POS).

---

## 1. Alur Kerja (Workflow) Integrasi

Alur ini dirancang untuk memfasilitasi pengiriman barang yang dibeli melalui kasir namun perlu dikirim ke alamat pelanggan.

1.  **Checkout & Shipping Calculation:**
    - Kasir memasukkan produk ke keranjang (data berat & dimensi diambil dari DB).
    - Kasir menginput data alamat pelanggan (khususnya Kode Pos).
    - Sistem memanggil API Biteship `POST /v1/rates` untuk menampilkan pilihan kurir dan harga.
    - **Filter Kurir:** Pilihan kurir yang muncul difilter berdasarkan setting "Shipping Couriers" yang aktif di database.
2.  **Payment & Order Creation:**
    - Pelanggan membayar total belanja + ongkir.
    - Setelah status transaksi *Paid*, sistem memanggil API Biteship `POST /v1/orders`.
    - Sistem menyimpan `biteship_order_id` dan `tracking_id` ke database `transaction_shippings`.
3.  **Fulfillment:**
    - Kasir mencetak struk belanja dan **Shipping Label** (URL label didapat dari response API Biteship).
    - Kasir menekan tombol "Request Pickup" (jika menggunakan layanan kurir yang mendukung pickup).
4.  **Monitoring:**
    - Webhook Biteship mengirimkan update status otomatis (misal: *In Transit*, *Delivered*) ke sistem POS.

---

## 2. Persiapan Database

### A. Tabel `settings` (Konfigurasi Toko & Provider)
Tambahkan pengaturan untuk lokasi asal pengiriman dan kredensial provider (Dynamic Setting):

| Key | Value (Contoh) | Deskripsi |
| :--- | :--- | :--- |
| `shop_postal_code` | 12345 | Kode pos lokasi toko/gudang |
| `shop_address_detail` | Jl. Contoh No. 1 | Alamat lengkap pickup |
| `shop_phone` | 08123456789 | Nomor telepon operasional toko |
| `shipping_provider` | biteship | Provider yang aktif (default: biteship) |
| `biteship_api_key` | biteship_live_... | API Key Biteship (disimpan di DB, bukan .env) |
| `biteship_base_url` | https://... | Base URL API Biteship |

### B. Tabel `product_details` (Baru)
Menyimpan detail fisik produk untuk keperluan pengiriman:

| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `product_id` | BigInt | FK ke tabel products |
| `weight` | Integer | Berat dalam **Gram** |
| `length` | Integer | Panjang dalam **Cm** (Default: 10) |
| `width` | Integer | Lebar dalam **Cm** (Default: 10) |
| `height` | Integer | Tinggi dalam **Cm** (Default: 10) |

### C. Tabel `transaction_shippings` (Baru)
Menyimpan detail pengiriman terpisah dari tabel transaksi utama:

| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `transaction_id` | BigInt | FK ke tabel transactions |
| `shipping_courier_code` | String | Kode kurir (jne, jnt, sicepat) |
| `shipping_courier_service` | String | Jenis layanan (reg, oke, yes) |
| `shipping_cost` | Decimal | Biaya ongkir yang dibayar pelanggan |
| `biteship_order_id` | String | ID unik dari API Biteship |
| `waybill_number` | String | Nomor Resi (Update otomatis via webhook) |
| `shipping_status` | String | Status (placed, picking_up, delivered) |
| `timestamps` | Timestamp | Created at & Updated at |

### D. Tabel `shipping_couriers` (Baru - CRUD Master Data)
Untuk mengatur kurir mana saja yang diaktifkan (whitelist):

| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt | Primary Key |
| `code` | String | Kode kurir (jne, jnt, sicepat) |
| `name` | String | Nama kurir (JNE, J&T, SiCepat) |
| `image` | String | URL Logo kurir (opsional) |
| `is_active` | Boolean | Status aktif/tidak |

---

## 3. Integrasi API & Fitur Admin

### Admin Settings
*   Halaman untuk mengedit Alamat Toko.
*   Halaman untuk memilih Shipping Provider dan input API Key secara dinamis.

### Master Data Shipping Couriers (CRUD)
*   Admin bisa menambah/mengedit/menghapus/mengaktifkan list kurir yang tersedia.

### Endpoint Utama yang Digunakan
*   **Cek Ongkir**: `POST /v1/rates` (Menggunakan credential dari DB)
*   **Buat Pesanan**: `POST /v1/orders`
*   **Webhook**: `POST /api/webhooks/biteship`

---

## 4. Tahapan Pengembangan (Phases)

### Phase 1: Setup Foundation (Admin)
*   Setup database: `product_details`, `transaction_shippings`, `shipping_couriers`, update `settings`.
*   Setup Models & Relationships.
*   **Admin UI - Store Settings**: Form input untuk alamat toko & API Key Provider.
*   **Admin UI - Shipping Couriers**: CRUD Management untuk kurir.
*   **Admin UI - Product Create/Edit**: Form input untuk berat & dimensi produk.

### Phase 2: Transaction Implementation (Admin)
*   Integrasi API Cek Ongkir (`/v1/rates`) pada halaman Create Transaction Admin.
*   Integrasi API Create Order (`/v1/orders`) saat transaksi dibayar.
*   Menyimpan data `transaction_shippings`.
*   Menampilkan Status Pengiriman & Resi di detail transaksi.

### Phase 3: Front End User Implementation
*   Implementasi fitur cek ongkir & pemilihan kurir di halaman checkout user.
*   Integrasi pembayaran dengan total ongkir.
*   Tracking order untuk user.
