<?php

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCar;
use App\Models\StockBatch;
use App\Models\Transaction;
use App\Models\User;
use App\Services\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * End-to-end checkout tests for car products.
 *
 * Verifies that car products (seeded via ProductCar relation) go through
 * the normal cart → checkout flow unchanged — no modifications were made
 * to CartController, CheckoutController, or StockService.
 */
class CarCheckoutTest extends TestCase
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

    private function makeUser(): User
    {
        return User::factory()->create();
    }

    private function makeCarProduct(int $stock = 5): Product
    {
        $category = Category::create([
            "name" => "MPV / Fleet",
            "description" => "Cat",
            "image" => "cat.jpg",
        ]);

        $product = Product::create([
            "category_id" => $category->id,
            "image" => "car.jpg",
            "barcode" => "CHK-" . Str::upper(Str::random(6)),
            "sku" => "CHK-SKU",
            "title" => "VinFast Limo Green",
            "description" => "Test car",
            "buy_price" => 250_000_000,
            "sell_price" => 299_000_000,
            "is_pph23" => false,
            "stock" => $stock,
        ]);

        // Attach car showcase data
        ProductCar::create([
            "product_id" => $product->id,
            "subtitle" => "MPV Listrik 7-Seater",
            "highlight_specs" => [],
            "specs" => [],
            "gallery" => [],
            "price_max" => 389_000_000,
            "price_note" => "OTR promo",
            "is_featured" => true,
            "cta_whatsapp_message" => "Tertarik Limo Green.",
        ]);

        // Create stock batch so FIFO checkout works
        app(StockService::class)->stockIn($product, [
            "qty" => $stock,
            "buy_price" => 250_000_000,
        ]);

        return $product->fresh();
    }

    /** Minimal valid checkout payload (no real shipping provider needed). */
    private function checkoutPayload(array $overrides = []): array
    {
        return array_merge(
            [
                "recipient_name" => "Budi Test",
                "phone_number" => "08123456789",
                "address" => "Jl. EV No. 1, Jakarta",
                "province_code" => "31",
                "city_code" => "3171",
                "district_code" => "317101",
                "village_code" => "3171010001",
                "postal_code" => "10110",
                "shipping_courier" => "jne",
                "shipping_service" => "REG",
                "shipping_cost" => 0,
                "voucher_codes" => [],
            ],
            $overrides,
        );
    }

    // -------------------------------------------------------------------------
    // Cart tests
    // -------------------------------------------------------------------------

    public function test_authenticated_user_can_add_car_product_to_cart(): void
    {
        $user = $this->makeUser();
        $product = $this->makeCarProduct();

        $response = $this->actingAs($user)->post(route("user.cart.store"), [
            "product_id" => $product->id,
            "qty" => 1,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas("carts", [
            "user_id" => $user->id,
            "product_id" => $product->id,
            "qty" => 1,
        ]);
    }

    public function test_cart_add_fails_when_stock_insufficient(): void
    {
        $user = $this->makeUser();
        $product = $this->makeCarProduct(stock: 2);

        $response = $this->actingAs($user)->post(route("user.cart.store"), [
            "product_id" => $product->id,
            "qty" => 10, // exceeds stock
        ]);

        $response->assertRedirect();
        $response->assertSessionHas("error");
        $this->assertDatabaseMissing("carts", [
            "user_id" => $user->id,
            "product_id" => $product->id,
        ]);
    }

    // -------------------------------------------------------------------------
    // Checkout — transaction creation
    // -------------------------------------------------------------------------

    public function test_checkout_creates_transaction_for_car_product(): void
    {
        $user = $this->makeUser();
        $product = $this->makeCarProduct(stock: 5);

        // Manually add to cart (mirrors CartController@store)
        $cart = Cart::create([
            "user_id" => $user->id,
            "cashier_id" => null,
            "product_id" => $product->id,
            "qty" => 1,
            "price" => $product->sell_price,
        ]);

        $response = $this->actingAs($user)->post(
            route("user.checkout.store"),
            $this->checkoutPayload(),
        );

        // Should redirect to invoice page
        $response->assertRedirect();

        $transaction = Transaction::where("user_id", $user->id)->latest("id")->first();
        $this->assertNotNull($transaction, "Transaction should be created after checkout.");
        $this->assertSame("pending", $transaction->order_status);
        $this->assertSame("pending", $transaction->payment_status);
        $this->assertSame("manual_transfer", $transaction->payment_method);
        $this->assertStringStartsWith("TRX-", $transaction->invoice);
    }

    public function test_checkout_creates_transaction_detail_for_car_product(): void
    {
        $user = $this->makeUser();
        $product = $this->makeCarProduct(stock: 5);

        Cart::create([
            "user_id" => $user->id,
            "cashier_id" => null,
            "product_id" => $product->id,
            "qty" => 2,
            "price" => $product->sell_price,
        ]);

        $this->actingAs($user)->post(route("user.checkout.store"), $this->checkoutPayload());

        $transaction = Transaction::where("user_id", $user->id)->latest("id")->first();
        $this->assertNotNull($transaction);

        $detail = $transaction->details()->first();
        $this->assertNotNull($detail, "TransactionDetail should exist.");
        $this->assertSame($product->id, $detail->product_id);
        $this->assertSame(2, (int) $detail->qty);
    }

    public function test_checkout_decrements_stock_batch_via_fifo(): void
    {
        $user = $this->makeUser();
        $product = $this->makeCarProduct(stock: 5);

        $batchBefore = StockBatch::where("product_id", $product->id)->first();
        $this->assertNotNull($batchBefore);
        $qtyBefore = $batchBefore->qty_remaining;

        Cart::create([
            "user_id" => $user->id,
            "cashier_id" => null,
            "product_id" => $product->id,
            "qty" => 2,
            "price" => $product->sell_price,
        ]);

        $this->actingAs($user)->post(route("user.checkout.store"), $this->checkoutPayload());

        $batchAfter = $batchBefore->fresh();
        $this->assertSame($qtyBefore - 2, (int) $batchAfter->qty_remaining);
    }

    public function test_checkout_clears_cart_after_order(): void
    {
        $user = $this->makeUser();
        $product = $this->makeCarProduct(stock: 5);

        $cart = Cart::create([
            "user_id" => $user->id,
            "cashier_id" => null,
            "product_id" => $product->id,
            "qty" => 1,
            "price" => $product->sell_price,
        ]);

        $this->actingAs($user)->post(route("user.checkout.store"), $this->checkoutPayload());

        $this->assertDatabaseMissing("carts", ["id" => $cart->id]);
    }

    public function test_checkout_fails_when_cart_is_empty(): void
    {
        $user = $this->makeUser();

        $response = $this->actingAs($user)->post(
            route("user.checkout.store"),
            $this->checkoutPayload(),
        );

        // Should redirect back with error (cart empty)
        $response->assertRedirect();
        $this->assertDatabaseCount("transactions", 0);
    }

    public function test_checkout_requires_authentication(): void
    {
        $response = $this->post(route("user.checkout.store"), $this->checkoutPayload());

        // Guest should be redirected to login
        $response->assertRedirect(route("login"));
    }
}
