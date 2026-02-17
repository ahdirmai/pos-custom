<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banners = Banner::latest()->paginate(10);

        return Inertia::render('Dashboard/Banners/Index', [
            'banners' => $banners,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Dashboard/Banners/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png|max:2048',
            'type' => 'required|in:hero,promo',
            'order' => 'required|integer',
        ]);

        // upload image
        $image = $request->file('image');
        $image->storeAs('public/banners', $image->hashName());

        Banner::create([
            'image' => $image->hashName(),
            'type' => $request->type,
            'title' => $request->title,
            'subtitle' => $request->subtitle,
            'link' => $request->link,
            'order' => $request->order,
            'is_active' => $request->is_active ?? true,
        ]);

        return to_route('banners.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner)
    {
        return Inertia::render('Dashboard/Banners/Edit', [
            'banner' => $banner,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'type' => 'required|in:hero,promo',
            'order' => 'required|integer',
        ]);

        // check image update
        if ($request->file('image')) {

            // remove old image
            Storage::disk('local')->delete('public/banners/'.basename($banner->image));

            // upload new image
            $image = $request->file('image');
            $image->storeAs('public/banners', $image->hashName());

            $banner->update([
                'image' => $image->hashName(),
                'type' => $request->type,
                'title' => $request->title,
                'subtitle' => $request->subtitle,
                'link' => $request->link,
                'order' => $request->order,
                'is_active' => $request->is_active ?? true,
            ]);
        } else {
            $banner->update([
                'type' => $request->type,
                'title' => $request->title,
                'subtitle' => $request->subtitle,
                'link' => $request->link,
                'order' => $request->order,
                'is_active' => $request->is_active ?? true,
            ]);
        }

        return to_route('banners.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        // remove image
        Storage::disk('local')->delete('public/banners/'.basename($banner->image));

        $banner->delete();

        return to_route('banners.index');
    }
}
