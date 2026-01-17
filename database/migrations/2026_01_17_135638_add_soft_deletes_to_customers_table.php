<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $blueprint) {
            // Menambahkan kolom deleted_at
            $blueprint->softDeletes(); 
        });
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $blueprint) {
            // Menghapus kolom deleted_at jika migrasi di-rollback
            $blueprint->dropSoftDeletes();
        });
    }
};