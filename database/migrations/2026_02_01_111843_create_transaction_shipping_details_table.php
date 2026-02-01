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
        Schema::create('transaction_shipping_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
            $table->string('recipient_name');
            $table->string('phone_number');
            $table->text('address');
            $table->char('province_code', 2);
            $table->string('province_name');
            $table->char('city_code', 4);
            $table->string('city_name');
            $table->char('district_code', 7);
            $table->string('district_name');
            $table->char('village_code', 10);
            $table->string('village_name');
            $table->string('postal_code', 5);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_shipping_details');
    }
};
