<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class CustomerRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create customer role
        $role = Role::firstOrCreate(['name' => 'customer']);

        // Assign basic permissions if necessary
        // For now, we assume customers rely on 'customer' role check 
        // or authenticated user checks rather than specific granular permissions 
        // like 'dashboard-access' which seem admin-centric.
        
        // If specific permissions are needed later, they can be synced here:
        // $permissions = Permission::whereIn('name', ['some-permission'])->get();
        // $role->syncPermissions($permissions);
    }
}
