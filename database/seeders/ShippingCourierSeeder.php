<?php

namespace Database\Seeders;

use App\Models\ShippingCourier;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShippingCourierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $couriers = [
            ['code' => 'gojek', 'name' => 'Gojek'],
            ['code' => 'grab', 'name' => 'Grab'],
            ['code' => 'deliveree', 'name' => 'Deliveree'],
            ['code' => 'jne', 'name' => 'JNE'],
            ['code' => 'tiki', 'name' => 'TIKI'],
            ['code' => 'ninja', 'name' => 'Ninja Xpress'],
            ['code' => 'lion', 'name' => 'Lion Parcel'],
            ['code' => 'rara', 'name' => 'RaRa Delivery'],
            ['code' => 'sicepat', 'name' => 'SiCepat'],
            ['code' => 'jnt', 'name' => 'J&T Express'],
            ['code' => 'idexpress', 'name' => 'IDExpress'],
            ['code' => 'rpx', 'name' => 'RPX'],
            ['code' => 'jdl', 'name' => 'JDL Express'],
            ['code' => 'wahana', 'name' => 'Wahana'],
            ['code' => 'pos', 'name' => 'POS Indonesia'],
            ['code' => 'anteraja', 'name' => 'AnterAja'],
            ['code' => 'sap', 'name' => 'SAP Express'],
            ['code' => 'paxel', 'name' => 'Paxel'],
            ['code' => 'borzo', 'name' => 'Borzo'],
            ['code' => 'lalamove', 'name' => 'Lalamove'],
            ['code' => 'sentralcargo', 'name' => 'Sentral Cargo'],
            ['code' => 'dash_express', 'name' => 'Dash Express'],
        ];

        foreach ($couriers as $courier) {
            ShippingCourier::firstOrCreate(
                ['code' => $courier['code']],
                ['name' => $courier['name'], 'is_active' => true]
            );
        }
    }
}
