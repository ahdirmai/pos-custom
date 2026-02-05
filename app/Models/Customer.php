<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // 1. Import trait

class Customer extends Model
{
    use HasFactory, SoftDeletes; // 2. Gunakan trait;

    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        // 'email',
        'no_telp',
        'address',
        'npwp',
        'province_id',
        'province_name',
        'regency_id',
        'regency_name',
        'district_id',
        'district_name',
        'village_id',
        'village_name',
    ];

    public function voucherUsages()
    {
        return $this->hasMany(VoucherUsage::class);
    }

    public function village()
    {
        return $this->belongsTo(\Laravolt\Indonesia\Models\Village::class, 'village_id', 'code');
    }

    /**
     * Get the user account associated with the customer.
     */
    public function account()
    {
        return $this->hasOneThrough(
            User::class,
            CustomerHasAccount::class,
            'customer_id', // Foreign key on customer_has_accounts table...
            'id', // Foreign key on users table...
            'id', // Local key on customers table...
            'user_id' // Local key on customer_has_accounts table...
        );
    }

    // Or simpler: BelongsToMany (if just a pivot) but acting as 1-to-1
    public function user()
    {
        return $this->belongsToMany(User::class, 'customer_has_accounts', 'customer_id', 'user_id');
    }

    protected function postalCode(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->village?->meta['pos'] ?? null;
            },
        );
    }

    protected function noTelp(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                // 1. Jika awalan 62, ubah menjadi 0
                if (str_starts_with($value, '62')) {
                    return '0' . substr($value, 2);
                }

                // 2. Jika awalan 8 (tidak ada 0 atau 62), tambahkan 0 di depannya
                if (str_starts_with($value, '8')) {
                    return '0' . $value;
                }

                return $value;
            },
        );

    }
}
