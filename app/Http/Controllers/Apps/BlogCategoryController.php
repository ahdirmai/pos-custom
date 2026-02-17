<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BlogCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //get categories
        $categories = BlogCategory::when(request()->q, function($categories) {
            $categories = $categories->where('name', 'like', '%'. request()->q . '%');
        })->latest()->paginate(5);

        //return inertia
        return Inertia::render('Dashboard/BlogCategories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Dashboard/BlogCategories/Create');
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
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2000',
            'name'  => 'required|unique:blog_categories',
        ]);

        $imagePath = null;
        //upload image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->storeAs('public/blog_categories', $image->hashName());
            $imagePath = $image->hashName();
        }

        //create category
        $category = BlogCategory::create([
            'image' => $imagePath,
            'name'  => $request->name,
            'slug'  => Str::slug($request->name, '-'),
            'description' => $request->description
        ]);

        if ($request->wantsJson()) {
            return response()->json($category, 201);
        }

        //redirect
        return redirect()->route('apps.blog-categories.index');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(BlogCategory $blogCategory)
    {
        return Inertia::render('Dashboard/BlogCategories/Edit', [
            'category' => $blogCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BlogCategory $blogCategory)
    {
        //validate request
        $request->validate([
            'name'  => 'required|unique:blog_categories,name,'.$blogCategory->id,
        ]);

        //check image update
        if ($request->file('image')) {

            //remove old image
            if($blogCategory->image) {
                Storage::disk('local')->delete('public/blog_categories/'.basename($blogCategory->image));
            }

            //upload new image
            $image = $request->file('image');
            $image->storeAs('public/blog_categories', $image->hashName());

            //update category with new image
            $blogCategory->update([
                'image' => $image->hashName(),
                'name'  => $request->name,
                'slug'  => Str::slug($request->name, '-'),
                'description' => $request->description
            ]);

        } else {
            //update category without image
            $blogCategory->update([
                'name'  => $request->name,
                'slug'  => Str::slug($request->name, '-'),
                'description' => $request->description
            ]);
        }

        //redirect
        return redirect()->route('apps.blog-categories.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $blogCategory = BlogCategory::findOrFail($id);
        
        //remove image
        if($blogCategory->image) {
            Storage::disk('local')->delete('public/blog_categories/'.basename($blogCategory->image));
        }

        //delete category
        $blogCategory->delete();

        //redirect
        return redirect()->route('apps.blog-categories.index');
    }
}
