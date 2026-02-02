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
        Schema::table('transactions', function (Blueprint $table) {
            // Change cashier_id to nullable for online orders
            $table->unsignedBigInteger('cashier_id')->nullable()->change();

            // Add order_status
            $table->enum('order_status', ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'])
                  ->default('pending')
                  ->after('invoice');

            // Add shipping info
            $table->text('shipping_address')->nullable()->after('shipping_method');
            $table->string('shipping_courier')->nullable()->after('shipping_address');
            $table->string('tracking_number')->nullable()->after('shipping_courier');
            $table->decimal('shipping_cost', 15, 2)->default(0)->change(); // Ensure decimal

            // Add voucher_id
            $table->unsignedBigInteger('voucher_id')->nullable()->after('customer_id');
            $table->foreign('voucher_id')->references('id')->on('vouchers')->onDelete('set null');
            
            // Add snap_token for midtrans
            $table->string('snap_token')->nullable()->after('grand_total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Revert cashier_id to not null (might fail if there are nulls, but standard rollback)
            // $table->unsignedBigInteger('cashier_id')->nullable(false)->change(); 
            // Commented out to prevent rollback error if data exists, but ideally should be handled.
            
            $table->dropForeign(['voucher_id']);
            $table->dropColumn(['order_status', 'shipping_address', 'shipping_courier', 'tracking_number', 'voucher_id', 'snap_token']);
        });
    }
};
