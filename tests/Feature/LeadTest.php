<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Lead;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class LeadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Spatie\Permission\Models\Role::findOrCreate("super-admin", "web");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function makeProduct(): Product
    {
        $category = Category::create([
            "name" => "MPV / Fleet",
            "description" => "Test cat",
            "image" => "cat.jpg",
        ]);

        return Product::create([
            "category_id" => $category->id,
            "image" => "car.jpg",
            "barcode" => "LEAD-" . Str::upper(Str::random(6)),
            "sku" => "LEAD-SKU",
            "title" => "VinFast Limo Green",
            "description" => "Test car",
            "buy_price" => 250_000_000,
            "sell_price" => 299_000_000,
            "is_pph23" => false,
            "stock" => 5,
        ]);
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge(
            [
                "name" => "Budi Santoso",
                "phone" => "08123456789",
                "city" => "Jakarta",
                "notes" => "Ingin test drive hari Sabtu.",
            ],
            $overrides,
        );
    }

    // -------------------------------------------------------------------------
    // Tests — happy path
    // -------------------------------------------------------------------------

    public function test_valid_lead_is_stored_and_redirects_back(): void
    {
        $response = $this->post(route("user.leads.store"), $this->validPayload());

        $response->assertRedirect();
        $this->assertDatabaseHas("leads", [
            "name" => "Budi Santoso",
            "phone" => "08123456789",
            "city" => "Jakarta",
            "source" => "car_landing",
        ]);
        $this->assertSame(1, Lead::count());
    }

    public function test_lead_with_interested_product_id_is_stored(): void
    {
        $product = $this->makeProduct();

        $response = $this->post(
            route("user.leads.store"),
            $this->validPayload([
                "interested_product_id" => $product->id,
            ]),
        );

        $response->assertRedirect();
        $this->assertDatabaseHas("leads", [
            "interested_product_id" => $product->id,
            "source" => "car_landing",
        ]);
    }

    public function test_lead_source_is_always_car_landing(): void
    {
        $this->post(route("user.leads.store"), $this->validPayload());

        $lead = Lead::first();
        $this->assertNotNull($lead);
        $this->assertSame("car_landing", $lead->source);
    }

    public function test_lead_optional_fields_can_be_omitted(): void
    {
        $response = $this->post(route("user.leads.store"), [
            "name" => "Minimal User",
            "phone" => "082211223344",
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas("leads", [
            "name" => "Minimal User",
            "phone" => "082211223344",
            "source" => "car_landing",
        ]);
    }

    // -------------------------------------------------------------------------
    // Tests — validation failures
    // -------------------------------------------------------------------------

    public function test_lead_requires_name(): void
    {
        $response = $this->post(route("user.leads.store"), $this->validPayload(["name" => ""]));

        $response->assertSessionHasErrors("name");
        $this->assertSame(0, Lead::count());
    }

    public function test_lead_requires_phone(): void
    {
        $response = $this->post(route("user.leads.store"), $this->validPayload(["phone" => ""]));

        $response->assertSessionHasErrors("phone");
        $this->assertSame(0, Lead::count());
    }

    public function test_lead_rejects_invalid_interested_product_id(): void
    {
        $response = $this->post(
            route("user.leads.store"),
            $this->validPayload([
                "interested_product_id" => 999999,
            ]),
        );

        $response->assertSessionHasErrors("interested_product_id");
        $this->assertSame(0, Lead::count());
    }

    public function test_lead_name_max_length_enforced(): void
    {
        $response = $this->post(
            route("user.leads.store"),
            $this->validPayload([
                "name" => Str::repeat("a", 101),
            ]),
        );

        $response->assertSessionHasErrors("name");
        $this->assertSame(0, Lead::count());
    }

    public function test_lead_notes_max_length_enforced(): void
    {
        $response = $this->post(
            route("user.leads.store"),
            $this->validPayload([
                "notes" => Str::repeat("x", 501),
            ]),
        );

        $response->assertSessionHasErrors("notes");
        $this->assertSame(0, Lead::count());
    }

    public function test_success_message_flashed_on_valid_lead(): void
    {
        $response = $this->post(route("user.leads.store"), $this->validPayload());

        $response->assertSessionHas("success");
    }
}
