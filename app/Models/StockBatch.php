<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'batch_code',
        'qty_in',
        'qty_remaining',
        'buy_price',
        'received_date',
        'expired_date',
        'note',
        'user_id',
    ];

    protected $casts = [
        'received_date' => 'date',
        'expired_date' => 'date',
        'qty_in' => 'integer',
        'qty_remaining' => 'integer',
        'buy_price' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('qty_remaining', '>', 0);
    }

    public function scopeNotExpired(Builder $query): Builder
    {
        return $query->where(function (Builder $q) {
            $q->whereNull('expired_date')
                ->orWhereDate('expired_date', '>=', now()->toDateString());
        });
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->whereNotNull('expired_date')
            ->whereDate('expired_date', '<', now()->toDateString());
    }

    public function scopeNearExpiry(Builder $query, int $days = 30): Builder
    {
        return $query->whereNotNull('expired_date')
            ->whereDate('expired_date', '>=', now()->toDateString())
            ->whereDate('expired_date', '<=', now()->addDays($days)->toDateString());
    }

    public function scopeOldestFirst(Builder $query): Builder
    {
        return $query->orderBy('received_date')->orderBy('id');
    }
}
