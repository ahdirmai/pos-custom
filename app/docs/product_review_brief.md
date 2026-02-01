# Brief: Fitur Review Produk

## 1. Latar Belakang & Tujuan
Memberikan wadah bagi konsumen untuk memberikan ulasan (rating dan komentar) terhadap produk yang telah dibeli. Fitur ini bertujuan untuk meningkatkan kepercayaan pelanggan lain dan memberikan feedback kepada toko.

## 2. Syarat Utama (Core Requirement)
**Review hanya dapat diberikan setelah pesanan berstatus DITERIMA (Completed / Received).** Konsumen tidak dapat memberikan review jika barang belum sampai atau pesanan dibatalkan.

## 3. Alur Pengguna (User Flow)
1.  **Syarat Kelayakan**: User login dan masuk ke menu "Riwayat Pesanan" atau "Detail Pesanan".
2.  **Trigger**: Pada pesanan dengan status `completed`, muncuk tombol "Beri Ulasan" pada setiap item produk.
3.  **Input Review**:
    *   **Rating Bintang**: Skala 1-5 (wajib).
    *   **Komentar Text**: Deskripsi pengalaman (opsional/wajib).
    *   **Upload Foto**: Bukti foto produk (opsional, maks 3-5 foto).
4.  **Submit**: Review disimpan ke database.
5.  **Tampilan**:
    *   Tombol "Beri Ulasan" hilang atau berubah menjadi "Lihat Ulasan Anda".
    *   Review muncul di halaman Detail Produk (Product Show Page).

## 4. Spesifikasi Teknis

### A. Database
Membutuhkan tabel baru `reviews`:
-   `id` (BigInt, PK)
-   `user_id` (FK to users)
-   `product_id` (FK to products)
-   `transaction_id` / `order_id` (FK to transactions) -> *Penting untuk validasi pembelian*
-   `rating` (TinyInt, 1-5)
-   `comment` (Text, nullable)
-   `images` (JSON/Text, nullable) -> Menyimpan path gambar
-   `is_hidden` (Boolean, default false) -> Untuk moderasi jika perlu
-   `created_at`, `updated_at`

### B. Validasi Backend
Saat user submit review, sistem wajib mengecek:
1.  Apakah `user_id` benar-benar memiliki `transaction_id` tersebut?
2.  Apakah `transaction_id` memiliki status `completed` / `received`?
3.  Apakah user sudah pernah mereview produk ini pada transaksi ini? (Prevent duplicate reviews per transaction item).

### C. UI/UX
-   **Halaman Tulis Review**: Modal atau halaman terpisah yang simpel. Input rating berupa bintang interaktif.
-   **Detail Produk**: Menampilkan rata-rata rating (misal: 4.8/5) dan list komentar user lain.

## 5. Pengembangan Tahap Lanjut (Optional)
-   **Balasan Admin**: Admin bisa membalas ulasan.
-   **Filter Review**: Sort by terbaru, rating tertinggi/terendah.
-   **Insentif**: Poin reward setelah memberikan review.
