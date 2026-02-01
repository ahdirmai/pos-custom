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
        Schema::table('carts', function (Blueprint $table) {
            $table->unsignedBigInteger('cashier_id')->nullable()->change();
            $table->unsignedBigInteger('user_id')->nullable()->after('cashier_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            // $table->unsignedBigInteger('cashier_id')->nullable(false)->change();
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
