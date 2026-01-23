<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory,SoftDeletes;

    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'image',
        'is_pph23',
        'barcode',
        'sku',
        'title',
        'description',
        'buy_price',
        'sell_price',
        'category_id',
        'stock',
    ];

    /**
     * category
     *
     * @return void
     */
    public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }

    /**
     * image
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => asset('/storage/products/'.$value),
        );
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::saved(function (Product $product) {
            if ($product->stock < 10) {
                app(\App\Services\NotificationService::class)->sendStockAlert($product);
            }
        });
    }
}
