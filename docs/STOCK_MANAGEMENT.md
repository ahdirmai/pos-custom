# 📦 Manajemen Stok (Batch/Lot, FIFO, & Antisipasi Kadaluarsa)

Dokumen ini menjelaskan fitur **Manajemen Stok** yang mengelola persediaan barang berbasis **batch/lot** dengan konsumsi otomatis **FIFO** (First In, First Out) serta pengawasan tanggal kadaluarsa.

---

## 1. Latar Belakang

Sebelumnya, stok produk disimpan sebagai satu angka tunggal (`products.stock`) yang diubah manual lewat form produk dan dikurangi saat penjualan. Pendekatan ini tidak dapat:

- Melacak **batch mana** yang masuk lebih dulu (syarat FIFO).
- Menyimpan **tanggal kadaluarsa** per pengiriman barang.
- Menghitung **nilai modal akurat** per batch (harga beli bisa berbeda tiap masuk).

Fitur ini menggantikan model lama dengan **pencatatan per-batch** plus **kartu stok (ledger)** untuk audit penuh.

---

## 2. Konsep Inti

| Istilah | Penjelasan |
|---|---|
| **Batch / Lot** | Satu kali barang masuk = satu batch. Punya qty, harga beli, tanggal masuk, dan tanggal kadaluarsa sendiri. |
| **FIFO** | Saat barang terjual, sistem otomatis mengurangi stok dari batch **tertua** (tanggal masuk paling awal) lebih dulu. |
| **Kartu Stok (Ledger)** | Catatan setiap pergerakan stok (masuk / keluar / penyesuaian) untuk audit. |
| **Stok Produk** | Kolom `products.stock` dipertahankan sebagai **cache** = jumlah sisa seluruh batch. Otomatis tersinkron. |

---

## 3. Alur Penggunaan

### 3.1 Barang Masuk (Stock-In)

1. Buka menu **Data Management → Manajemen Stok**.
2. Pilih produk → **Kartu Stok**.
3. Klik **Barang Masuk**, isi:
   - **Jumlah Masuk** (wajib)
   - **Harga Beli / unit** (wajib)
   - **Tanggal Masuk** (wajib, default hari ini)
   - **Tanggal Kadaluarsa** (opsional)
   - **Kode Batch** (opsional — dibuat otomatis `BATCH-YYYYMMDD-NNN` bila kosong)
   - **Catatan** (opsional)
4. Sistem membuat batch baru, mencatat pergerakan `in`, dan menyinkronkan stok produk.

> Saat **membuat produk baru**, kolom *Stok Awal* + *Tgl Kadaluarsa* otomatis menjadi batch pertama.

### 3.2 Barang Keluar (FIFO Otomatis)

Pengurangan stok terjadi otomatis saat:

- **Transaksi kasir (POS)** — `TransactionController@store`
- **Checkout pelanggan (online)** — `CheckoutController@store`

Sistem mengambil stok dari batch **non-expired tertua** dulu. Bila stok valid (non-expired) tidak mencukupi, transaksi **ditolak** dengan pesan stok tidak cukup.

### 3.2.1 Barang Masuk Massal (Bulk)

Untuk input banyak batch sekaligus, buka **Manajemen Stok → Barang Masuk Massal**. Dua mode:

**a. Form Multi-Baris** — tambah baris sebanyak produk yang masuk; tiap baris pilih produk + qty/harga beli/tanggal masuk/kadaluarsa. Klik **Simpan Semua**. Bersifat *all-or-nothing*: bila ada baris gagal, tidak ada yang tersimpan.

**b. Import File** (.xlsx / .csv) — upload file dengan kolom:

```
barcode, qty, buy_price, received_date, expired_date, note
```

- Produk dicocokkan lewat **barcode**.
- Download template lewat tombol **Download Template**.
- Bila ada baris error (barcode tak ditemukan / qty ≤ 0), **seluruh** impor dibatalkan dan error ditampilkan.

### 3.3 Stok Opname / Write-off

Pada Kartu Stok, klik **Opname** pada salah satu batch untuk menyesuaikan sisa stok:

- **Stok Opname** — koreksi hasil hitung fisik.
- **Write-off** — barang rusak / hilang / expired.

Selisih dicatat sebagai pergerakan `adjustment`.

### 3.4 Antisipasi Kadaluarsa

| Fitur | Lokasi |
|---|---|
| **Alert Dashboard** | Kartu "Antisipasi Kadaluarsa" — batch expired / mendekati 30 hari |
| **Laporan Kadaluarsa** | Manajemen Stok → Laporan Kadaluarsa (filter 7/14/30/60/90 hari + estimasi nilai rugi) |
| **Blok Jual Expired** | Batch yang sudah lewat tanggal kadaluarsa tidak ikut terjual (FIFO melewatinya) |
| **Status Batch** | Aman / Mendekati Expired / Expired / Habis |

---

## 4. Struktur Database

### Tabel `stock_batches`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `product_id` | FK | Produk pemilik batch |
| `batch_code` | string nullable | Kode batch (auto bila kosong) |
| `qty_in` | int | Jumlah masuk awal |
| `qty_remaining` | int | Sisa stok batch (turun saat FIFO/opname) |
| `buy_price` | bigint | Harga beli per unit batch ini |
| `received_date` | date | Tanggal masuk (dasar urutan FIFO) |
| `expired_date` | date nullable | Tanggal kadaluarsa |
| `note` | text nullable | Catatan |
| `user_id` | FK nullable | Pencatat |

### Tabel `stock_movements` (Kartu Stok)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `product_id` | FK | Produk |
| `stock_batch_id` | FK nullable | Batch terkait |
| `type` | enum | `in`, `out`, `adjustment` |
| `reference_type` | string | `stock_in`, `transaction`, `checkout`, `opname`, `write_off`, `migration` |
| `reference_id` | bigint nullable | ID sumber (mis. id transaksi) |
| `qty` | int | + masuk, − keluar |
| `qty_before` / `qty_after` | int | Snapshot stok produk |
| `note` | text nullable | Catatan |
| `user_id` | FK nullable | Pelaku |

---

## 5. Arsitektur Kode

| Komponen | Path |
|---|---|
| Service inti (semua mutasi stok) | `app/Services/StockService.php` |
| Model batch | `app/Models/StockBatch.php` |
| Model pergerakan | `app/Models/StockMovement.php` |
| Exception stok kurang | `app/Exceptions/InsufficientStockException.php` |
| Controller | `app/Http/Controllers/Apps/StockController.php` |
| Halaman React | `resources/js/Pages/Dashboard/Stock/{Index,Show,ExpiryReport}.jsx` |

### Method `StockService`
| Method | Fungsi |
|---|---|
| `stockIn($product, $data)` | Buat batch baru + pergerakan `in` + sinkron stok |
| `consumeFifo($product, $qty, $refType, $refId)` | Kurangi stok FIFO lintas batch non-expired, throw bila kurang |
| `adjust($product, $batch, $newQty, $reason, $note)` | Opname / write-off + pergerakan `adjustment` |
| `bulkStockIn($rows)` | Banyak batch sekaligus, all-or-nothing dalam 1 transaksi |
| `syncProductStock($product)` | Set `products.stock` = SUM sisa batch |

Import file: `app/Imports/StockBatchImport.php` (pakai package **maatwebsite/excel**).

Semua mutasi dibungkus **DB transaction** + lock batch (`lockForUpdate`) untuk cegah race condition.

---

## 6. Routes & Hak Akses

| Method | URI | Name | Permission |
|---|---|---|---|
| GET | `/dashboard/stocks` | `stocks.index` | `stocks-access` |
| GET | `/dashboard/stocks/{product}` | `stocks.show` | `stocks-access` |
| POST | `/dashboard/stocks/{product}/in` | `stocks.in` | `stocks-create` |
| POST | `/dashboard/stocks/{product}/adjust` | `stocks.adjust` | `stocks-adjust` |
| GET | `/dashboard/stocks-report/expiry` | `stocks.expiry` | `stocks-access` |
| GET | `/dashboard/stocks-bulk` | `stocks.bulk` | `stocks-create` |
| POST | `/dashboard/stocks-bulk` | `stocks.bulk.store` | `stocks-create` |
| POST | `/dashboard/stocks-import` | `stocks.import` | `stocks-create` |
| GET | `/dashboard/stocks-template` | `stocks.template` | `stocks-create` |

Permission baru: `stocks-access`, `stocks-create`, `stocks-adjust` (lihat `PermissionSeeder` & `RoleSeeder`).

---

## 7. Migrasi Data Lama

Migrasi `backfill_stock_batches_for_existing_products` membuat **1 batch saldo awal** untuk tiap produk lama yang masih punya stok (`expired_date` null). Bersifat **idempotent** — produk yang sudah punya batch dilewati.

---

## 8. Pengujian

Test: `tests/Feature/Stock/StockServiceTest.php`

| Skenario | Verifikasi |
|---|---|
| Barang masuk | Batch + pergerakan + sinkron stok |
| FIFO | Batch tertua habis lebih dulu |
| Stok kurang | `InsufficientStockException` |
| Batch expired | Tidak ikut terjual / blok jual |
| Opname | Sisa qty berubah + pergerakan adjustment |

Jalankan:

```bash
php artisan test --compact tests/Feature/Stock
```
