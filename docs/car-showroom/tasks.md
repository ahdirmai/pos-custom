# Task List: Car Dealership Landing Page (Example Branch)

> Turunan dari `plan.md` + `prd.md`. Status berikut disusun berdasarkan audit kode langsung di branch `example/car-dealership-landing` (bukan asumsi).
> Legenda: `[x]` selesai & terverifikasi di kode, `[~]` sebagian/perlu perbaikan, `[ ]` belum dikerjakan.

## 1. Branch Setup

- [x] Branch `example/car-dealership-landing` sudah dibuat dan menjadi branch aktif.
- [x] Tidak ada perubahan destruktif pada `SampleDataSeeder`, `ProductFactory`, atau homepage retail lama.

## 2. Database — `product_cars`

- [x] Migration `2026_08_10_015624_create_product_cars_table.php` — kolom sesuai spec (`product_id` unique FK cascade, `subtitle`, `highlight_specs` json, `specs` json, `gallery` json, `price_max`, `price_note`, `is_featured`, `cta_whatsapp_message`, timestamps).
- [x] Model `app/Models/ProductCar.php` — `$fillable`, `$casts` (array/boolean), `belongsTo(Product::class)`, accessor `priceRangeLabel`.
- [x] `app/Models/Product.php` — tambahan relasi `car(): HasOne` tanpa mengubah `$fillable`/`$casts` existing.
- [ ] **Verifikasi migration benar-benar jalan tanpa error** di environment nyata (`php artisan migrate`) — belum bisa diverifikasi dari sandbox (tidak ada akses DB). Perlu dicoba manual oleh dev.

## 3. Halaman Katalog Existing

- [x] `/products`, `/product/{slug}`, `/categories`, `/search` tidak diubah (dikonfirmasi tidak ada diff pada `ProductController`).

## 4. Self-Checkout

- [x] `CartController`, `CheckoutController`, `BiteshipService`, `PaymentGatewayManager`, `VoucherService`, `OrderController` tidak disentuh.
- [ ] **Belum ada verifikasi end-to-end nyata** (test otomatis maupun manual) bahwa produk mobil bisa checkout sampai tuntas — lihat §11.

## 5. Lead Capture

- [x] Migration `2026_08_10_015739_create_leads_table.php` — kolom sesuai spec (`name`, `phone`, `city`, `interested_product_id` nullable FK, `source` default `car_landing`, `notes`, timestamps).
- [x] Model `app/Models/Lead.php`.
- [x] `App\Http\Controllers\User\LeadController@store` — validasi (`name`, `phone` required; `city`, `interested_product_id`, `notes` nullable) & simpan.
- [x] Route `POST /leads` terdaftar dengan nama `user.leads.store` di `routes/web.php`.

## 6. Backend: Landing Page Controller

- [x] `HomeController@index` — query `heroProduct` (produk dengan `car.is_featured = true`, eager load `category`, `car`, plus append `current_price`/`original_price`/`has_flash_sale`/`discount_percentage`, `sold_count`, `average_rating`).
- [x] Query `catalog` — produk lain yang punya relasi `car` (exclude hero), dengan append yang sama.
- [x] `productCategories` — `Category::all()`.
- [x] `whatsappNumber` — dari `Setting::get('store_whatsapp', ...)`.
- [x] Render `Inertia::render('EndUser/CarLanding/Index', [...])` menggantikan homepage retail untuk route `user.index`.
- [x] Tidak ada perubahan pada `CartController`/`CheckoutController`/`PaymentGatewayManager`/`OrderController`.

## 7. Frontend: Landing Page Baru — ✅ SELESAI (build OK, 0 errors)

- [x] `resources/js/Pages/EndUser/CarLanding/Index.jsx` (dibungkus `UserLayout` existing, `forwardRef` untuk section scroll refs).
- [x] Section 1 — Hero (foto full-screen gelap + gradient, headline, badge harga + price_note, CTA: cart, beli, test drive scroll, WA sales, trust badges).
- [x] Section 2 — Highlight Spesifikasi (grid 2x4 icon card dari `heroProduct.car.highlight_specs` via `SpecBadge` + `@tabler/icons-react`).
- [x] Section 3 — Galeri Foto (grid masonry dari `heroProduct.car.gallery`, lightbox prev/next, fallback ke foto produk jika file tidak ada).
- [x] Section 4 — Spesifikasi Lengkap (tab Performa/Dimensi/Fitur/Baterai & Charging dari `heroProduct.car.specs` via `SpecTabs`).
- [x] Section 5 — Kalkulator Simulasi Kredit (slider DP 10-70%, pilihan tenor 12/24/36/48 bln, estimasi flat-rate, disclaimer, CTA Beli Sekarang via `CreditSimulator`).
- [x] Section 6 — Skema Pembelian (toggle pill Termasuk Baterai vs Subscription Baterai dengan tabel fitur via `PurchaseSchemeToggle`).
- [x] Section 7 — Katalog Mobil Lain (grid catalog, filter chip kategori, reuse `ProductCard`, overlay WA per card on hover, tombol Lihat Semua ke `/products`).
- [x] Section 8 — Testimoni/Use case (3 kartu statis: armada rental, hotel shuttle, taksi online).
- [x] Section 9 — FAQ accordion (8 item statis via `FaqAccordion`, termasuk bisa beli online).
- [x] Section 10 — Lead Form (Nama, No. HP, Kota, dropdown model catalog+hero, Notes; Inertia useForm ke `user.leads.store`, toast sukses via `LeadForm`).
- [x] Section 11 — Sticky WhatsApp Button (fixed bottom-right, z-60, clearance dari MobileNavbar via `StickyWhatsAppButton`).
- [x] Section 12 — Footer via `UserLayout` + price disclaimer bar.
- [x] Komponen `resources/js/Components/CarLanding/SpecBadge.jsx`.
- [x] Komponen `resources/js/Components/CarLanding/SpecTabs.jsx`.
- [x] Komponen `resources/js/Components/CarLanding/CreditSimulator.jsx`.
- [x] Komponen `resources/js/Components/CarLanding/PurchaseSchemeToggle.jsx`.
- [x] Komponen `resources/js/Components/CarLanding/FaqAccordion.jsx`.
- [x] Komponen `resources/js/Components/CarLanding/LeadForm.jsx`.
- [x] Komponen `resources/js/Components/CarLanding/StickyWhatsAppButton.jsx`.
- [x] `npm run build` sukses, 0 error, 0 warning.
- [x] **Premium redesign** — dark/cinematic showroom layout (§7 design overhaul).
- [x] `CarCard.jsx` — automotive showcase card (full-bleed image, gradient overlay, hover reveal actions, no marketplace elements).
- [x] `SpecBadge.jsx` — dark variant (`dark` prop) untuk dark section backgrounds.
- [x] Rhythm dark/light section: Hero → Highlight (dark) → Gallery (black) → Specs (white) → Credit (dark) → Scheme (white) → Catalog (dark) → Testimonial (white) → FAQ (gray) → Lead Form (dark + floating white card) → Disclaimer (dark).

## 8. Seeder Produk Mobil

- [x] `database/seeders/CarSampleDataSeeder.php` dibuat, terpisah dari `SampleDataSeeder`.
- [x] Reset data lama secara terisolasi (disable FK checks, delete `product_cars`/`StockBatch` terkait & produk terkait, delete 3 kategori spesifik) — tidak menyentuh data retail lain.
- [x] 3 kategori: City Car, SUV, MPV / Fleet — dengan `downloadImage()`.
- [x] 7 produk VinFast (VF3, VF5, VF e34, VF6, VF7, VF MPV7, Limo Green) sebagai `Product` standar + `ProductCar` terkait.
- [x] Limo Green: `is_featured = true`, `specs` lengkap (performa/dimensi/fitur/baterai_charging), `gallery` terisi, `highlight_specs` dengan ikon.
- [x] Model lain: `highlight_specs`/`specs` ringkas/placeholder ("Cek harga & spesifikasi terbaru di dealer").
- [x] `StockBatch` dibuat per produk (qty_in/qty_remaining = 8, tanpa expiry).
- [x] Tidak didaftarkan ke `DatabaseSeeder::run()` default (jalan manual via `--class=CarSampleDataSeeder`).
- [ ] **Belum pernah dijalankan & diverifikasi hasilnya** di database nyata (butuh `php artisan migrate` + `php artisan db:seed --class=CarSampleDataSeeder` di environment dengan akses DB).

## 9. Settings / Branding

- [x] `Setting::set('store_whatsapp', '628111222333', ...)` di seeder.
- [x] `Setting::set('theme_primary', '#0f9d58', ...)` (hijau EV) di seeder.
- [x] `ThemeService::primaryHex()` & `SettingController` pendukung sudah ada (dari branch `feat/dynamic-theme`, sudah masuk history branch ini).

## 10. Assets

- [x] Pola `downloadImage()` konsisten dipakai di `CarSampleDataSeeder` (folder `products`/`category`, nama file `car-{slug}`/`cat-{slug}`).
- [ ] Nama file gallery untuk Limo Green (`vinfast-limo-green-exterior-1.jpg`, dst.) hanya **referensi di kolom `gallery`** — belum ada mekanisme yang benar-benar mendownload/menyimpan file galeri tersebut ke storage. Perlu diputuskan: apakah galeri memakai file placeholder terpisah yang perlu didownload juga, atau reuse foto produk yang sama.

## 11. Testing — ❌ BELUM DIKERJAKAN

- [ ] `tests/Feature/CarLandingPageTest.php` — `user.index` return 200, hero product & jumlah catalog tampil (seed via `CarSampleDataSeeder`).
- [ ] Test checkout end-to-end untuk produk mobil (tambah ke cart → `POST /checkout/store` → transaksi terbuat, `order_status` benar, stok batch berkurang).
- [ ] Test `LeadController@store` — payload valid membuat row `Lead`.
- [ ] Test `LeadController@store` — payload invalid (HP kosong) gagal validasi.
- [ ] Jalankan `php artisan test --compact --filter=CarLanding`, `--filter=Checkout`, `--filter=Lead`.
- [ ] Jalankan `vendor/bin/pint --dirty --format agent` untuk semua file PHP yang disentuh.

## Ringkasan Progress

| Area                     | Progress                                |
| ------------------------ | --------------------------------------- |
| Database & Model         | 100% (pending verifikasi migrate nyata) |
| Backend Controller/Route | 100%                                    |
| Seeder                   | ~95% (pending run nyata + galeri foto)  |
| Settings/Branding        | 100%                                    |
| Frontend                 | 100% ✅                                 |
| Testing                  | 0%                                      |

**Next up (urutan disarankan):**

1. ~~Bangun `EndUser/CarLanding/Index.jsx` + komponen pendukung~~ — ✅ selesai.
2. Jalankan migrate + seeder di environment nyata, verifikasi manual di browser (`php artisan migrate && php artisan db:seed --class=CarSampleDataSeeder`).
3. Tulis Pest tests (§11) — `CarLandingPageTest`, checkout e2e, `LeadController`.
4. Jalankan Pint untuk semua file PHP yang disentuh (`vendor/bin/pint --dirty`).
