<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $buy = fake()->numberBetween(1000, 50000);

        return [
            'category_id' => Category::factory(),
            'image' => 'default.png',
            'barcode' => fake()->unique()->ean13(),
            'sku' => fake()->unique()->bothify('SKU-####'),
            'title' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'buy_price' => $buy,
            'sell_price' => $buy + fake()->numberBetween(1000, 20000),
            'is_pph23' => false,
            'stock' => 0,
        ];
    }
}
