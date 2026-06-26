<?php

namespace Tests\Feature\Stock;

use App\Imports\StockBatchImport;
use App\Models\Product;
use App\Models\StockBatch;
use App\Services\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StockImportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::findOrCreate('super-admin', 'web');
    }

    private function csv(string $body): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'stk').'.csv';
        file_put_contents($path, $body);

        return new UploadedFile($path, 'import.csv', 'text/csv', null, true);
    }

    public function test_import_creates_batches_matched_by_barcode(): void
    {
        $product = Product::factory()->create(['barcode' => '8990000000001', 'stock' => 0]);

        $file = $this->csv(
            "barcode,qty,buy_price,received_date,expired_date,note\n".
            "8990000000001,20,5000,2026-06-26,2027-01-01,batch a\n"
        );

        $import = new StockBatchImport(app(StockService::class));
        Excel::import($import, $file);

        $this->assertEmpty($import->errors);
        $this->assertSame(1, $import->imported);
        $this->assertSame(20, (int) $product->fresh()->stock);
        $this->assertDatabaseHas('stock_batches', ['product_id' => $product->id, 'qty_in' => 20]);
    }

    public function test_import_aborts_entirely_when_a_barcode_is_unknown(): void
    {
        $product = Product::factory()->create(['barcode' => '8990000000001', 'stock' => 0]);

        $file = $this->csv(
            "barcode,qty,buy_price,received_date,expired_date,note\n".
            "8990000000001,20,5000,2026-06-26,,\n".
            "0000000000000,5,1000,2026-06-26,,\n"
        );

        $import = new StockBatchImport(app(StockService::class));
        Excel::import($import, $file);

        $this->assertNotEmpty($import->errors);
        $this->assertSame(0, (int) $product->fresh()->stock);
        $this->assertSame(0, StockBatch::count());
    }
}
