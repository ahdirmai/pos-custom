<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $create = fn ($name) => Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);

        // dashboard permissions
        $create('dashboard-access');

        // users permissions
        $create('users-access');
        $create('users-create');
        $create('users-update');
        $create('users-delete');

        // roles permissions
        $create('roles-access');
        $create('roles-create');
        $create('roles-update');
        $create('roles-delete');

        // permissions permissions
        $create('permissions-access');
        $create('permissions-create');
        $create('permissions-update');
        $create('permissions-delete');

        // permission categories
        $create('categories-access');
        $create('categories-create');
        $create('categories-edit');
        $create('categories-delete');

        // permission products
        $create('products-access');
        $create('products-create');
        $create('products-edit');
        $create('products-delete');

        // permission customers
        $create('customers-access');
        $create('customers-create');
        $create('customers-edit');
        $create('customers-delete');

        // permission transactions
        $create('transactions-access');

        // permission receivables & payables
        $create('receivables-access');
        $create('receivables-pay');
        $create('payables-access');
        $create('payables-pay');
        $create('suppliers-access');
        
        // banners permissions
        $create('banners-access');
        $create('banners-create');
        $create('banners-edit');
        $create('banners-delete');

        // permission reports
        $create('reports-access');
        $create('profits-access');

        // payment settings
        $create('payment-settings-access');

        // customer area permissions
        $create('customer-access');
        $create('customer-order-access');
    }
}
