<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FlashSaleController extends Controller
{
    public function index(Request $request)
    {
        $flashSales = FlashSale::query()
            ->withCount('items')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dashboard/FlashSales/Index', [
            'flashSales' => $flashSales,
            'filters' => $request->only('search'),
            'summary' => [
                'total' => FlashSale::count(),
                'active' => FlashSale::activeNow()->count(),
                'scheduled' => FlashSale::where('start_at', '>', now())->count(),
                'products' => DB::table('flash_sale_products')->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/FlashSales/Create', [
            'products' => $this->productOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);

        DB::transaction(function () use ($validated) {
            if ($validated['is_active']) {
                FlashSale::query()->update(['is_active' => false]);
            }

            $flashSale = FlashSale::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'start_at' => $validated['start_at'],
                'end_at' => $validated['end_at'],
                'is_active' => $validated['is_active'],
            ]);

            $flashSale->items()->createMany($this->normalizeItems($validated['products']));
        });

        return redirect()->route('flash-sales.index')->with('success', 'Flash sale berhasil dibuat.');
    }

    public function edit(FlashSale $flashSale)
    {
        $flashSale->load('items.product');

        return Inertia::render('Dashboard/FlashSales/Edit', [
            'flashSale' => [
                'id' => $flashSale->id,
                'name' => $flashSale->name,
                'description' => $flashSale->description,
                'start_at' => optional($flashSale->start_at)->format('Y-m-d\TH:i'),
                'end_at' => optional($flashSale->end_at)->format('Y-m-d\TH:i'),
                'is_active' => $flashSale->is_active,
                'products' => $flashSale->items->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'discount_price' => $item->discount_price,
                    ];
                })->values(),
            ],
            'products' => $this->productOptions(),
        ]);
    }

    public function update(Request $request, FlashSale $flashSale)
    {
        $validated = $this->validateRequest($request, $flashSale);

        DB::transaction(function () use ($validated, $flashSale) {
            if ($validated['is_active']) {
                FlashSale::query()
                    ->whereKeyNot($flashSale->id)
                    ->update(['is_active' => false]);
            }

            $flashSale->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'start_at' => $validated['start_at'],
                'end_at' => $validated['end_at'],
                'is_active' => $validated['is_active'],
            ]);

            $flashSale->items()->delete();
            $flashSale->items()->createMany($this->normalizeItems($validated['products']));
        });

        return redirect()->route('flash-sales.index')->with('success', 'Flash sale berhasil diperbarui.');
    }

    public function destroy(FlashSale $flashSale)
    {
        $flashSale->delete();

        return redirect()->route('flash-sales.index')->with('success', 'Flash sale berhasil dihapus.');
    }

    protected function validateRequest(Request $request, ?FlashSale $flashSale = null): array
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'is_active' => 'required|boolean',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|integer|distinct|exists:products,id',
            'products.*.discount_price' => 'required|numeric|min:0',
        ]);

        $productPrices = Product::query()
            ->whereIn('id', collect($validated['products'])->pluck('product_id'))
            ->pluck('sell_price', 'id');

        foreach ($validated['products'] as $index => $item) {
            $originalPrice = (int) ($productPrices[$item['product_id']] ?? 0);
            $discountPrice = (int) $item['discount_price'];

            if ($discountPrice >= $originalPrice) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    "products.{$index}.discount_price" => 'Harga flash sale harus lebih rendah dari harga jual normal.',
                ]);
            }
        }

        return $validated;
    }

    protected function normalizeItems(array $items): array
    {
        return collect($items)->map(function ($item) {
            return [
                'product_id' => $item['product_id'],
                'discount_price' => $item['discount_price'],
            ];
        })->values()->all();
    }

    protected function productOptions()
    {
        return Product::query()
            ->orderBy('title')
            ->get(['id', 'title', 'sell_price', 'stock', 'image']);
    }
}
