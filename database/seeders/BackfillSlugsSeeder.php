<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BackfillSlugsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = BlogPost::whereNull('slug')->orWhere('slug', '')->get();

        foreach ($posts as $post) {
            $slug = Str::slug($post->title);

            // Ensure uniqueness
            $count = BlogPost::where('slug', $slug)->where('id', '!=', $post->id)->count();
            if ($count > 0) {
                $slug = $slug.'-'.($count + 1);
            }

            $post->update(['slug' => $slug]);
        }

        $this->command->info("Backfilled slugs for {$posts->count()} posts.");
    }
}
