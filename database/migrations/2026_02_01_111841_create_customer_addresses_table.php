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
        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('label')->nullable(); // e.g., "Home", "Office"
            $table->string('recipient_name');
            $table->string('phone_number');
            $table->text('address');
            $table->char('province_code', 2); // Laravolt province code
            $table->char('city_code', 4); // Laravolt city code
            $table->char('district_code', 7); // Laravolt district code
            $table->char('village_code', 10); // Laravolt village code
            $table->string('postal_code', 5);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            
            $table->index(['user_id', 'is_primary']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_addresses');
    }
};
