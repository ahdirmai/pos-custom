<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BlogPostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //get posts
        $posts = BlogPost::with(['category', 'user'])->when(request()->q, function($posts) {
            $posts = $posts->where('title', 'like', '%'. request()->q . '%');
        })->latest()->paginate(10);

        //return inertia
        return Inertia::render('Dashboard/BlogPosts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //get categories
        $categories = BlogCategory::all();

        //get tags
        $tags = BlogTag::all();

        return Inertia::render('Dashboard/BlogPosts/Create', [
            'categories' => $categories,
            'tags'       => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //validate request
        $request->validate([
            'image'         => 'required|image|mimes:jpeg,jpg,png|max:2000',
            'title'         => 'required|unique:blog_posts',
            'blog_category_id' => 'required',
            'content'       => 'required',
            'tags'          => 'nullable|array',
        ]);

        //upload image
        $image = $request->file('image');
        $image->storeAs('public/blog_posts', $image->hashName());

        //create post
        $post = BlogPost::create([
            'image'         => $image->hashName(),
            'title'         => $request->title,
            'slug'          => Str::slug($request->title, '-'),
            'blog_category_id' => $request->blog_category_id,
            'user_id'       => auth()->user()->id,
            'excerpt'       => Str::limit(strip_tags($request->content), 150),
            'content'       => $request->content,
            'is_active'     => $request->is_active ?? true,
            'published_at'  => now(),
        ]);

        //assign tags
        if($request->tags) {
            $post->tags()->sync($request->tags);
        }

        //redirect
        return redirect()->route('apps.blog-posts.index');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(BlogPost $blogPost)
    {
        //get categories
        $categories = BlogCategory::all();

        //get tags
        $tags = BlogTag::all();

        $blogPost->load('tags');
        $blogPost->load('category');

        return Inertia::render('Dashboard/BlogPosts/Edit', [
            'post'       => $blogPost,
            'categories' => $categories,
            'tags'       => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BlogPost $blogPost)
    {
        //validate request
        $request->validate([
            'title'         => 'required|unique:blog_posts,title,'.$blogPost->id,
            'blog_category_id' => 'required',
            'content'       => 'required',
            'tags'          => 'nullable|array',
        ]);

        //check image update
        if ($request->file('image')) {

            //remove old image
            if($blogPost->image) {
                Storage::disk('local')->delete('public/blog_posts/'.basename($blogPost->image));
            }

            //upload new image
            $image = $request->file('image');
            $image->storeAs('public/blog_posts', $image->hashName());

            //update post with new image
            $blogPost->update([
                'image'         => $image->hashName(),
                'title'         => $request->title,
                'slug'          => Str::slug($request->title, '-'),
                'blog_category_id' => $request->blog_category_id,
                'excerpt'       => Str::limit(strip_tags($request->content), 150),
                'content'       => $request->content,
                'is_active'     => $request->is_active ?? true,
            ]);

        } else {
            //update post without image
            $blogPost->update([
                'title'         => $request->title,
                'slug'          => Str::slug($request->title, '-'),
                'blog_category_id' => $request->blog_category_id,
                'excerpt'       => Str::limit(strip_tags($request->content), 150),
                'content'       => $request->content,
                'is_active'     => $request->is_active ?? true,
            ]);
        }

        //sync tags
        if($request->tags) {
            $blogPost->tags()->sync($request->tags);
        }

        //redirect
        return redirect()->route('apps.blog-posts.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $blogPost = BlogPost::findOrFail($id);
        
        //remove image
        if($blogPost->image) {
            Storage::disk('local')->delete('public/blog_posts/'.basename($blogPost->image));
        }

        //delete post
        $blogPost->delete();

        //redirect
        return redirect()->route('apps.blog-posts.index');
    }
}
