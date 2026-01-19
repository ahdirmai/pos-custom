# Laporan Audit UI/UX & Rekomendasi Perbaikan
**Fitur: Supplier & Hutang (Payables)**

## 1. Ringkasan Eksekutif
Berdasarkan analisis kode pada modul Supplier dan Payable, ditemukan bahwa fungsionalitas dasar (CRUD) sudah berjalan. Namun, terdapat beberapa isu kritikal terkait **skalabilitas** (tidak ada pagination pada Supplier) dan **User Experience** (form inline yang memakan tempat, kurangnya fitur pencarian pada Supplier).

Rekomendasi utama adalah mengimplementasikan **pagination server-side**, menambahkan **fitur pencarian**, dan memindahkan form input ke dalam **Modal** untuk tampilan yang lebih bersih dan modern.

---

## 2. Analisis & Temuan (Findings)

### A. Modul Supplier (`SupplierController` & `Index.jsx`)

1.  **Isu Performa & Skalabilitas (Critical)**
    *   **Temuan:** Controller menggunakan `Supplier::orderBy('name')->get();`.
    *   **Dampak:** Jika data supplier mencapai ratusan atau ribuan, halaman akan menjadi sangat berat (load time lama) dan memakan memori browser.
    *   **Rekomendasi:** Wajib gunakan `paginate()`.

2.  **Fitur Pencarian Hilang (Major)**
    *   **Temuan:** Tidak ada input "Search" pada halaman Supplier.
    *   **Dampak:** User akan kesulitan mencari supplier spesifik jika daftar sudah panjang.

3.  **Layout & Interface (UX)**
    *   **Temuan:** Menggunakan form input *inline* (langsung di atas tabel).
    *   **Dampak:** Memakan ruang vertikal yang berharga (screen real estate). User harus scroll ke bawah untuk melihat data.
    *   **Rekomendasi:** Gunakan **Modal (Dialog)** untuk Tambah/Edit Supplier atau slide-over panel.

4.  **Hapus Data (UX)**
    *   **Temuan:** Menggunakan `confirm('Hapus supplier ini?')` bawaan browser.
    *   **Dampak:** Terlihat kaku dan tidak konsisten dengan desain aplikasi modern.
    *   **Rekomendasi:** Gunakan library modal konfirmasi yang estetik (misal: SweetAlert2 atau komponen Modal kustom).

### B. Modul Hutang / Payable (`Index.jsx` & `Show.jsx`)

1.  **Layout Index (UX)**
    *   **Temuan:** Sama seperti Supplier, terdapat form "Tambah Hutang" yang besar di bagian atas.
    *   **Masalah:** Mengalihkan fokus dari data utama (daftar hutang). Form input manual hutang mungkin jarang digunakan jika hutang otomatis terbentuk dari Pembelian (Purchase Order).
    *   **Rekomendasi:** Pindahkan ke tombol "Tambah Hutang" yang memicu Modal.

2.  **Detail Hutang (`Show.jsx`)**
    *   **Temuan:** Layout cukup baik dan informatif.
    *   **Minor:** Historis pembayaran ditampilkan standar.
    *   **Rekomendasi:** Tambahkan indikator visual (timeline) untuk riwayat pembayaran agar lebih intuitif.

3.  **Status Pembayaran**
    *   **Temuan:** Logika status (Lunas/Parsial) bergantung pada perhitungan di backend.
    *   **Saran Teknis:** Pastikan ada observer atau logic di Controller yang otomatis mengupdate status `Payable` saat `PayablePayment` dibuat, agar konsistensi data terjaga.

---

## 3. Rencana Perbaikan (Action Plan)

Berikut adalah tabel rekomendasi teknis yang disarankan untuk diimplementasikan:

### Prioritas Tinggi (Wajib Segera)
| Komponen | Perubahan | Deskripsi |
| :--- | :--- | :--- |
| **Backend** | `SupplierController` | Ubah `->get()` menjadi `->paginate(10)` atau `->paginate(15)`. |
| **Backend** | `SupplierController` | Tambahkan fitur filter pencarian (`when($request->search, ...)`). |
| **Frontend** | `Suppliers/Index.jsx` | Implementasi komponen Pagination di UI. |
| **Frontend** | `Suppliers/Index.jsx` | Tambahkan Input Search di bagian header. |

### Prioritas Menengah (Peningkatan UX)
| Komponen | Perubahan | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | `Suppliers/Index.jsx` | Ubah Form Tambah/Edit menjadi **Modal/Popup**. |
| **Frontend** | `Payables/Index.jsx` | Ubah Form Tambah Hutang menjadi **Modal/Popup**. |
| **Frontend** | Konfirmasi Hapus | Ganti `window.confirm` dengan Modal Konfirmasi yang cantik (selaras dengan tema dashboard). |

### Prioritas Rendah (Tampilan & Poles)
| Komponen | Perubahan | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | Table UI | Ubah tampilan list Supplier kartu menjadi Tabel (Table Row) agar lebih padat dan mudah dibaca (Nama, Telepon, Alamat dalam satu baris). |
| **Frontend** | `Payables/Show.jsx` | Rapikan tampilan struk/print preview agar lebih profesional. |

---

## 4. Contoh Konsep Perbaikan UX (Supplier)

**Layout Saat Ini:**
```
[ JUDUL ]
[ FORM INPUT BESAR ]
[ LIST ITEM 1 ]
[ LIST ITEM 2 ]
...
```

**Layout Rekomendasi:**
```
[ JUDUL ]              [ Search... ] [ + Tambah Supplier (Modal) ]
---------------------------------------------------------------
[ TABEL HEADER (Nama, Telepon, Email, Aksi)                   ]
---------------------------------------------------------------
[ Data Row 1                                                  ]
[ Data Row 2                                                  ]
...
[ Pagination Links (< 1 2 3 >)                                ]
```
