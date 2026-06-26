<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\StockBatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockBatch>
 */
class StockBatchFactory extends Factory
{
    protected $model = StockBatch::class;

    public function definition(): array
    {
        $qty = fake()->numberBetween(10, 100);
        $received = fake()->dateTimeBetween('-60 days', 'now');

        return [
            'product_id' => Product::factory(),
            'batch_code' => 'BATCH-'.fake()->unique()->numerify('########'),
            'qty_in' => $qty,
            'qty_remaining' => $qty,
            'buy_price' => fake()->numberBetween(1000, 50000),
            'received_date' => $received,
            'expired_date' => null,
            'note' => null,
            'user_id' => null,
        ];
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'expired_date' => now()->subDays(fake()->numberBetween(1, 30))->toDateString(),
        ]);
    }

    public function nearExpiry(int $days = 10): static
    {
        return $this->state(fn () => [
            'expired_date' => now()->addDays($days)->toDateString(),
        ]);
    }
}
