# Fitur Laporan PPh 23

## Deskripsi
Fitur ini menyediakan laporan khusus untuk memantau transaksi yang mengandung jasa kena pajak (PPh 23). Laporan ini membantu dalam perhitungan dan estimasi pajak yang harus dipotong/dibayarkan berdasarkan items jasa yang dijual.

## Fitur Utama

### 1. Dashboard & Statistik
- **Summary Cards**: Menampilkan ringkasan cepat dengan visual gradient yang informatif:
    - **Total Transaksi**: Jumlah transaksi dalam periode terpilih.
    - **Total Pendapatan**: Gross Revenue dari transaksi terpilih.
    - **Estimasi PPh 23**: Total potensi pajak yang harus dipotong/dibayarkan.

### 2. Tabel Laporan
Tabel utama menyajikan data transaksi dengan kolom-kolom berikut:
- **Invoice & Tanggal**: Identitas transaksi.
- **Pelanggan & NPWP**: Informasi pelanggan dan validasi NPWP.
- **Diskon**: Nilai diskon transaksi (ditampilkan dalam warna merah jika ada).
- **Total Nota**: Grand total transaksi setelah diskon.
- **Total DPP Jasa**: Dasar Pengenaan Pajak (hanya dihitung dari item jasa/pph23).
- **Tarif & PPh**:
    - Tarif otomatis: **2%** (jika ada NPWP) atau **4%** (jika tidak ada NPWP).
    - Nilai nominal PPh 23.

### 3. Detail Transaksi (Expandable Row)
Pengguna dapat mengklik baris tabel untuk melihat detail item:
- Menampilkan **semua item** dalam transaksi (barang & jasa).
- **Indikator PPh**: Item yang dikenakan PPh 23 ditandai dengan badge khusus ("PPh 23") berwarna oranye dan highlight pada baris.
- **Perhitungan Per Item**: Menampilkan nilai potongan PPh spesifik untuk item tersebut di bawah harga total.

### 4. Filter & Pencarian
Interaksi pencarian data yang lengkap:
- **Rentang Tanggal**: Filter berdasarkan *Start Date* dan *End Date*.
- **Pencarian Invoice**: Input text untuk mencari nomor invoice spesifik.
- **Filter Pelanggan**: Dropdown *searchable* (menggunakan komponen `InputSelect`) yang memungkinkan pencarian nama pelanggan dengan mudah.

### 5. Ekspor Data
Fitur unduhan untuk kebutuhan arsip atau olah data lanjutan:
- **PDF**: Laporan siap cetak dengan ringkasan total.
- **Excel (CSV)**: Data mentah untuk diolah di spreadsheet.

## Implementasi Teknis

### Backend
- **Controller**: `App\Http\Controllers\Reports\PphReportController`
- **Logic**:
    - `transformTransaction`: Mengolah data transaksi, memisahkan logika perhitungan DPP (hanya item jasa) dengan tampilan (semua item).
    - Menghitung tarif pajak dinamis berdasarkan status NPWP pelanggan.

### Frontend
- **Page**: `resources/js/Pages/Dashboard/Reports/Pph23.jsx`
- **Components**:
    - `InputSelect`: Untuk filter pelanggan yang lebih user-friendly.
    - `SummaryCard`: Komponen visual untuk statistik.
- **Styling**: Tailwind CSS dengan dukungan Dark Mode.

### Database Requirements
- **Table `products`**: Kolom `is_pph23` (boolean) untuk menandai item jasa.
- **Table `customers`**: Kolom `npwp` (string) untuk pen determination tarif pajak.

## Cara Penggunaan
1. Masuk ke menu **Laporan > PPh 23**.
2. Gunakan panel **Filter** untuk menyaring data (Tanggal, Invoice, atau Pelanggan).
3. Lihat ringkasan pada kartu statistik di bagian atas.
4. Klik baris pada tabel untuk melihat detail item mana saja yang terkena pajak.
5. Klik tombol **PDF** atau **Excel** di header kanan atas untuk mengunduh laporan.
