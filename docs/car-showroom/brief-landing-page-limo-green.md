# BRIEF LANDING PAGE — VinFast Limo Green (7-Seater EV) + Katalog Mobil VinFast

> Gunakan dokumen ini sebagai prompt/brief untuk AI Agent (Claude Code, Cursor, v0, dsb.) dalam membangun landing page penjualan mobil.

---

## 1. TUJUAN PROYEK
Buatkan landing page penjualan (sales landing page) untuk mobil **VinFast Limo Green**, MPV listrik 7-seater, sebagai produk utama (hero product). Di bawah bagian hero, tampilkan **katalog mobil VinFast lainnya** sebagai cross-sell, agar pengunjung yang tertarik varian lain tetap bisa lanjut lihat-lihat dan leads tetap tertangkap di satu halaman.

Goal halaman: **generate leads** (form/WA) untuk test drive, simulasi kredit, dan pemesanan unit — bukan e-commerce checkout.

---

## 2. TARGET AUDIENCE
- Keluarga muda yang cari MPV 7-penumpang untuk kebutuhan harian & mudik.
- Pelaku bisnis armada: rental, shuttle bandara/hotel, taksi online, korporat (B2B fleet).
- Pembeli yang sadar biaya operasional (tertarik EV karena hemat energi vs BBM).
- Lokasi: Indonesia (harga dalam Rupiah, istilah OTR, DP, cicilan).

---

## 3. PRODUK UTAMA (HERO) — VinFast Limo Green

**Positioning:** MPV listrik 7-seater untuk keluarga sekaligus armada bisnis (hotel shuttle, airport transfer, rental, taksi).

### Spesifikasi kunci
| Aspek | Detail |
|---|---|
| Tipe | MPV listrik, 7 penumpang |
| Dimensi | P 4.740 mm x L 1.872 mm x T 1.723 mm |
| Wheelbase | 2.840 mm |
| Ground clearance | 170–180 mm |
| Baterai | LFP (Lithium Iron Phosphate) ± 60,2–61,3 kWh |
| Jarak tempuh | Hingga 450 km (NEDC) per pengisian penuh |
| Fast charging | DC 80 kW, 10%→70% dalam ±30 menit |
| Tenaga motor | 150 kW (±201 hp), torsi 280 Nm |
| Penggerak | Roda depan (FWD) |
| Mode berkendara | Eco & Normal |
| Kapasitas bagasi | 126 L (7 kursi terisi) – 607 L (baris 3 dilipat) – hingga 1.240–1.245 L (baris 2 & 3 dilipat) |
| Turning radius | ±5,65 m |
| Fitur | Layar infotainment 10,1"–10,25", setir teleskopik 4 arah, AC filtrasi PM2.5, smart key one-touch unlock, automatic climate control, velg 18", LED DRL |
| Harga (referensi promo, cek update terbaru) | Mulai ±Rp299 jutaan (promo unit awal) s.d. Rp389 jutaan OTR (skema termasuk baterai); skema subscription baterai terpisah tersedia untuk segmen bisnis |

> ⚠️ Catatan untuk AI Agent: harga & promo di atas adalah harga peluncuran/promo per awal 2026 dan **bisa berubah**. Sertakan placeholder yang jelas agar mudah diupdate oleh pemilik bisnis (misal dari CMS/JSON), dan cantumkan disclaimer "Harga OTR dapat berubah sewaktu-waktu, hubungi dealer untuk info terbaru."

### Value proposition yang perlu ditonjolkan di hero
1. Kabin luas & fleksibel untuk keluarga besar / operasional bisnis.
2. Hemat biaya operasional (listrik vs BBM) — cocok untuk armada/rental.
3. Jarak tempuh jauh (450 km) + fast charging.
4. Fitur kenyamanan setara MPV premium tapi harga lebih terjangkau.
5. Skema pembelian fleksibel (termasuk baterai / subscription baterai) — menarik untuk fleet buyer.

---

## 4. KATALOG MOBIL LAIN (Cross-sell Section)
Tampilkan sebagai grid/carousel card di bawah hero, dengan foto, nama model, kategori, harga mulai, dan tombol "Lihat Detail" / "Tanya Sekarang".

| Model | Kategori | Segmen | Harga mulai (referensi) |
|---|---|---|---|
| VinFast VF 3 | EV mungil perkotaan | City car | ±Rp150–230 jutaan |
| VinFast VF 5 | A-SUV | SUV compact | Cek harga terbaru |
| VinFast VF e34 | SUV | SUV | Cek harga terbaru |
| VinFast VF 6 | B-SUV | SUV compact-medium | Cek harga terbaru |
| VinFast VF 7 | C-SUV | SUV medium (Eco & Plus) | ±Rp499–599 jutaan |
| VinFast VF MPV 7 | MPV 7-seater | MPV | Cek harga terbaru |
| **VinFast Limo Green** | MPV listrik 7-seater | MPV / fleet | ±Rp299–389 jutaan *(produk utama)* |

> Catatan: harga model selain Limo Green perlu diverifikasi/diupdate oleh tim sebelum publish — gunakan data placeholder terstruktur (JSON/array) agar gampang di-maintain.

---

## 5. STRUKTUR HALAMAN (Section by Section)

1. **Navbar** — Logo, menu (Beranda, Katalog, Simulasi Kredit, Test Drive, Kontak), CTA button "Hubungi Sales" (WhatsApp).
2. **Hero Section** — Foto Limo Green besar, headline + subheadline, 2 CTA utama: "Booking Test Drive" dan "Chat WhatsApp Sales". Badge promo (harga mulai Rp299 jutaan).
3. **Highlight Spesifikasi** — 4–6 ikon/kartu ringkas (jarak tempuh, kapasitas 7 penumpang, fast charging, bagasi luas).
4. **Galeri Foto/360°** — Eksterior & interior.
5. **Spesifikasi Lengkap** — Tabel/tab (Performa, Dimensi, Fitur, Baterai & Charging).
6. **Kalkulator/Simulasi Kredit sederhana** — Input DP & tenor → estimasi cicilan (bisa dummy/estimasi, bukan resmi bank).
7. **Skema Pembelian** — Bandingkan "Termasuk Baterai" vs "Subscription Baterai" dalam bentuk tabel/toggle.
8. **Katalog Mobil Lain** — Grid card semua model VinFast lainnya (lihat bagian 4), dengan filter kategori (City Car / SUV / MPV).
9. **Testimoni / Use case** — (opsional) khusus untuk segmen fleet/bisnis (hotel, rental, taksi).
10. **FAQ** — Pertanyaan umum (garansi, biaya charging, servis, dsb.)
11. **Lead Form** — Nama, No. HP/WA, Kota, Model yang diminati (dropdown termasuk semua model di katalog), tombol submit.
12. **Sticky CTA (mobile)** — Tombol WhatsApp mengambang.
13. **Footer** — Info dealer, alamat, kontak, medsos, disclaimer harga.

---

## 6. GAYA VISUAL & BRANDING
- Tema warna: hijau (mencerminkan "Green"/EV & ramah lingkungan) dikombinasi putih/hitam untuk kesan modern-premium.
- Gaya foto: mobil dengan latar urban/keluarga untuk kesan aspirational, plus latar armada/bandara untuk kesan B2B.
- Tipografi: modern, clean, sans-serif.
- Tone copywriting: persuasif tapi informatif — tonjolkan efisiensi biaya & kenyamanan keluarga.
- Fully responsive (mobile-first, karena banyak leads datang dari iklan mobile).

---

## 7. KEBUTUHAN TEKNIS
- Single-page landing page (atau multi-page: 1 halaman detail Limo Green + 1 halaman katalog), sesuai preferensi.
- Form lead terhubung ke WhatsApp API / Google Sheet / email (sesuaikan dengan tool yang tersedia).
- Data katalog mobil disimpan sebagai struktur data terpisah (array/JSON) agar mudah tambah/update model & harga.
- SEO dasar: title, meta description, OG image, structured data (Product schema) untuk Limo Green.
- Optimasi kecepatan loading (gambar di-compress/lazy load).
- Tombol CTA WhatsApp dengan pesan pre-filled, contoh: "Halo, saya tertarik dengan VinFast Limo Green, mohon info lebih lanjut."

---

## 8. DELIVERABLES YANG DIMINTA DARI AI AGENT
1. Landing page lengkap (HTML/React sesuai stack yang dipakai) sesuai struktur di atas.
2. Data katalog mobil dalam format terpisah yang mudah diedit.
3. Versi responsif mobile & desktop.
4. Placeholder gambar (jika belum ada aset asli) dengan nama file yang jelas agar mudah diganti nanti.
5. Catatan/README singkat cara mengganti harga, foto, dan menambah model baru ke katalog.

---

*Sumber data spesifikasi & harga: berita peluncuran VinFast Limo Green di IIMS 2026 & simposium EV, per Februari–Juli 2026. Harap diverifikasi ulang sebelum publish karena harga promo bersifat terbatas/berubah.*
