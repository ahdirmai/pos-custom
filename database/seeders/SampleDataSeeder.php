<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Profit;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        Cart::truncate();
        TransactionDetail::truncate();
        Profit::truncate();
        Transaction::truncate();
        Product::truncate();
        Category::truncate();
        Customer::truncate();

        Schema::enableForeignKeyConstraints();

        Storage::disk('public')->makeDirectory('category');
        Storage::disk('public')->makeDirectory('products');

        $this->command->info('Seeding customers...');
        $customers = $this->seedCustomers();

        $this->command->info('Seeding fashion categories...');
        $categories = $this->seedCategories();

        $this->command->info('Seeding fashion products...');
        $this->seedProducts($categories);

        $this->command->info('Sample data seeding completed!');
    }

    private function downloadImage(string $url, string $folder, string $filename): ?string
    {
        try {
            $this->command->info("  Downloading: {$filename}...");
            $response = Http::timeout(30)->get($url);

            if ($response->successful()) {
                $extension    = 'jpg';
                $fullFilename = $filename . '.' . $extension;

                Storage::disk('public')->put(
                    $folder . '/' . $fullFilename,
                    $response->body()
                );

                return $fullFilename;
            }
        } catch (\Exception $e) {
            $this->command->warn("  Failed to download {$filename}: " . $e->getMessage());
        }

        return null;
    }

    private function seedCustomers(): Collection
    {
        $customers = collect([
            ['name' => 'Andi Nugraha', 'no_telp' => '6281211111111', 'address' => 'Jl. Melati No. 21, Bandung'],
            ['name' => 'Bunga Maharani', 'no_telp' => '6281312345678', 'address' => 'Jl. Mawar No. 5, Jakarta'],
            ['name' => 'Cici Amelia', 'no_telp' => '6281512340000', 'address' => 'Jl. Anggrek No. 17, Surabaya'],
            ['name' => 'Hendra Wijaya', 'no_telp' => '6285544332211', 'address' => 'Jl. Flamboyan No. 8, Denpasar'],
        ]);

        return $customers->map(fn($customer) => Customer::create($customer))->keyBy('name');
    }

    private function seedCategories(): Collection
    {
        $categories = collect([
            [
                'name'        => 'The Essential Daily Wear',
                'description' => 'Koleksi dasar wajib punya untuk kenyamanan aktivitas sehari-hari.',
                'image_url'   => 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop&auto=format&q=80',
            ],
            [
                'name'        => 'Executive Smart-Casual',
                'description' => 'Gaya profesional modern yang memadukan kerapian dan kenyamanan.',
                'image_url'   => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop&auto=format&q=80',
            ],
            [
                'name'        => 'Premium Denim & Street Culture',
                'description' => 'Koleksi denim berkualitas tinggi dengan karakter urban yang kuat.',
                'image_url'   => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop&auto=format&q=80',
            ],
            [
                'name'        => 'Graceful Feminine Silhouettes',
                'description' => 'Sentuhan keanggunan wanita dengan siluet yang modis dan elegan.',
                'image_url'   => 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop&auto=format&q=80',
            ],
            [
                'name'        => 'Ultimate Comfort & Accessories',
                'description' => 'Detail pelengkap gaya dan koleksi pakaian rumah yang relaks.',
                'image_url'   => 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=400&fit=crop&auto=format&q=80',
            ],
        ]);

        return $categories->map(function ($category) {
            $slug  = Str::slug($category['name']);
            $image = $this->downloadImage($category['image_url'], 'category', 'cat-' . $slug);

            return Category::create([
                'name'        => $category['name'],
                'description' => $category['description'],
                'image'       => $image ?? 'default.jpg',
            ]);
        })->keyBy('name');
    }

    private function seedProducts(Collection $categories): Collection
    {
        $products = collect([
            // 1. The Essential Daily Wear
            ['category' => 'The Essential Daily Wear', 'barcode' => 'ESS-0001', 'title' => 'Signature Cotton Tee 30s', 'description' => 'Definisi kenyamanan sejati dengan serat kapas pilihan yang menyerap keringat 2x lebih baik.', 'buy_price' => 45000, 'sell_price' => 85000, 'stock' => 50, 'image_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'The Essential Daily Wear', 'barcode' => 'ESS-0002', 'title' => 'Urban Oversize Heavyweight', 'description' => 'Kaos gramasi 24s tebal untuk tampilan streetwear yang bervolume dan kokoh.', 'buy_price' => 65000, 'sell_price' => 125000, 'stock' => 40, 'image_url' => 'https://images.unsplash.com/photo-1503341504253-dff4f94032fc?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'The Essential Daily Wear', 'barcode' => 'ESS-0003', 'title' => 'Polo Shirt Pique Knit', 'description' => 'Perpaduan sempurna kenyamanan kaos dan kerapian kemeja dengan kerah rajut elastis.', 'buy_price' => 75000, 'sell_price' => 150000, 'stock' => 30, 'image_url' => 'https://images.unsplash.com/photo-1625910513413-5fc421e0fd4f?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'The Essential Daily Wear', 'barcode' => 'ESS-0004', 'title' => 'Seamless Microfiber Tank', 'description' => 'Teknologi tanpa jahitan samping yang memberikan kebebasan gerak total dan lembut di kulit.', 'buy_price' => 25000, 'sell_price' => 55000, 'stock' => 100, 'image_url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=300&fit=crop&auto=format&q=80'],

            // 2. Executive Smart-Casual
            ['category' => 'Executive Smart-Casual', 'barcode' => 'EXE-0001', 'title' => 'Brushed Flanel Heritage', 'description' => 'Kemeja flanel dengan teknik penyikatan ganda untuk tekstur lembut namun tetap maskulin.', 'buy_price' => 110000, 'sell_price' => 195000, 'stock' => 25, 'image_url' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Executive Smart-Casual', 'barcode' => 'EXE-0002', 'title' => 'Oxford Tailored Shirt', 'description' => 'Kain Oxford bertekstur titik khas, memberikan napas pada kulit saat suhu meningkat.', 'buy_price' => 125000, 'sell_price' => 225000, 'stock' => 20, 'image_url' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Executive Smart-Casual', 'barcode' => 'EXE-0003', 'title' => 'Unlined Travel Blazer', 'description' => 'Blazer tanpa furing yang ringan dan tidak mudah kusut, ideal untuk profesional dinamis.', 'buy_price' => 210000, 'sell_price' => 450000, 'stock' => 15, 'image_url' => 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Executive Smart-Casual', 'barcode' => 'EXE-0004', 'title' => 'Chino Flex Twill Pants', 'description' => 'Celana dengan teknologi power-stretch yang mengikuti setiap langkah Anda dengan warna solid.', 'buy_price' => 135000, 'sell_price' => 250000, 'stock' => 30, 'image_url' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=300&fit=crop&auto=format&q=80'],

            // 3. Premium Denim & Street Culture
            ['category' => 'Premium Denim & Street Culture', 'barcode' => 'DNM-0001', 'title' => 'Deep Indigo Selvedge Style', 'description' => 'Denim indigo pekat yang akan menghasilkan fading unik sesuai karakter pemakai.', 'buy_price' => 165000, 'sell_price' => 325000, 'stock' => 20, 'image_url' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Premium Denim & Street Culture', 'barcode' => 'DNM-0002', 'title' => 'Vintage Wash Trucker Jacket', 'description' => 'Jaket denim legendaris dengan aksen beaten-up autentik untuk gaya ikonik sepanjang masa.', 'buy_price' => 185000, 'sell_price' => 365000, 'stock' => 15, 'image_url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Premium Denim & Street Culture', 'barcode' => 'DNM-0003', 'title' => 'Urban Cargo Jogger', 'description' => 'Menggabungkan fungsi saku militer dengan kenyamanan karet pergelangan kaki yang elastis.', 'buy_price' => 95000, 'sell_price' => 185000, 'stock' => 25, 'image_url' => 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Premium Denim & Street Culture', 'barcode' => 'DNM-0004', 'title' => 'Hoodie Urban Street Fleece', 'description' => 'Cotton fleece dengan bagian dalam disikat lembut, memberikan perlindungan maksimal dari angin.', 'buy_price' => 140000, 'sell_price' => 245000, 'stock' => 20, 'image_url' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop&auto=format&q=80'],

            // 4. Graceful Feminine Silhouettes
            ['category' => 'Graceful Feminine Silhouettes', 'barcode' => 'FEM-0001', 'title' => 'Rosetta Plisket Maxi Skirt', 'description' => 'Rok lipatan vertikal simetris yang memberikan ilusi tubuh jenjang dan gerak dramatis.', 'buy_price' => 70000, 'sell_price' => 135000, 'stock' => 35, 'image_url' => 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Graceful Feminine Silhouettes', 'barcode' => 'FEM-0002', 'title' => 'Silk Touch Elegant Blouse', 'description' => 'Atasan kilau lembut dengan V-neck untuk mempertegas garis leher, sempurna untuk kencan.', 'buy_price' => 90000, 'sell_price' => 165000, 'stock' => 25, 'image_url' => 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Graceful Feminine Silhouettes', 'barcode' => 'FEM-0003', 'title' => 'Linen Breeze Highwaist', 'description' => 'Celana lebar linen alami yang sejuk, didesain untuk menyamarkan perut dan gaya santai.', 'buy_price' => 85000, 'sell_price' => 160000, 'stock' => 30, 'image_url' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Graceful Feminine Silhouettes', 'barcode' => 'FEM-0004', 'title' => 'Midnight Satin Slip Dress', 'description' => 'Gaun malam satin mewah yang meluncur lembut di kulit untuk tampilan effortless chic.', 'buy_price' => 125000, 'sell_price' => 235000, 'stock' => 15, 'image_url' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop&auto=format&q=80'],

            // 5. Ultimate Comfort & Accessories
            ['category' => 'Ultimate Comfort & Accessories', 'barcode' => 'ACC-0001', 'title' => 'Midnight Luxury Pajamas Set', 'description' => 'Setelan baju tidur satin dingin yang membantu regulasi suhu tubuh untuk tidur berkualitas.', 'buy_price' => 120000, 'sell_price' => 210000, 'stock' => 20, 'image_url' => 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Ultimate Comfort & Accessories', 'barcode' => 'ACC-0002', 'title' => 'Heritage Canvas Baseball Cap', 'description' => 'Topi kanvas tebal dengan pengatur ukuran kuningan untuk meningkatkan level gaya kasual.', 'buy_price' => 35000, 'sell_price' => 80000, 'stock' => 50, 'image_url' => 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Ultimate Comfort & Accessories', 'barcode' => 'ACC-0003', 'title' => 'Heavy-Duty Canvas Tote', 'description' => 'Tas jinjing minimalis yang kuat menampung beban laptop dan buku dengan jahitan penguat.', 'buy_price' => 45000, 'sell_price' => 95000, 'stock' => 40, 'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&auto=format&q=80'],
            ['category' => 'Ultimate Comfort & Accessories', 'barcode' => 'ACC-0004', 'title' => 'Abstract Art Combed Socks', 'description' => 'Kaos kaki seni dari benang katun rajut empuk untuk melindungi tumit dan memberi aksen warna.', 'buy_price' => 15000, 'sell_price' => 30000, 'stock' => 100, 'image_url' => 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=300&h=300&fit=crop&auto=format&q=80'],
        ]);

        return $products->map(function ($product) use ($categories) {
            $category = $categories->get($product['category']);
            $slug  = Str::slug($product['title']);
            $image = $this->downloadImage($product['image_url'], 'products', 'prod-' . $slug);

            return Product::create([
                'category_id' => $category?->id,
                'image'       => $image ?? 'default.jpg',
                'barcode'     => $product['barcode'],
                'title'       => $product['title'],
                'description' => $product['description'],
                'buy_price'   => $product['buy_price'],
                'sell_price'  => $product['sell_price'],
                'stock'       => $product['stock'],
            ]);
        })->keyBy('barcode');
    }
}