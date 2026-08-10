<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCar;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CarLandingPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Required by Product model boot (NotificationService checks this role)
        \Spatie\Permission\Models\Role::findOrCreate("super-admin", "web");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private int $categorySeq = 0;

    private int $productSeq = 0;

    private function makeCategory(): Category
    {
        $this->categorySeq++;

        return Category::create([
            "name" => "Cat " . $this->categorySeq,
            "description" => "Test category",
            "image" => "cat.jpg",
        ]);
    }

    private function createProductWithCar(bool $isFeatured = false): Product
    {
        $this->productSeq++;
        $category = $this->makeCategory();

        $product = Product::create([
            "category_id" => $category->id,
            "image" => "product.jpg",
            "barcode" => "TEST-" . Str::upper(Str::random(6)) . "-" . $this->productSeq,
            "sku" => "SKU-" . $this->productSeq,
            "title" => "Test Car " . $this->productSeq,
            "description" => "A test car product.",
            "buy_price" => 250_000_000,
            "sell_price" => 299_000_000,
            "is_pph23" => false,
            "stock" => 5,
        ]);

        ProductCar::create([
            "product_id" => $product->id,
            "subtitle" => "Test subtitle " . $this->productSeq,
            "highlight_specs" => [],
            "specs" => [],
            "gallery" => [],
            "price_max" => null,
            "price_note" => null,
            "is_featured" => $isFeatured,
            "cta_whatsapp_message" => "Halo, tertarik dengan produk ini.",
        ]);

        return $product->fresh();
    }

    // -------------------------------------------------------------------------
    // Tests
    // -------------------------------------------------------------------------

    public function test_landing_page_returns_200_and_correct_inertia_component(): void
    {
        $response = $this->get(route("user.index"));

        $response
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component("EndUser/CarLanding/Index"));
    }

    public function test_landing_page_exposes_hero_product(): void
    {
        $this->createProductWithCar(isFeatured: true);

        $response = $this->get(route("user.index"));

        $response
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component("EndUser/CarLanding/Index")
                    ->has("heroProduct")
                    ->where("heroProduct.car.is_featured", true),
            );
    }

    public function test_landing_page_catalog_excludes_hero(): void
    {
        $this->createProductWithCar(isFeatured: true); // hero
        $this->createProductWithCar(isFeatured: false); // catalog item 1
        $this->createProductWithCar(isFeatured: false); // catalog item 2
        $this->createProductWithCar(isFeatured: false); // catalog item 3

        $response = $this->get(route("user.index"));

        $response
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component("EndUser/CarLanding/Index")
                    ->where("heroProduct.car.is_featured", true)
                    ->has("catalog", 3),
            );
    }

    public function test_landing_page_works_without_hero(): void
    {
        // Only non-featured products — heroProduct should be null
        $this->createProductWithCar(isFeatured: false);
        $this->createProductWithCar(isFeatured: false);

        $response = $this->get(route("user.index"));

        $response
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component("EndUser/CarLanding/Index")
                    ->where("heroProduct", null)
                    ->has("catalog", 2),
            );
    }

    public function test_landing_page_exposes_product_categories(): void
    {
        // RefreshDatabase starts with 0 categories; we create 3
        $this->createProductWithCar(); // also creates a Category internally
        $this->createProductWithCar();
        $this->createProductWithCar();

        $response = $this->get(route("user.index"));

        // productCategories = Category::all(), so count must match what we seeded
        $response
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component("EndUser/CarLanding/Index")
                    ->has("productCategories", Category::count()),
            );
    }

    public function test_landing_page_exposes_whatsapp_number(): void
    {
        Setting::set("store_whatsapp", "628999111222", "WA dealer test");

        $response = $this->get(route("user.index"));

        $response
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component("EndUser/CarLanding/Index")
                    ->where("whatsappNumber", "628999111222"),
            );
    }

    public function test_landing_page_exposes_empty_wishlist_when_guest(): void
    {
        $response = $this->get(route("user.index"));

        $response
            ->assertOk()
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component("EndUser/CarLanding/Index")
                    ->where("wishlist_ids", []),
            );
    }
}
