<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // get products
        $products = Product::when(request()->search, function ($products) {
            $products = $products->where('title', 'like', '%'.request()->search.'%');
        })->with('category')->latest()->paginate(12);

        // return inertia
        return Inertia::render('Dashboard/Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // get categories
        $categories = Category::all();

        // return inertia
        return Inertia::render('Dashboard/Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, StockService $stockService)
    {
        /**
         * validate
         */
        $request->validate([
            'barcode' => 'required|unique:products,barcode',
            'sku' => 'nullable',
            'title' => 'required',
            'description' => 'required',
            'category_id' => 'required',
            'buy_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'expired_date' => 'nullable|date',
            'is_pph23' => 'nullable|boolean',
            'weight' => 'required|integer|min:1',
            'length' => 'nullable|integer|min:1',
            'width' => 'nullable|integer|min:1',
            'height' => 'nullable|integer|min:1',
        ]);
        // upload image
        $image = $request->file('image');
        $image->storeAs('public/products', $image->hashName());

        // create product (stock starts at 0; synced from initial batch below)
        $product = Product::create([
            'image' => $image->hashName(),
            'barcode' => $request->barcode,
            'sku' => $request->sku,
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'buy_price' => $request->buy_price,
            'sell_price' => $request->sell_price,
            'stock' => 0,
            'is_pph23' => $request->is_pph23 ?? false,
        ]);

        // create product detail
        $product->productDetail()->create([
            'weight' => $request->weight,
            'length' => $request->length ?? 10,
            'width' => $request->width ?? 10,
            'height' => $request->height ?? 10,
        ]);

        // create initial stock batch when an opening quantity is provided
        if ((int) $request->stock > 0) {
            $stockService->stockIn($product, [
                'qty' => (int) $request->stock,
                'buy_price' => (int) $request->buy_price,
                'expired_date' => $request->expired_date,
                'note' => 'Stok awal produk',
            ]);
        }

        // redirect
        return to_route('products.index');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
        // get categories
        $categories = Category::all();
        // load detail
        $product->load('productDetail');

        return Inertia::render('Dashboard/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        /**
         * validate
         */
        $request->validate([
            'barcode' => 'required|unique:products,barcode,'.$product->id,
            'sku' => 'nullable',
            'title' => 'required',
            'description' => 'required',
            'category_id' => 'required',
            'buy_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'is_pph23' => 'nullable|boolean',
            'weight' => 'required|integer|min:1',
            'length' => 'nullable|integer|min:1',
            'width' => 'nullable|integer|min:1',
            'height' => 'nullable|integer|min:1',
        ]);

        // check image update
        if ($request->file('image')) {

            // remove old image
            Storage::disk('local')->delete('public/products/'.basename($product->image));

            // upload new image
            $image = $request->file('image');
            $image->storeAs('public/products', $image->hashName());

            // update product with new image
            $product->update([
                'image' => $image->hashName(),
                'barcode' => $request->barcode,
                'sku' => $request->sku,
                'title' => $request->title,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'buy_price' => $request->buy_price,
                'sell_price' => $request->sell_price,
                'is_pph23' => $request->is_pph23 ?? false,
            ]);

        } else {
            // update product without image
            $product->update([
                'barcode' => $request->barcode,
                'sku' => $request->sku,
                'title' => $request->title,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'buy_price' => $request->buy_price,
                'sell_price' => $request->sell_price,
                'is_pph23' => $request->is_pph23 ?? false,
            ]);
        }

        // update product detail
        $product->productDetail()->updateOrCreate(
            ['product_id' => $product->id],
            [
                'weight' => $request->weight,
                'length' => $request->length ?? 10,
                'width' => $request->width ?? 10,
                'height' => $request->height ?? 10,
            ]
        );

        // redirect
        return to_route('products.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // find by ID
        $product = Product::findOrFail($id);

        // remove image
        Storage::disk('local')->delete('public/products/'.basename($product->image));

        // delete
        $product->delete();

        // redirect
        return back();
    }
}
