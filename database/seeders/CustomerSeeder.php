<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure customer role exists
        $role = Role::firstOrCreate(['name' => 'customer']);

        $customer = User::create([
            'name' => 'Customer',
            'email' => 'customer@gmail.com',
            'password' => bcrypt('password'),
        ]);

        // Assign customer permissions
        $permissions = \Spatie\Permission\Models\Permission::whereIn('name', [
            'customer-access',
            'customer-order-access',
        ])->get();
        
        $role->syncPermissions($permissions);

        $customer->assignRole($role);
    }
}
