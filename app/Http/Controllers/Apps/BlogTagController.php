<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BlogTagController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //get tags
        $tags = BlogTag::when(request()->q, function($tags) {
            $tags = $tags->where('name', 'like', '%'. request()->q . '%');
        })->latest()->paginate(10);

        //return inertia
        return Inertia::render('Dashboard/BlogTags/Index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('Dashboard/BlogTags/Create');
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
            'name'  => 'required|unique:blog_tags',
        ]);

        //create tag
        $tag = BlogTag::create([
            'name'  => $request->name,
            'slug'  => Str::slug($request->name, '-'),
        ]);

        if ($request->wantsJson()) {
            return response()->json($tag, 201);
        }

        //redirect
        return redirect()->route('apps.blog-tags.index');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(BlogTag $blogTag)
    {
        return Inertia::render('Dashboard/BlogTags/Edit', [
            'tag' => $blogTag,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, BlogTag $blogTag)
    {
        //validate request
        $request->validate([
            'name'  => 'required|unique:blog_tags,name,'.$blogTag->id,
        ]);

        //update tag
        $blogTag->update([
            'name'  => $request->name,
            'slug'  => Str::slug($request->name, '-'),
        ]);

        //redirect
        return redirect()->route('apps.blog-tags.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $blogTag = BlogTag::findOrFail($id);
        $blogTag->delete();

        //redirect
        return redirect()->route('apps.blog-tags.index');
    }
}
