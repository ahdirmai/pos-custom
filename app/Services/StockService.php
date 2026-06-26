<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Product;
use App\Models\StockBatch;
use App\Models\StockMovement;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class StockService
{
    /**
     * Record multiple stock-in entries in a single transaction.
     * Each row: ['product_id' => int, 'qty' => int, 'buy_price' => int, 'received_date' => ?string, 'expired_date' => ?string, 'note' => ?string].
     * All-or-nothing: any failure rolls back every row.
     *
     * @param  array<int,array<string,mixed>>  $rows
     * @return int number of batches created
     */
    public function bulkStockIn(array $rows): int
    {
        return DB::transaction(function () use ($rows) {
            $count = 0;
            foreach ($rows as $row) {
                $product = $row['product'] ?? Product::findOrFail($row['product_id']);
                $this->stockIn($product, [
                    'qty' => (int) $row['qty'],
                    'buy_price' => isset($row['buy_price']) ? (int) $row['buy_price'] : null,
                    'received_date' => $row['received_date'] ?? null,
                    'expired_date' => $row['expired_date'] ?? null,
                    'batch_code' => $row['batch_code'] ?? null,
                    'note' => $row['note'] ?? null,
                ]);
                $count++;
            }

            return $count;
        });
    }

    /**
     * Record incoming stock as a new batch and a matching ledger movement.
     *
     * @param  array{qty:int,buy_price?:int|null,received_date?:string|null,expired_date?:string|null,batch_code?:string|null,note?:string|null,reference_type?:string,reference_id?:int|null}  $data
     */
    public function stockIn(Product $product, array $data): StockBatch
    {
        return DB::transaction(function () use ($product, $data) {
            $qty = (int) $data['qty'];
            $received = isset($data['received_date'])
                ? Carbon::parse($data['received_date'])
                : now();

            $batch = $product->stockBatches()->create([
                'batch_code' => $data['batch_code'] ?? $this->generateBatchCode($product, $received),
                'qty_in' => $qty,
                'qty_remaining' => $qty,
                'buy_price' => (int) ($data['buy_price'] ?? $product->buy_price),
                'received_date' => $received->toDateString(),
                'expired_date' => $data['expired_date'] ?? null,
                'note' => $data['note'] ?? null,
                'user_id' => auth()->id(),
            ]);

            $before = (int) $product->stock;
            $this->syncProductStock($product);

            StockMovement::create([
                'product_id' => $product->id,
                'stock_batch_id' => $batch->id,
                'type' => 'in',
                'reference_type' => $data['reference_type'] ?? 'stock_in',
                'reference_id' => $data['reference_id'] ?? $batch->id,
                'qty' => $qty,
                'qty_before' => $before,
                'qty_after' => (int) $product->fresh()->stock,
                'note' => $data['note'] ?? null,
                'user_id' => auth()->id(),
            ]);

            return $batch;
        });
    }

    /**
     * Consume stock FIFO across non-expired batches (oldest received first).
     *
     * @throws InsufficientStockException
     */
    public function consumeFifo(Product $product, int $qty, string $referenceType, ?int $referenceId = null): void
    {
        if ($qty <= 0) {
            return;
        }

        DB::transaction(function () use ($product, $qty, $referenceType, $referenceId) {
            $batches = $product->stockBatches()
                ->available()
                ->notExpired()
                ->oldestFirst()
                ->lockForUpdate()
                ->get();

            $totalAvailable = $batches->sum('qty_remaining');
            if ($totalAvailable < $qty) {
                throw new InsufficientStockException(
                    "Stok tidak mencukupi untuk produk '{$product->title}'. Tersedia: {$totalAvailable}, diminta: {$qty}."
                );
            }

            $remaining = $qty;
            $before = (int) $product->stock;

            foreach ($batches as $batch) {
                if ($remaining <= 0) {
                    break;
                }

                $take = min($batch->qty_remaining, $remaining);
                $batch->decrement('qty_remaining', $take);
                $remaining -= $take;

                StockMovement::create([
                    'product_id' => $product->id,
                    'stock_batch_id' => $batch->id,
                    'type' => 'out',
                    'reference_type' => $referenceType,
                    'reference_id' => $referenceId,
                    'qty' => -$take,
                    'note' => null,
                    'user_id' => auth()->id(),
                ]);
            }

            $this->syncProductStock($product);
            $after = (int) $product->fresh()->stock;

            StockMovement::where('product_id', $product->id)
                ->where('reference_type', $referenceType)
                ->when($referenceId !== null, fn ($q) => $q->where('reference_id', $referenceId))
                ->where('type', 'out')
                ->whereNull('qty_before')
                ->latest('id')
                ->limit(1)
                ->update(['qty_before' => $before, 'qty_after' => $after]);
        });
    }

    /**
     * Manual stock opname / write-off: set a batch's remaining qty to a new value.
     */
    public function adjust(Product $product, StockBatch $batch, int $newQtyRemaining, string $reason, ?string $note = null): void
    {
        DB::transaction(function () use ($product, $batch, $newQtyRemaining, $reason, $note) {
            $newQtyRemaining = max(0, $newQtyRemaining);
            $delta = $newQtyRemaining - (int) $batch->qty_remaining;

            if ($delta === 0) {
                return;
            }

            $before = (int) $product->stock;
            $batch->update(['qty_remaining' => $newQtyRemaining]);
            $this->syncProductStock($product);

            StockMovement::create([
                'product_id' => $product->id,
                'stock_batch_id' => $batch->id,
                'type' => 'adjustment',
                'reference_type' => $reason,
                'reference_id' => $batch->id,
                'qty' => $delta,
                'qty_before' => $before,
                'qty_after' => (int) $product->fresh()->stock,
                'note' => $note,
                'user_id' => auth()->id(),
            ]);
        });
    }

    /**
     * Sync the cached products.stock column to the sum of remaining batch quantity.
     */
    public function syncProductStock(Product $product): void
    {
        $sum = (int) $product->stockBatches()->sum('qty_remaining');
        $product->forceFill(['stock' => $sum])->saveQuietly();
    }

    private function generateBatchCode(Product $product, Carbon $date): string
    {
        $seq = $product->stockBatches()
            ->whereDate('received_date', $date->toDateString())
            ->count() + 1;

        return 'BATCH-'.$date->format('Ymd').'-'.str_pad((string) $seq, 3, '0', STR_PAD_LEFT);
    }
}
