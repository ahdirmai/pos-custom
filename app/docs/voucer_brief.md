# Project Brief: Voucher System Module
**Tech Stack:** Laravel (Backend), React + Inertia.js (Frontend)

## 📌 Project Overview
Membangun sistem manajemen voucher yang mendukung dua tipe utama: **Diskon Total Belanjaan (Subtotal)** dan **Potongan Ongkir (Shipping)**. Sistem ini harus terintegrasi antara panel Admin (untuk manajemen) dan halaman End-User (untuk penggunaan).

## 🛠 Phase 1: Admin Management & Tracking (Backend CRUD)
Fokus pada penyediaan tools bagi admin untuk membuat, memantau, dan mengelola kampanye voucher.

### Key Tasks:
- **Database Migration**: Implementasi tabel `vouchers` dan `voucher_usages`.
- **CRUD Interface**:
    - Form pembuatan voucher dengan validasi server-side (unique code, date range logic).
    - Toggle `is_active` untuk mematikan voucher secara instan.
- **Tracking & Analytics**:
    - Halaman detail voucher yang menampilkan daftar transaksi yang menggunakan kode tersebut.
    - Statistik sederhana: Total pemakaian vs Kuota tersedia.
- **API/Controller**: Menyediakan endpoint untuk sinkronisasi data voucher ke modul POS.

✅ **Kriteria Selesai**: Admin dapat membuat voucher "DISKON10" dan melihat daftar siapa saja yang sudah menggunakannya.

## 🎨 Phase 2: Frontend Implementation (React + Inertia Components)
Fokus pada pengalaman pengguna (UX) dengan membuat komponen yang reusable (dapat ditempel di berbagai halaman).

### Key Tasks:
- **Voucher Selector Component**:
    - Komponen Modal atau Sidebar untuk menampilkan daftar voucher yang tersedia bagi user.
- **Input Coupon Component**:
    - Field input kode voucher di halaman Checkout.
    - Integrasi dengan Inertia `useForm` untuk pengiriman kode ke backend secara asinkron.
- **Dynamic Discount Preview**:
    - Menampilkan kalkulasi potongan secara real-time di ringkasan belanja sebelum user menekan tombol "Bayar".
- **Product Detail Badge**:
    - Komponen kecil untuk menunjukkan bahwa produk ini bisa menggunakan voucher tertentu (opsional).

✅ **Kriteria Selesai**: User dapat melihat daftar voucher di halaman checkout, memasukkan kode, dan melihat total harga berubah secara otomatis.

## ⚙️ Phase 3: Business Logic & Payment Integration
Fokus pada keamanan, validasi perhitungan, dan finalisasi transaksi di sisi server.

### Key Tasks:
- **Voucher Validation Service**:
    - Membuat Service Class di Laravel untuk mengecek:
        - Apakah kode ada?
        - Apakah masa berlaku masih aktif?
        - Apakah kuota masih ada?
        - Apakah syarat Minimum Spend terpenuhi?
        - Apakah user ini sudah mencapai User Limit?
- **Calculation Engine**:
    - Logika untuk menghitung Fixed vs Percentage discount.
    - Logika proteksi `max_discount` agar diskon persentase tidak melebihi plafon.
- **Transaction Handler**:
    - Menggunakan DB Transaction saat proses checkout:
        - Simpan Order -> Simpan `voucher_usages` -> Kurangi stok/kuota voucher.
- **Shipping API Integration**:
    - Logika khusus untuk memotong biaya ongkir dari total tagihan tanpa mengubah subtotal harga barang.

✅ **Kriteria Selesai**: Sistem menolak voucher jika syarat tidak terpenuhi dan mencatat penggunaan voucher secara akurat di database setelah pembayaran sukses.

## 📝 Catatan Tambahan untuk Developer
- **Atomic Consistency**: Selalu gunakan `sharedLock()` atau atomic update pada kolom `usage_limit` untuk menghindari race condition saat dua user menggunakan voucher terakhir di detik yang sama.
- **Modular Component**: Pastikan komponen React diletakkan di folder `Resources/js/Components/Voucher/` agar bisa dipanggil baik di Frontend-User maupun di aplikasi POS.
