<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductDetail extends Model
{
    protected $fillable = [
        'product_id',
        'weight',
        'length',
        'width',
        'height',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
