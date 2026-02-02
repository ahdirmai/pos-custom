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
        Schema::create('customer_has_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Ensure unique pairing to avoid duplicates
            // A customer can have multiple accounts? Probably not. 
            // A user can belong to multiple customers? Probably not.
            // Let's assume One-to-One mostly, but table name implies flexibility.
            // But usually 1 Customer Profile = 1 User Account.
            // I'll add unique constraint on both just to be safe for 1-to-1 mapping, 
            // OR unique on user_id (one user can only be linked to one customer)
            // AND unique on customer_id (one customer can only have one user account).
            
            // Re-reading request: "customer has account".
            // I will just index them for now. 
            // Unique constraint on user_id seems logical (account belongs to one customer).
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_has_accounts');
    }
};
