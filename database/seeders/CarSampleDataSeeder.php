<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCar;
use App\Models\Setting;
use App\Models\StockBatch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Seeds a VinFast car-dealership example catalog for the
 * `example/car-dealership-landing` branch.
 *
 * This is intentionally kept separate from SampleDataSeeder so the
 * original fashion/retail example is never overwritten. Run manually:
 *
 *   php artisan db:seed --class=CarSampleDataSeeder
 */
class CarSampleDataSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        $existingProductIds = ProductCar::query()->pluck("product_id");
        StockBatch::whereIn("product_id", $existingProductIds)->delete();
        ProductCar::query()->delete();
        Product::whereIn("id", $existingProductIds)->forceDelete();
        Category::whereIn("name", ["City Car", "SUV", "MPV / Fleet"])->forceDelete();

        Schema::enableForeignKeyConstraints();

        Storage::disk("public")->makeDirectory("category");
        Storage::disk("public")->makeDirectory("products");

        $this->command->info("Seeding car categories...");
        $categories = $this->seedCategories();

        $this->command->info("Seeding VinFast car lineup...");
        $this->seedProducts($categories);

        $this->command->info("Seeding dealer settings/branding...");
        $this->seedSettings();

        $this->command->info("Car showroom seeding completed!");
    }

    private function downloadImage(string $url, string $folder, string $filename): ?string
    {
        try {
            $this->command->info("  Downloading: {$filename}...");
            $response = Http::timeout(30)->get($url);

            if ($response->successful()) {
                // If the filename already carries an extension, keep it as-is;
                // otherwise append the default .jpg extension.
                $extension = pathinfo($filename, PATHINFO_EXTENSION) ? "" : ".jpg";
                $fullFilename = $filename . $extension;

                Storage::disk("public")->put($folder . "/" . $fullFilename, $response->body());

                return $fullFilename;
            }
        } catch (\Exception $e) {
            $this->command->warn("  Failed to download {$filename}: " . $e->getMessage());
        }

        return null;
    }

    private function seedCategories(): Collection
    {
        $categories = collect([
            [
                "name" => "City Car",
                "description" => "EV mungil untuk mobilitas perkotaan yang lincah dan efisien.",
                "image_url" =>
                    "https://images.unsplash.com/photo-1617704548623-340376564e68?w=400&h=400&fit=crop&auto=format&q=80",
            ],
            [
                "name" => "SUV",
                "description" =>
                    "SUV listrik dengan berbagai ukuran untuk kebutuhan keluarga dan berkendara jauh.",
                "image_url" =>
                    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop&auto=format&q=80",
            ],
            [
                "name" => "MPV / Fleet",
                "description" =>
                    "MPV listrik 7-seater untuk keluarga besar sekaligus armada bisnis (rental, shuttle, taksi).",
                "image_url" =>
                    "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=400&fit=crop&auto=format&q=80",
            ],
        ]);

        return $categories
            ->map(function ($category) {
                $slug = Str::slug($category["name"]);
                $image = $this->downloadImage($category["image_url"], "category", "cat-" . $slug);

                return Category::create([
                    "name" => $category["name"],
                    "description" => $category["description"],
                    "image" => $image ?? "default.jpg",
                ]);
            })
            ->keyBy("name");
    }

    private function seedProducts(Collection $categories): Collection
    {
        $products = collect([
            [
                "category" => "City Car",
                "barcode" => "VF-0003",
                "title" => "VinFast VF 3",
                "subtitle" => "EV mungil perkotaan",
                "description" =>
                    "City car listrik lincah, hemat biaya operasional, cocok untuk mobilitas harian di perkotaan.",
                "sell_price" => 150_000_000,
                "price_max" => 230_000_000,
                "image_url" =>
                    "https://images.unsplash.com/photo-1617704548623-340376564e68?w=600&h=400&fit=crop&auto=format&q=80",
                "is_featured" => false,
                "highlight_specs" => [
                    ["icon" => "route", "label" => "Jarak Tempuh", "value" => "Hingga 210 km"],
                    ["icon" => "users", "label" => "Kapasitas", "value" => "5 penumpang"],
                    ["icon" => "bolt", "label" => "Motor Listrik", "value" => "33 kW (44 hp)"],
                    ["icon" => "leaf", "label" => "Emisi", "value" => "Zero emission"],
                ],
                "specs" => [
                    "performa" => [
                        "Tenaga motor" => "33 kW (44 hp)",
                        "Baterai" => "LFP 32 kWh",
                        "Penggerak" => "Roda depan (FWD)",
                        "Mode berkendara" => "Eco & Normal",
                    ],
                    "dimensi" => [
                        "Dimensi" => "P 3.190 mm x L 1.679 mm x T 1.612 mm",
                        "Wheelbase" => "2.075 mm",
                        "Ground clearance" => "195 mm",
                        "Bagasi" => "Hingga 1.010 L (baris belakang dilipat)",
                    ],
                    "baterai_charging" => [
                        "Jarak tempuh" => "Hingga 210 km per pengisian penuh",
                        "Tipe baterai" => "LFP 32 kWh",
                        "Charging" => "AC 7,4 kW – DC fast charge didukung",
                    ],
                    "fitur" => [
                        "Infotainment" => "Layar sentuh 10\"",
                        "Eksterior" => "LED headlight, velg 16\"",
                        "Keamanan" => "ABS, EBD, dual airbag",
                        "Kunci" => "Remote central locking",
                    ],
                ],
                "gallery_urls" => [
                    "car-vinfast-vf-3-g1.jpg" =>
                        "https://images.unsplash.com/photo-1617704548623-340376564e68?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-3-g2.jpg" =>
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-3-g3.jpg" =>
                        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=600&fit=crop&auto=format&q=80",
                ],
                "cta_whatsapp_message" =>
                    "Halo, saya tertarik dengan VinFast VF 3, mohon info lebih lanjut.",
            ],
            [
                "category" => "SUV",
                "barcode" => "VF-0005",
                "title" => "VinFast VF 5",
                "subtitle" => "A-SUV compact",
                "description" =>
                    "SUV listrik compact dengan desain modern, ideal untuk penggunaan harian maupun luar kota.",
                "sell_price" => 200_000_000,
                "price_max" => null,
                "image_url" =>
                    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop&auto=format&q=80",
                "is_featured" => false,
                "highlight_specs" => [
                    ["icon" => "route", "label" => "Jarak Tempuh", "value" => "Hingga 315 km"],
                    ["icon" => "users", "label" => "Kapasitas", "value" => "5 penumpang"],
                    ["icon" => "bolt", "label" => "Motor Listrik", "value" => "100 kW (134 hp)"],
                    ["icon" => "battery", "label" => "Baterai", "value" => "LFP 37,23 kWh"],
                ],
                "specs" => [
                    "performa" => [
                        "Tenaga motor" => "100 kW (134 hp), torsi 135 Nm",
                        "Baterai" => "LFP 37,23 kWh",
                        "Penggerak" => "Roda depan (FWD)",
                        "Mode berkendara" => "Eco, Normal & Sport",
                    ],
                    "dimensi" => [
                        "Dimensi" => "P 3.965 mm x L 1.720 mm x T 1.620 mm",
                        "Wheelbase" => "2.510 mm",
                        "Ground clearance" => "190 mm",
                        "Bagasi" => "Hingga 580 L",
                    ],
                    "baterai_charging" => [
                        "Jarak tempuh" => "Hingga 315 km per pengisian penuh",
                        "Tipe baterai" => "LFP 37,23 kWh",
                        "Fast charging" => "DC 70 kW, 10%→70% dalam ±28 menit",
                    ],
                    "fitur" => [
                        "Infotainment" => "Layar sentuh 10\"",
                        "Eksterior" => "LED headlight, velg 16\"",
                        "Keamanan" => "ABS, EBD, ESC, dual airbag",
                        "Kunci" => "Smart keyless entry",
                    ],
                ],
                "gallery_urls" => [
                    "car-vinfast-vf-5-g1.jpg" =>
                        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-5-g2.jpg" =>
                        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-5-g3.jpg" =>
                        "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800&h=600&fit=crop&auto=format&q=80",
                ],
                "cta_whatsapp_message" =>
                    "Halo, saya tertarik dengan VinFast VF 5, mohon info lebih lanjut.",
            ],
            [
                "category" => "SUV",
                "barcode" => "VF-E34",
                "title" => "VinFast VF e34",
                "subtitle" => "SUV listrik keluarga",
                "description" =>
                    "SUV listrik dengan kabin luas dan fitur berkendara modern untuk kebutuhan keluarga.",
                "sell_price" => 250_000_000,
                "price_max" => null,
                "image_url" =>
                    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop&auto=format&q=80",
                "is_featured" => false,
                "highlight_specs" => [
                    ["icon" => "route", "label" => "Jarak Tempuh", "value" => "Hingga 318 km"],
                    ["icon" => "users", "label" => "Kapasitas", "value" => "5 penumpang"],
                    ["icon" => "bolt", "label" => "Motor Listrik", "value" => "130 kW (174 hp)"],
                    ["icon" => "battery", "label" => "Baterai", "value" => "NMC 42 kWh"],
                ],
                "specs" => [
                    "performa" => [
                        "Tenaga motor" => "130 kW (174 hp), torsi 242 Nm",
                        "Baterai" => "NMC 42 kWh",
                        "Penggerak" => "Roda depan (FWD)",
                        "Mode berkendara" => "Eco & Sport",
                    ],
                    "dimensi" => [
                        "Dimensi" => "P 4.300 mm x L 1.793 mm x T 1.613 mm",
                        "Wheelbase" => "2.612 mm",
                        "Ground clearance" => "190 mm",
                        "Bagasi" => "Hingga 420 L",
                    ],
                    "baterai_charging" => [
                        "Jarak tempuh" => "Hingga 318 km per pengisian penuh",
                        "Tipe baterai" => "NMC 42 kWh",
                        "Fast charging" => "DC 70 kW, 10%→70% dalam ±30 menit",
                    ],
                    "fitur" => [
                        "Infotainment" => "Layar sentuh 12,3\"",
                        "Eksterior" => "LED DRL, velg 17\"",
                        "Keamanan" => "ESC, hill assist, 6 airbag",
                        "Kunci" => "Smart keyless entry",
                    ],
                ],
                "gallery_urls" => [
                    "car-vinfast-vf-e34-g1.jpg" =>
                        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-e34-g2.jpg" =>
                        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-e34-g3.jpg" =>
                        "https://images.unsplash.com/photo-1552930294-6b595f4c2974?w=800&h=600&fit=crop&auto=format&q=80",
                ],
                "cta_whatsapp_message" =>
                    "Halo, saya tertarik dengan VinFast VF e34, mohon info lebih lanjut.",
            ],
            [
                "category" => "SUV",
                "barcode" => "VF-0006",
                "title" => "VinFast VF 6",
                "subtitle" => "B-SUV compact-medium",
                "description" =>
                    "SUV listrik kelas menengah dengan keseimbangan ruang kabin dan efisiensi energi.",
                "sell_price" => 280_000_000,
                "price_max" => null,
                "image_url" =>
                    "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format&q=80",
                "is_featured" => false,
                "highlight_specs" => [
                    ["icon" => "route", "label" => "Jarak Tempuh", "value" => "Hingga 399 km"],
                    ["icon" => "users", "label" => "Kapasitas", "value" => "5 penumpang"],
                    ["icon" => "bolt", "label" => "Motor Listrik", "value" => "150 kW (201 hp)"],
                    ["icon" => "battery", "label" => "Baterai", "value" => "LFP 59,6 kWh"],
                ],
                "specs" => [
                    "performa" => [
                        "Tenaga motor" => "150 kW (201 hp), torsi 310 Nm",
                        "Baterai" => "LFP 59,6 kWh",
                        "Penggerak" => "Roda depan (FWD)",
                        "Mode berkendara" => "Eco, Normal & Sport",
                    ],
                    "dimensi" => [
                        "Dimensi" => "P 4.238 mm x L 1.820 mm x T 1.594 mm",
                        "Wheelbase" => "2.730 mm",
                        "Ground clearance" => "190 mm",
                        "Bagasi" => "Hingga 550 L",
                    ],
                    "baterai_charging" => [
                        "Jarak tempuh" => "Hingga 399 km per pengisian penuh",
                        "Tipe baterai" => "LFP 59,6 kWh",
                        "Fast charging" => "DC 90 kW, 10%→70% dalam ±28 menit",
                    ],
                    "fitur" => [
                        "Infotainment" => "Layar sentuh 12,9\"",
                        "Eksterior" => "LED DRL, velg 18\"",
                        "Keamanan" => "ADAS level 2, 6 airbag",
                        "Kunci" => "Smart keyless entry",
                    ],
                ],
                "gallery_urls" => [
                    "car-vinfast-vf-6-g1.jpg" =>
                        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-6-g2.jpg" =>
                        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-6-g3.jpg" =>
                        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=600&fit=crop&auto=format&q=80",
                ],
                "cta_whatsapp_message" =>
                    "Halo, saya tertarik dengan VinFast VF 6, mohon info lebih lanjut.",
            ],
            [
                "category" => "SUV",
                "barcode" => "VF-0007",
                "title" => "VinFast VF 7",
                "subtitle" => "C-SUV medium (Eco & Plus)",
                "description" =>
                    "SUV listrik medium dengan performa lebih tinggi, tersedia varian Eco dan Plus.",
                "sell_price" => 499_000_000,
                "price_max" => 599_000_000,
                "image_url" =>
                    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop&auto=format&q=80",
                "is_featured" => false,
                "highlight_specs" => [
                    ["icon" => "route", "label" => "Jarak Tempuh", "value" => "Hingga 468 km"],
                    ["icon" => "users", "label" => "Kapasitas", "value" => "5 penumpang"],
                    ["icon" => "bolt", "label" => "Motor Listrik", "value" => "175 kW (235 hp)"],
                    ["icon" => "battery", "label" => "Baterai", "value" => "NMC 75,3 kWh"],
                ],
                "specs" => [
                    "performa" => [
                        "Tenaga motor" => "175 kW (235 hp), torsi 350 Nm",
                        "Baterai" => "NMC 75,3 kWh",
                        "Penggerak" => "Roda depan (FWD)",
                        "Mode berkendara" => "Eco, Normal, Sport & Snow",
                    ],
                    "dimensi" => [
                        "Dimensi" => "P 4.545 mm x L 1.890 mm x T 1.653 mm",
                        "Wheelbase" => "2.840 mm",
                        "Ground clearance" => "195 mm",
                        "Bagasi" => "Hingga 550 L",
                    ],
                    "baterai_charging" => [
                        "Jarak tempuh" => "Hingga 468 km per pengisian penuh",
                        "Tipe baterai" => "NMC 75,3 kWh",
                        "Fast charging" => "DC 110 kW, 10%→70% dalam ±26 menit",
                    ],
                    "fitur" => [
                        "Infotainment" => "Layar sentuh 15\"",
                        "Eksterior" => "LED matrix, velg 19\"",
                        "Keamanan" => "ADAS level 2+, 6 airbag",
                        "Kunci" => "Smart keyless entry + remote start",
                    ],
                ],
                "gallery_urls" => [
                    "car-vinfast-vf-7-g1.jpg" =>
                        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-7-g2.jpg" =>
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-7-g3.jpg" =>
                        "https://images.unsplash.com/photo-1552930294-6b595f4c2974?w=800&h=600&fit=crop&auto=format&q=80",
                ],
                "cta_whatsapp_message" =>
                    "Halo, saya tertarik dengan VinFast VF 7, mohon info lebih lanjut.",
            ],
            [
                "category" => "MPV / Fleet",
                "barcode" => "VF-MPV7",
                "title" => "VinFast VF MPV 7",
                "subtitle" => "MPV 7-seater",
                "description" =>
                    "MPV listrik 7-seater untuk kebutuhan keluarga besar dan operasional armada.",
                "sell_price" => 320_000_000,
                "price_max" => null,
                "image_url" =>
                    "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&h=400&fit=crop&auto=format&q=80",
                "is_featured" => false,
                "highlight_specs" => [
                    ["icon" => "route", "label" => "Jarak Tempuh", "value" => "Hingga 450 km"],
                    ["icon" => "users", "label" => "Kapasitas", "value" => "7 penumpang"],
                    ["icon" => "bolt", "label" => "Motor Listrik", "value" => "150 kW (201 hp)"],
                    ["icon" => "briefcase", "label" => "Bagasi", "value" => "Hingga 1.240 L"],
                ],
                "specs" => [
                    "performa" => [
                        "Tenaga motor" => "150 kW (201 hp), torsi 280 Nm",
                        "Baterai" => "LFP 60,2 kWh",
                        "Penggerak" => "Roda depan (FWD)",
                        "Mode berkendara" => "Eco & Normal",
                    ],
                    "dimensi" => [
                        "Dimensi" => "P 4.740 mm x L 1.872 mm x T 1.723 mm",
                        "Wheelbase" => "2.840 mm",
                        "Ground clearance" => "170–180 mm",
                        "Kapasitas bagasi" => "Hingga 1.240 L (baris 2 & 3 dilipat)",
                    ],
                    "baterai_charging" => [
                        "Jarak tempuh" => "Hingga 450 km per pengisian penuh",
                        "Tipe baterai" => "LFP 60,2 kWh",
                        "Fast charging" => "DC 80 kW, 10%→70% dalam ±30 menit",
                    ],
                    "fitur" => [
                        "Infotainment" => "Layar sentuh 10,25\"",
                        "Eksterior" => "LED DRL, velg 18\"",
                        "Keamanan" => "ABS, ESC, 6 airbag",
                        "Kunci" => "Smart keyless entry",
                    ],
                ],
                "gallery_urls" => [
                    "car-vinfast-vf-mpv7-g1.jpg" =>
                        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-mpv7-g2.jpg" =>
                        "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop&auto=format&q=80",
                    "car-vinfast-vf-mpv7-g3.jpg" =>
                        "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=600&fit=crop&auto=format&q=80",
                ],
                "cta_whatsapp_message" =>
                    "Halo, saya tertarik dengan VinFast VF MPV 7, mohon info lebih lanjut.",
            ],
            [
                "category" => "MPV / Fleet",
                "barcode" => "VF-LIMOG",
                "title" => "VinFast Limo Green",
                "subtitle" => "MPV Listrik 7-Seater untuk Keluarga & Armada Bisnis",
                "description" =>
                    "MPV listrik 7-seater untuk keluarga sekaligus armada bisnis (hotel shuttle, airport transfer, rental, taksi). Kabin luas & fleksibel, hemat biaya operasional, jarak tempuh jauh dengan fast charging, serta fitur kenyamanan setara MPV premium.",
                "sell_price" => 299_000_000,
                "price_max" => 389_000_000,
                "image_url" =>
                    "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1200&h=800&fit=crop&auto=format&q=80",
                "is_featured" => true,
                "highlight_specs" => [
                    [
                        "icon" => "route",
                        "label" => "Jarak Tempuh",
                        "value" => "Hingga 450 km (NEDC)",
                    ],
                    ["icon" => "users", "label" => "Kapasitas", "value" => "7 Penumpang"],
                    [
                        "icon" => "bolt",
                        "label" => "Fast Charging",
                        "value" => "DC 80 kW, 10%→70% ±30 menit",
                    ],
                    ["icon" => "briefcase", "label" => "Bagasi", "value" => "Hingga 1.240–1.245 L"],
                ],
                "specs" => [
                    "performa" => [
                        "Tenaga motor" => "150 kW (±201 hp), torsi 280 Nm",
                        "Penggerak" => "Roda depan (FWD)",
                        "Mode berkendara" => "Eco & Normal",
                        "Turning radius" => "±5,65 m",
                    ],
                    "dimensi" => [
                        "Dimensi" => "P 4.740 mm x L 1.872 mm x T 1.723 mm",
                        "Wheelbase" => "2.840 mm",
                        "Ground clearance" => "170–180 mm",
                        "Kapasitas bagasi" =>
                            "126 L (7 kursi terisi) – 607 L (baris 3 dilipat) – hingga 1.240–1.245 L (baris 2 & 3 dilipat)",
                    ],
                    "fitur" => [
                        "Infotainment" => 'Layar 10,1"–10,25"',
                        "Setir" => "Teleskopik 4 arah",
                        "AC" => "Filtrasi PM2.5, automatic climate control",
                        "Kunci" => "Smart key one-touch unlock",
                        "Eksterior" => 'Velg 18", LED DRL',
                    ],
                    "baterai_charging" => [
                        "Tipe baterai" => "LFP (Lithium Iron Phosphate) ± 60,2–61,3 kWh",
                        "Jarak tempuh" => "Hingga 450 km (NEDC) per pengisian penuh",
                        "Fast charging" => "DC 80 kW, 10%→70% dalam ±30 menit",
                    ],
                ],
                "gallery_urls" => [
                    "vinfast-limo-green-exterior-1" =>
                        "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=1200&h=800&fit=crop&auto=format&q=80",
                    "vinfast-limo-green-exterior-2" =>
                        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&fit=crop&auto=format&q=80",
                    "vinfast-limo-green-interior-1" =>
                        "https://images.unsplash.com/photo-1541348263662-e068662d82af?w=1200&h=800&fit=crop&auto=format&q=80",
                    "vinfast-limo-green-interior-2" =>
                        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=800&fit=crop&auto=format&q=80",
                ],
                "cta_whatsapp_message" =>
                    "Halo, saya tertarik dengan VinFast Limo Green, mohon info lebih lanjut.",
            ],
        ]);

        return $products
            ->map(function ($product) use ($categories) {
                $category = $categories->get($product["category"]);
                $slug = Str::slug($product["title"]);
                $image = $this->downloadImage($product["image_url"], "products", "car-" . $slug);

                $record = Product::create([
                    "category_id" => $category?->id,
                    "image" => $image ?? "default.jpg",
                    "barcode" => $product["barcode"],
                    "sku" => $product["barcode"],
                    "title" => $product["title"],
                    "slug" => $slug,
                    "description" => $product["description"],
                    "buy_price" => (int) round($product["sell_price"] * 0.85),
                    "sell_price" => $product["sell_price"],
                    "is_pph23" => false,
                    "stock" => 8,
                ]);

                // Download gallery images if gallery_urls are provided
                $gallery = $product["gallery"] ?? [];
                if (!empty($product["gallery_urls"])) {
                    $gallery = [];
                    foreach ($product["gallery_urls"] as $filename => $url) {
                        $downloaded = $this->downloadImage($url, "products", $filename);
                        $gallery[] = $downloaded ?? $filename . ".jpg";
                    }
                }

                ProductCar::create([
                    "product_id" => $record->id,
                    "subtitle" => $product["subtitle"],
                    "highlight_specs" => $product["highlight_specs"] ?? [],
                    "specs" => $product["specs"] ?? [],
                    "gallery" => $gallery,
                    "price_max" => $product["price_max"] ?? null,
                    "price_note" =>
                        "Harga OTR dapat berubah sewaktu-waktu, hubungi dealer untuk info terbaru.",
                    "is_featured" => $product["is_featured"],
                    "cta_whatsapp_message" => $product["cta_whatsapp_message"],
                ]);

                StockBatch::create([
                    "product_id" => $record->id,
                    "batch_code" => "INIT-" . $record->id,
                    "qty_in" => 8,
                    "qty_remaining" => 8,
                    "buy_price" => $record->buy_price,
                    "received_date" => now()->toDateString(),
                    "expired_date" => null,
                    "note" => "Stok unit awal (seed contoh showroom mobil).",
                ]);

                return $record;
            })
            ->keyBy("barcode");
    }

    private function seedSettings(): void
    {
        Setting::set(
            "store_name",
            "PT Riline Velocity Express (RVE)",
            "Nama perusahaan/dealer showroom.",
        );
        Setting::set(
            "store_whatsapp",
            "628111222333",
            "Nomor WhatsApp dealer/sales untuk CTA landing mobil.",
        );
        Setting::set(
            "theme_primary",
            "#0f9d58",
            "Warna utama tema (hijau EV) untuk contoh showroom mobil.",
        );
    }
}
