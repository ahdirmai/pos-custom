<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create one opening batch per existing product that has stock but no batch yet.
     * Idempotent: products that already own a batch are skipped.
     */
    public function up(): void
    {
        $now = now();

        $products = DB::table('products')
            ->whereNull('deleted_at')
            ->where('stock', '>', 0)
            ->whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('stock_batches')
                    ->whereColumn('stock_batches.product_id', 'products.id');
            })
            ->get(['id', 'stock', 'buy_price']);

        foreach ($products as $product) {
            $batchId = DB::table('stock_batches')->insertGetId([
                'product_id' => $product->id,
                'batch_code' => 'BATCH-MIGRATION-'.$product->id,
                'qty_in' => $product->stock,
                'qty_remaining' => $product->stock,
                'buy_price' => $product->buy_price,
                'received_date' => $now->toDateString(),
                'expired_date' => null,
                'note' => 'Saldo awal hasil migrasi sistem batch',
                'user_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('stock_movements')->insert([
                'product_id' => $product->id,
                'stock_batch_id' => $batchId,
                'type' => 'in',
                'reference_type' => 'migration',
                'reference_id' => $batchId,
                'qty' => $product->stock,
                'qty_before' => 0,
                'qty_after' => $product->stock,
                'note' => 'Backfill saldo awal',
                'user_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        $batchIds = DB::table('stock_batches')
            ->where('batch_code', 'like', 'BATCH-MIGRATION-%')
            ->pluck('id');

        DB::table('stock_movements')
            ->where('reference_type', 'migration')
            ->whereIn('stock_batch_id', $batchIds)
            ->delete();

        DB::table('stock_batches')
            ->whereIn('id', $batchIds)
            ->delete();
    }
};
