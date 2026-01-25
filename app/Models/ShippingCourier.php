<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class ShippingCourier extends Model
{
    protected $fillable = [
        'code',
        'name',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * image
     */
    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? asset('/storage/'.$value) : null,
        );
    }
}
