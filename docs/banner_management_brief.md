# Brief: Banner Management System

## Latar Belakang
Pemilik toko (Admin) ingin memiliki kemampuan untuk mengubah banner promo di halaman depan (Home Page) secara mandiri agar tampilan website tetap segar dan dinamis. Saat ini, banner masih bersifat statis (hardcoded).

## Tujuan
1. **Fleksibilitas**: Admin dapat mengganti gambar banner kapan saja tanpa bantuan developer.
2. **Kontrol Tampilan**: Admin dapat mengatur urutan tampilan banner.

## Fitur Utama

### 1. CMS Banner (Admin Panel)
Halaman baru di dashboard admin untuk mengelola banner.
- **Tipe Banner**: Pilihan jenis banner (Hero Banner atau Promo Banner).
- **List Banner**: Menampilkan daftar banner yang ada.
- **Tambah/Edit Banner**: Form untuk upload gambar, judul, subjudul, link, tipe, dan status aktif.
- **Hapus Banner**: Menghapus banner yang tidak diperlukan.
- **Pengaturan Urutan**: Fitur untuk mengatur urutan banner.

### 2. Integrasi Home Page (User)
- **Hero Banner**: Banner utama di bagian atas halaman (Carousel jika lebih dari satu).
- **Promo Banner**: Banner promosi di bagian tengah halaman.
- Menampilkan banner yang berstatus "Active" sesuai tipe dan urutan.

## Spesifikasi Teknis

### Database schema: `banners`
| Column | Type | Description |
|---|---|---|
| id | bigint | Primary Key |
| type | enum | 'hero', 'promo' |
| image | string | Path gambar banner |
| title | string | Judul banner (opsional) |
| subtitle | string | Subjudul banner (opsional) |
| link | string | Link tujuan saat banner diklik (opsional) |
| order | integer | Urutan tampilan (default: 0) |
| is_active | boolean | Status aktif/tidak (default: true) |
| timestamps | timestamp | created_at, updated_at |


