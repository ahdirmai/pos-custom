<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionShipping extends Model
{
    protected $fillable = [
        'transaction_id',
        'shipping_courier_code',
        'shipping_courier_service',
        'shipping_cost',
        'biteship_order_id',
        'waybill_number',
        'shipping_status',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}
