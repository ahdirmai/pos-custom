# 📋 Rekap Fitur Aplikasi

Dokumen ini merangkum seluruh fitur yang tersedia di aplikasi, dibagi menjadi dua sisi: **Toko Online** (yang dilihat pelanggan) dan **Panel Admin** (yang dikelola oleh pengelola toko).

---

## 🛒 Toko Online (Sisi Pelanggan)

### Beranda
Halaman utama yang menyambut pengunjung saat membuka website toko.

| Fitur | Keterangan |
|---|---|
| Banner Utama | Slideshow gambar promosi besar di bagian atas — dikelola dari admin |
| Banner Promo | Gambar promosi tambahan di bawah banner utama |
| Pencarian Produk | Kolom pencarian langsung dari halaman utama (tampil di desktop) |
| Kategori Produk | Daftar kategori yang bisa diklik untuk langsung melihat produk per kategori |
| Produk Terbaru | Menampilkan produk-produk yang baru ditambahkan |
| Artikel Terbaru | Menampilkan artikel/blog terbaru dari toko |

---

### Pencarian Produk
Halaman khusus pencarian dengan rekomendasi produk.

| Fitur | Keterangan |
|---|---|
| Kolom Pencarian | Input pencarian yang otomatis aktif saat halaman dibuka |
| Kategori Cepat | Tombol-tombol kategori untuk langsung melihat produk per kategori |
| Produk Terlaris | Rekomendasi 8 produk yang paling banyak terjual |
| Produk Terbaru | Rekomendasi 8 produk yang baru ditambahkan |
| Hasil Pencarian | Setelah mengetik dan menekan "Cari", pelanggan diarahkan ke halaman katalog dengan hasil pencarian |

---

### Katalog Produk
Halaman daftar semua produk yang tersedia.

| Fitur | Keterangan |
|---|---|
| Filter Kategori | Pilih kategori untuk menyaring produk |
| Filter Harga | Masukkan harga minimum dan maksimum |
| Pencarian | Cari produk berdasarkan nama |
| Urutan | Urutkan berdasarkan harga (termurah/termahal) atau terbaru |
| Navigasi Halaman | 12 produk per halaman dengan tombol navigasi |

---

### Detail Produk
Tampilan lengkap saat pelanggan memilih salah satu produk.

| Fitur | Keterangan |
|---|---|
| Foto Produk | Gambar produk dalam ukuran besar |
| Wishlist | Tombol ♥ untuk menandai produk sebagai favorit |
| Info Produk | Kategori, nama, SKU, jumlah terjual |
| Harga | Harga dalam format Rupiah |
| Atur Jumlah | Tombol +/- untuk mengatur jumlah beli (tidak bisa melebihi stok) |
| Detail Fisik | Berat dan dimensi produk jika tersedia |
| Tambah ke Keranjang | Menambahkan produk ke keranjang belanja |
| Beli Langsung | Langsung masuk keranjang dan lanjut ke pembayaran |
| Tab Deskripsi | Penjelasan lengkap tentang produk |
| Tab Ulasan | Rata-rata rating bintang, jumlah ulasan, dan daftar ulasan pelanggan |
| Produk Terkait | 4 produk lain dari kategori yang sama |

---

### Keranjang Belanja
Tempat pelanggan melihat dan mengatur produk yang ingin dibeli.

| Fitur | Keterangan |
|---|---|
| Daftar Produk | Semua produk di keranjang dengan gambar, nama, dan harga |
| Ubah Jumlah | Bisa mengubah jumlah langsung dari keranjang |
| Hapus Produk | Menghapus produk yang tidak jadi dibeli |
| Total Belanja | Menampilkan total harga keseluruhan |
| Lanjut Checkout | Tombol untuk melanjutkan ke proses pembayaran |

---

### Checkout (Pembayaran)
Proses pengisian alamat dan pembayaran pesanan.

| Fitur | Keterangan |
|---|---|
| Pilih Alamat Tersimpan | Memilih dari daftar alamat yang pernah disimpan |
| Form Alamat Baru | Mengisi alamat pengiriman baru (nama penerima, telepon, alamat) |
| Pilih Wilayah | Dropdown bertingkat: Provinsi → Kota → Kecamatan → Kelurahan |
| Kode Pos Otomatis | Kode pos otomatis terisi setelah memilih kelurahan/desa |
| Simpan Alamat | Opsi untuk menyimpan alamat baru agar bisa digunakan lagi |
| Cek Ongkir | Tombol untuk mengecek tarif pengiriman — tersedia di alamat tersimpan maupun baru |
| Pilih Kurir | Memilih kurir dan jenis layanan pengiriman |
| Kode Voucher | Memasukkan kode voucher untuk mendapatkan diskon |
| Ringkasan Pesanan | Total belanja, ongkir, diskon, dan grand total |
| Metode Pembayaran | Transfer manual ke rekening toko |

---

### Invoice
Halaman tagihan setelah pesanan berhasil dibuat.

| Fitur | Keterangan |
|---|---|
| Nomor Invoice | Nomor tagihan unik dengan barcode |
| Detail Pesanan | Daftar produk, jumlah, harga, dan subtotal |
| Info Pengiriman | Alamat tujuan, nama kurir, dan biaya kirim |
| Total Pembayaran | Jumlah yang harus dibayar |
| Info Rekening | Nomor rekening bank tujuan transfer |

---

### Riwayat Pesanan
Daftar semua pesanan yang pernah dibuat pelanggan.

| Fitur | Keterangan |
|---|---|
| Daftar Pesanan | Nomor invoice, tanggal, total, dan status setiap pesanan |
| Status Pesanan | Label berwarna sesuai status: Belum Bayar, Diproses, Dikirim, Selesai, Dibatalkan |
| Nomor Resi | Ditampilkan jika sudah diisi oleh admin |
| Navigasi Halaman | Untuk pelanggan dengan banyak pesanan |

---

### Detail Pesanan
Tampilan lengkap dari satu pesanan.

| Fitur | Keterangan |
|---|---|
| Status Pesanan | Badge berwarna menunjukkan status terkini |
| Info Penerima | Nama, nomor telepon, dan alamat lengkap |
| Nomor Resi | Nomor resi pengiriman jika sudah tersedia |
| Daftar Produk | Tabel produk yang dipesan (gambar, nama, jumlah, subtotal) |
| Ringkasan Harga | Subtotal, ongkir, diskon, dan grand total |
| Upload Bukti Bayar | Form upload foto bukti transfer |
| Konfirmasi Terima | Tombol "Pesanan Diterima" untuk menyelesaikan pesanan |
| Beri Ulasan | Formulir ulasan untuk semua produk sekaligus (rating bintang + komentar) |

---

### Profil Pelanggan
Halaman profil dengan beberapa tab informasi.

| Fitur | Keterangan |
|---|---|
| Info Akun | Nama dan email pelanggan |
| Alamat Tersimpan | Kelola daftar alamat — tambah, edit, hapus, set sebagai utama |
| Riwayat Pesanan | Tab untuk melihat daftar transaksi |
| Wishlist | Tab daftar produk favorit |

---

### Artikel / Blog
Halaman konten informatif dari toko.

| Fitur | Keterangan |
|---|---|
| Daftar Artikel | Artikel dengan gambar, judul, kategori, ringkasan, dan tanggal |
| Baca Artikel | Halaman baca lengkap satu artikel |
| Navigasi Halaman | Untuk banyak artikel |

---

### Registrasi & Login

| Fitur | Keterangan |
|---|---|
| Halaman Login | Form masuk dengan email dan password, opsi "Ingat saya", dan link ke registrasi |
| Halaman Daftar | Form registrasi akun baru (nama, email, password) dengan tampilan senada halaman login |
| Lupa Password | Link untuk reset password via email |

---

## 🛠️ Panel Admin (Sisi Pengelola Toko)

### Manajemen Banner
Mengelola gambar promosi yang ditampilkan di beranda.

| Fitur | Keterangan |
|---|---|
| Daftar Banner | Tabel dengan preview gambar, tipe (utama/promo), status aktif, dan urutan |
| Tambah Banner | Upload gambar, atur tipe, link tujuan, dan urutan tampil |
| Edit Banner | Ubah gambar dan pengaturan banner |
| Hapus Banner | Menghapus banner dengan konfirmasi |
| Pencarian | Cari banner berdasarkan nama atau tipe |

---

### Manajemen Blog
Sistem blog untuk konten promosi dan informasi toko.

#### Artikel
| Fitur | Keterangan |
|---|---|
| Daftar Artikel | Tabel dengan judul, kategori, penulis, tanggal, dan status |
| Tambah Artikel | Form lengkap: judul, konten, kategori, tag, gambar cover, status publish |
| Edit Artikel | Ubah semua informasi artikel |
| Hapus Artikel | Menghapus dengan konfirmasi |

#### Kategori & Tag Blog
| Fitur | Keterangan |
|---|---|
| Kategori Blog | Kelola kategori artikel (tambah, edit, hapus) |
| Tag Blog | Kelola tag artikel (tambah, edit, hapus) |

---

### Manajemen Kurir Pengiriman
Mengatur kurir yang tersedia saat pelanggan checkout.

| Fitur | Keterangan |
|---|---|
| Daftar Kurir | Tampilan kartu kurir dengan logo, nama, dan kode |
| Tambah Kurir | Form menambah kurir baru (nama, kode, upload logo) |
| Edit Kurir | Ubah informasi kurir |
| Hapus Kurir | Menghapus kurir |
| Aktif / Nonaktif | Toggle untuk mengaktifkan atau menonaktifkan kurir |

---

### Moderasi Ulasan Produk
Mengelola ulasan yang diberikan pelanggan, diakses dari halaman produk.

| Fitur | Keterangan |
|---|---|
| Akses per Produk | Tombol ulasan pada setiap produk di halaman daftar produk |
| Info Produk | Menampilkan gambar dan nama produk beserta total ulasan |
| Daftar Ulasan | Nama pelanggan, rating bintang, tanggal, dan isi ulasan |
| Sembunyikan Ulasan | Menyembunyikan ulasan dari halaman produk (tanpa menghapus) |
| Hapus Ulasan | Menghapus ulasan secara permanen |
| Navigasi Halaman | Untuk produk dengan banyak ulasan |
