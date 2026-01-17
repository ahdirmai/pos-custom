<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_pph23')->default(false)->after('sell_price');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('npwp', 20)->nullable()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_pph23');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('npwp');
        });
    }
};
