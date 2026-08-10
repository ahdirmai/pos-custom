<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    use HasFactory;

    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'phone',
        'city',
        'interested_product_id',
        'source',
        'notes',
    ];

    /**
     * interestedProduct
     */
    public function interestedProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'interested_product_id');
    }
}
