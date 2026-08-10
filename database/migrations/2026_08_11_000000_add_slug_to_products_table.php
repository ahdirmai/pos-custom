<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('title');
        });

        // Backfill slugs for existing products
        \Illuminate\Support\Facades\DB::table('products')->orderBy('id')->each(function ($product) {
            $slug = Str::slug($product->title);
            $baseSlug = $slug;
            $counter = 1;
            while (\Illuminate\Support\Facades\DB::table('products')->where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            \Illuminate\Support\Facades\DB::table('products')->where('id', $product->id)->update(['slug' => $slug]);
        });

        // Add unique index after backfill
        Schema::table('products', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
