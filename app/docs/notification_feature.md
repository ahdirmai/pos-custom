# Dokumentasi Fitur Notifikasi

Fitur ini menggantikan sistem notifikasi lama dengan solusi yang terpusat, efisien, dan berbasis database untuk Superadmin.

## 1. Arsitektur Teknis

### Database
- **Tabel**: `notifications` (Standar Laravel dengan UUID).
- **Struktur Data**: Kolom `data` (JSON) menyimpan detail metadata untuk meminimalisir query tambahan saat render.
- **Indeks**: Composite index pada `(notifiable_id, read_at)` untuk performa query unread yang cepat.

### Backend
- **Service**: `App\Services\NotificationService` menangani logika deduplikasi.
    - *Deduplikasi*: Jika notifikasi serupa (belum dibaca) sudah ada, sistem hanya memperbarui `updated_at` dan data terkini, bukan membuat baris baru.
- **Trigger**: Notifikasi dipicu langsung dari Model Event (`booted` / `saved`):
    - `Product`: Cek stok saat disimpan.
    - `Payable` / `Receivable`: Cek status dan tanggal jatuh tempo.
- **Cleanup**: Command `notifications:cleanup` (dijadwalkan harian) menghapus notifikasi lama (>30 hari), stok yang sudah diisi kembali, dan hutang yang lunas.

## 2. Tipe Notifikasi

### Stock Alert (Stok Barang)
Memonitor level stok produk.
- **Stok Menipis**: Trigger saat `stok < 10` dan `stok > 0`.
    - *Judul*: "Stok Menipis: [Nama Produk]"
- **Stok Habis**: Trigger saat `stok <= 0`.
    - *Judul*: "Stok Habis: [Nama Produk]"
- **Klik**: Redirect ke halaman Edit Produk.

### Debt Alert (Hutang/Piutang)
Memonitor jatuh tempo dan pembuatan hutang/piutang baru (H-7).
- **Hutang (Payable)**: Tagihan ke supplier.
- **Piutang (Receivable)**: Tagihan ke customer.
- **Klik**: Redirect ke halaman detail Hutang/Piutang (Nota).

## 3. Frontend (React/Inertia)

- **Middleware**: `HandleInertiaRequests` menyuntikkan data notifikasi (`user->unreadNotifications`) ke global props.
- **Komponen**: `Notification.jsx`
    - Menampilkan list unified (gabungan stok & hutang).
    - **Mark as Read**: Tombol centang untuk menandai sudah dibaca tanpa reload/redirect.
    - **Mark All as Read**: Menandai semua notifikasi.
    - **Navigasi**: Item notifikasi dapat diklik untuk menuju halaman terkait.

## 4. File Terkait
- `app/Services/NotificationService.php`
- `app/Notifications/StockAlert.php`
- `app/Notifications/DebtAlert.php`
- `app/Console/Commands/NotificationCleanup.php`
- `resources/js/Components/Dashboard/Notification.jsx`
