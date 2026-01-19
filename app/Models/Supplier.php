<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'bank_name',
        'account_number',
        'account_name',
    ];

    /**
     * payables
     *
     * @return void
     */
    public function payables()
    {
        return $this->hasMany(Payable::class);
    }
}
