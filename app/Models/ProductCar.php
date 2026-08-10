<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCar extends Model
{
    use HasFactory;

    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'product_id',
        'subtitle',
        'highlight_specs',
        'specs',
        'gallery',
        'price_max',
        'price_note',
        'is_featured',
        'cta_whatsapp_message',
    ];

    /**
     * casts
     *
     * @var array
     */
    protected $casts = [
        'highlight_specs' => 'array',
        'specs' => 'array',
        'gallery' => 'array',
        'is_featured' => 'boolean',
    ];

    /**
     * product
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Human readable price range label, e.g. "Rp299–389 jutaan".
     */
    protected function priceRangeLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                $min = (int) ($this->product?->sell_price ?? 0);
                $max = (int) ($this->price_max ?? 0);

                $format = fn (int $value) => number_format($value / 1_000_000, 0, ',', '.');

                if ($min <= 0) {
                    return null;
                }

                if ($max > $min) {
                    return "Rp{$format($min)}–{$format($max)} jutaan";
                }

                return "Rp{$format($min)} jutaan";
            },
        );
    }
}
