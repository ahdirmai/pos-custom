<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionShippingDetail extends Model
{
    protected $fillable = [
        'transaction_id',
        'recipient_name',
        'phone_number',
        'address',
        'province_code',
        'province_name',
        'city_code',
        'city_name',
        'district_code',
        'district_name',
        'village_code',
        'village_name',
        'postal_code',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
