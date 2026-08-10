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
        Schema::create('product_cars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->unique();
            $table->string('subtitle')->nullable();
            $table->json('highlight_specs')->nullable();
            $table->json('specs')->nullable();
            $table->json('gallery')->nullable();
            $table->bigInteger('price_max')->nullable();
            $table->string('price_note')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('cta_whatsapp_message')->nullable();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_cars');
    }
};
