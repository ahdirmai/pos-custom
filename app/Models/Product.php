<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
     * transactionDetails
     *
     * @return void
     */
    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
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
     * productDetail
     *
     * @return void
     */
    public function productDetail()
    {
        return $this->hasOne(ProductDetail::class);
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
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function flashSaleItems(): HasMany
    {
        return $this->hasMany(FlashSaleProduct::class);
    }

    public function activeFlashSaleItem(): HasOne
    {
        return $this->hasOne(FlashSaleProduct::class)
            ->whereHas('flashSale', function ($query) {
                $query->activeNow();
            });
    }

    public function scopeWithActiveFlashSale(Builder $query): Builder
    {
        $activeFlashSaleProducts = FlashSaleProduct::query()
            ->select('flash_sale_products.product_id', 'flash_sale_products.discount_price')
            ->join('flash_sales', 'flash_sales.id', '=', 'flash_sale_products.flash_sale_id')
            ->where('flash_sales.is_active', true)
            ->where('flash_sales.start_at', '<=', now())
            ->where('flash_sales.end_at', '>=', now());

        return $query
            ->leftJoinSub($activeFlashSaleProducts, 'active_flash_sale_products', function ($join) {
                $join->on('active_flash_sale_products.product_id', '=', 'products.id');
            })
            ->select('products.*')
            ->selectRaw('active_flash_sale_products.discount_price as flash_sale_price');
    }

    protected function currentPrice(): Attribute
    {
        return Attribute::make(
            get: function () {
                $price = $this->attributes['flash_sale_price'] ?? null;

                if ($price !== null) {
                    return (int) $price;
                }

                if ($this->relationLoaded('activeFlashSaleItem') && $this->activeFlashSaleItem) {
                    return (int) $this->activeFlashSaleItem->discount_price;
                }

                return (int) $this->sell_price;
            },
        );
    }

    protected function originalPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => (int) $this->sell_price,
        );
    }

    protected function hasFlashSale(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->current_price < $this->original_price,
        );
    }

    protected function discountPercentage(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (! $this->has_flash_sale || $this->original_price <= 0) {
                    return 0;
                }

                return (int) round((($this->original_price - $this->current_price) / $this->original_price) * 100);
            },
        );
    }
}
