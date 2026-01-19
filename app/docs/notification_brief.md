# Project Brief: Scalable In-App Notification System (Superadmin Focused)

## 1. Ringkasan Sistem
Sistem notifikasi ini dirancang khusus untuk memantau dua aspek kritis bisnis: **Inventaris (Stok)** dan **Finansial (Hutang Piutang)**. Notifikasi dikirimkan secara eksklusif kepada **Superadmin** dengan prinsip efisiensi penyimpanan maksimal dan skalabilitas tinggi di database MySQL.

## 2. Strategi Efisiensi Penyimpanan
Untuk mencegah tabel notifikasi membengkak, sistem menerapkan aturan berikut:
* **Single-Row Update (Deduplikasi):** Jika ada peringatan untuk barang atau invoice yang sama (misal: stok makin menipis), sistem tidak akan menambah baris baru. Sistem hanya akan memperbarui (*update*) metadata dan timestamp pada baris yang sudah ada selama notifikasi tersebut belum dibaca.
* **Auto-Pruning (Pembersihan Otomatis):** * Notifikasi yang sudah dibaca (read) lebih dari 30 hari akan dihapus otomatis.
    * Notifikasi hutang akan otomatis dihapus jika status transaksi di tabel utama berubah menjadi "Lunas" (*Paid*).
    * Notifikasi stok akan otomatis dihapus jika stok sudah diisi kembali (*Restock*) di atas limit aman.
* **Minimalist Payload:** Menghindari penyimpanan string teks panjang di database. Teks notifikasi akan digenerate di level aplikasi berdasarkan tipe data yang tersimpan.

## 3. Struktur Database (MySQL)

Tabel `notifications` dirancang menggunakan skema standar Laravel namun dioptimalkan pada level indexing dan tipe data.

| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| **id** | UUID | Primary Key (Mencegah collision dan memudahkan migrasi data). |
| **type** | String | Kategori Class: `StockAlert` atau `DebtAlert`. |
| **notifiable_id** | BigInt (FK) | ID milik Superadmin. |
| **notifiable_type** | String | Nama Model (e.g., `App\Models\User`). |
| **data** | JSON | Metadata esensial (ID referensi, jumlah, nama entitas). |
| **read_at** | Timestamp | Nullable. Digunakan sebagai indikator status "Unread". |
| **created_at** | Timestamp | Waktu pemicu pertama kali. |
| **updated_at** | Timestamp | Waktu pembaruan data terakhir (untuk tracking stok terbaru). |

### Indexing Strategi:
* **Composite Index:** `(notifiable_id, read_at)` – Mempercepat query penghitungan jumlah notifikasi yang belum dibaca (Unread Count).

## 4. Struktur Metadata JSON
Sistem menggunakan kolom JSON untuk fleksibilitas tanpa menambah kolom fisik di tabel.

### A. Kategori Stok (Inventory)
* **Pemicu:** Stok < Limit Minimal atau Stok = 0.
* **Isi JSON:** `{"p_id": 101, "name": "Produk A", "qty": 2, "lvl": "low"}`
* *Note: Menggunakan kunci pendek (p_id, qty) untuk menghemat beberapa bytes di setiap baris.*

### B. Kategori Hutang (Finansial)
* **Pemicu:** Tanggal Jatuh Tempo (H-7, Hari H, Lewat Hari H).
* **Isi JSON:** `{"inv_id": "INV-001", "name": "Supplier A", "amt": 5000000, "type": "payable"}`
* *Note: `type` membedakan Hutang (Supplier) dan Piutang (Customer).*

## 5. Workflow Operasional
1. **Event Trigger:** Setiap perubahan stok atau update transaksi memicu pengecekan logik.
2. **Lookup:** Sistem mencari baris di tabel `notifications` dengan `type` dan `ref_id` (di dalam JSON) yang sama dan `read_at` IS NULL.
3. **Action:** - Jika ditemukan: Update `data` dan `updated_at`.
   - Jika tidak ditemukan: Insert baris baru untuk Superadmin.
4. **Scheduled Cleanup:** Task scheduler berjalan setiap malam untuk menghapus notifikasi yang sudah tidak relevan (Lunas/Restock) atau sudah kedaluwarsa secara waktu.