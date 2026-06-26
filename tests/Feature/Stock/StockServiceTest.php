<?php

namespace Tests\Feature\Stock;

use App\Exceptions\InsufficientStockException;
use App\Models\Product;
use App\Models\StockBatch;
use App\Models\StockMovement;
use App\Services\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StockServiceTest extends TestCase
{
    use RefreshDatabase;

    private StockService $service;

    protected function setUp(): void
    {
        parent::setUp();
        Role::findOrCreate('super-admin', 'web');
        $this->service = app(StockService::class);
    }

    public function test_stock_in_creates_batch_movement_and_syncs_product_stock(): void
    {
        $product = Product::factory()->create(['stock' => 0]);

        $batch = $this->service->stockIn($product, [
            'qty' => 25,
            'buy_price' => 5000,
        ]);

        $this->assertSame(25, $batch->qty_in);
        $this->assertSame(25, $batch->qty_remaining);
        $this->assertSame(25, (int) $product->fresh()->stock);
        $this->assertDatabaseHas('stock_movements', [
            'stock_batch_id' => $batch->id,
            'type' => 'in',
            'qty' => 25,
        ]);
    }

    public function test_consume_fifo_drains_oldest_batch_first(): void
    {
        $product = Product::factory()->create(['stock' => 0]);

        $older = StockBatch::factory()->for($product)->create([
            'qty_in' => 10,
            'qty_remaining' => 10,
            'received_date' => now()->subDays(10),
        ]);
        $newer = StockBatch::factory()->for($product)->create([
            'qty_in' => 10,
            'qty_remaining' => 10,
            'received_date' => now()->subDays(2),
        ]);
        $this->service->syncProductStock($product);

        $this->service->consumeFifo($product, 12, 'transaction', 99);

        $this->assertSame(0, (int) $older->fresh()->qty_remaining);
        $this->assertSame(8, (int) $newer->fresh()->qty_remaining);
        $this->assertSame(8, (int) $product->fresh()->stock);
        $this->assertSame(2, StockMovement::where('type', 'out')->count());
    }

    public function test_consume_fifo_throws_when_stock_insufficient(): void
    {
        $product = Product::factory()->create(['stock' => 0]);
        StockBatch::factory()->for($product)->create(['qty_in' => 3, 'qty_remaining' => 3]);
        $this->service->syncProductStock($product);

        $this->expectException(InsufficientStockException::class);
        $this->service->consumeFifo($product, 5, 'transaction', 1);
    }

    public function test_expired_batch_is_not_consumed_and_blocks_sale(): void
    {
        $product = Product::factory()->create(['stock' => 0]);

        $expired = StockBatch::factory()->for($product)->expired()->create([
            'qty_in' => 10,
            'qty_remaining' => 10,
            'received_date' => now()->subDays(20),
        ]);
        $fresh = StockBatch::factory()->for($product)->create([
            'qty_in' => 4,
            'qty_remaining' => 4,
            'received_date' => now()->subDays(1),
        ]);
        $this->service->syncProductStock($product);

        // Only 4 sellable (non-expired) even though total remaining is 14.
        $this->expectException(InsufficientStockException::class);
        try {
            $this->service->consumeFifo($product, 5, 'transaction', 1);
        } finally {
            $this->assertSame(10, (int) $expired->fresh()->qty_remaining);
            $this->assertSame(4, (int) $fresh->fresh()->qty_remaining);
        }
    }

    public function test_bulk_stock_in_creates_multiple_batches_in_one_transaction(): void
    {
        $a = Product::factory()->create(['stock' => 0]);
        $b = Product::factory()->create(['stock' => 0]);

        $count = $this->service->bulkStockIn([
            ['product_id' => $a->id, 'qty' => 10, 'buy_price' => 1000],
            ['product_id' => $b->id, 'qty' => 5, 'buy_price' => 2000],
            ['product' => $a, 'qty' => 3, 'buy_price' => 1500],
        ]);

        $this->assertSame(3, $count);
        $this->assertSame(13, (int) $a->fresh()->stock);
        $this->assertSame(5, (int) $b->fresh()->stock);
        $this->assertSame(3, StockBatch::where('product_id', $a->id)->count() + StockBatch::where('product_id', $b->id)->count());
    }

    public function test_bulk_stock_in_rolls_back_when_a_row_fails(): void
    {
        $a = Product::factory()->create(['stock' => 0]);

        try {
            $this->service->bulkStockIn([
                ['product_id' => $a->id, 'qty' => 10, 'buy_price' => 1000],
                ['product_id' => 999999, 'qty' => 5, 'buy_price' => 2000], // invalid
            ]);
            $this->fail('Expected exception not thrown.');
        } catch (\Throwable) {
            // expected
        }

        $this->assertSame(0, (int) $a->fresh()->stock);
        $this->assertSame(0, StockBatch::count());
    }

    public function test_adjust_changes_remaining_qty_and_logs_adjustment(): void
    {
        $product = Product::factory()->create(['stock' => 0]);
        $batch = StockBatch::factory()->for($product)->create(['qty_in' => 10, 'qty_remaining' => 10]);
        $this->service->syncProductStock($product);

        $this->service->adjust($product, $batch, 6, 'write_off', 'rusak');

        $this->assertSame(6, (int) $batch->fresh()->qty_remaining);
        $this->assertSame(6, (int) $product->fresh()->stock);
        $this->assertDatabaseHas('stock_movements', [
            'stock_batch_id' => $batch->id,
            'type' => 'adjustment',
            'qty' => -4,
            'reference_type' => 'write_off',
        ]);
    }
}
