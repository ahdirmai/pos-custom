<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Imports\StockBatchImport;
use App\Models\Product;
use App\Models\StockBatch;
use App\Services\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StockController extends Controller
{
    public function __construct(protected StockService $stockService) {}

    /**
     * List products with stock summary and near-expiry indicators.
     */
    public function index(Request $request)
    {
        $products = Product::query()
            ->with('category:id,name')
            ->withCount(['stockBatches as active_batches_count' => function ($query) {
                $query->available();
            }])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', '%'.$search.'%')
                    ->orWhere('barcode', 'like', '%'.$search.'%')
                    ->orWhere('sku', 'like', '%'.$search.'%');
            })
            ->orderBy('title')
            ->paginate(12)
            ->withQueryString()
            ->through(function (Product $product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'barcode' => $product->barcode,
                    'sku' => $product->sku,
                    'category' => $product->category?->name,
                    'stock' => (int) $product->stock,
                    'active_batches_count' => (int) $product->active_batches_count,
                    'near_expiry_count' => $product->stockBatches()->available()->nearExpiry(30)->count(),
                    'expired_count' => $product->stockBatches()->available()->expired()->count(),
                ];
            });

        return Inertia::render('Dashboard/Stock/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Stock card for a single product: batches + ledger movements.
     */
    public function show(Product $product)
    {
        $product->load('category:id,name');

        $batches = $product->stockBatches()
            ->oldestFirst()
            ->get()
            ->map(function (StockBatch $batch) {
                return [
                    'id' => $batch->id,
                    'batch_code' => $batch->batch_code,
                    'qty_in' => $batch->qty_in,
                    'qty_remaining' => $batch->qty_remaining,
                    'buy_price' => $batch->buy_price,
                    'received_date' => $batch->received_date?->toDateString(),
                    'expired_date' => $batch->expired_date?->toDateString(),
                    'status' => $this->batchStatus($batch),
                    'note' => $batch->note,
                ];
            });

        $movements = $product->stockMovements()
            ->with('user:id,name')
            ->latest('id')
            ->limit(100)
            ->get()
            ->map(function ($movement) {
                return [
                    'id' => $movement->id,
                    'type' => $movement->type,
                    'reference_type' => $movement->reference_type,
                    'reference_id' => $movement->reference_id,
                    'qty' => $movement->qty,
                    'qty_after' => $movement->qty_after,
                    'note' => $movement->note,
                    'user' => $movement->user?->name,
                    'created_at' => $movement->created_at?->toDateTimeString(),
                ];
            });

        return Inertia::render('Dashboard/Stock/Show', [
            'product' => [
                'id' => $product->id,
                'title' => $product->title,
                'barcode' => $product->barcode,
                'sku' => $product->sku,
                'category' => $product->category?->name,
                'stock' => (int) $product->stock,
                'buy_price' => (int) $product->buy_price,
            ],
            'batches' => $batches,
            'movements' => $movements,
        ]);
    }

    /**
     * Record incoming stock (new batch).
     */
    public function storeIn(Request $request, Product $product)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
            'buy_price' => 'required|integer|min:0',
            'received_date' => 'required|date',
            'expired_date' => 'nullable|date|after_or_equal:received_date',
            'batch_code' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $this->stockService->stockIn($product, [
            'qty' => (int) $request->qty,
            'buy_price' => (int) $request->buy_price,
            'received_date' => $request->received_date,
            'expired_date' => $request->expired_date,
            'batch_code' => $request->batch_code,
            'note' => $request->note,
        ]);

        return back()->with('success', 'Barang masuk berhasil dicatat.');
    }

    /**
     * Stock opname / write-off: set a batch's remaining qty to a new value.
     */
    public function adjust(Request $request, Product $product)
    {
        $request->validate([
            'stock_batch_id' => 'required|exists:stock_batches,id',
            'qty_remaining' => 'required|integer|min:0',
            'reason' => 'required|string|in:opname,write_off',
            'note' => 'nullable|string',
        ]);

        $batch = $product->stockBatches()->findOrFail($request->stock_batch_id);

        $this->stockService->adjust(
            $product,
            $batch,
            (int) $request->qty_remaining,
            $request->reason,
            $request->note,
        );

        return back()->with('success', 'Penyesuaian stok berhasil dicatat.');
    }

    /**
     * Expiry report: expired & near-expiry batches with estimated loss value.
     */
    public function expiryReport(Request $request)
    {
        $days = (int) ($request->days ?? 30);

        $batches = StockBatch::query()
            ->available()
            ->where(function ($query) use ($days) {
                $query->expired()->orWhere(function ($q) use ($days) {
                    $q->nearExpiry($days);
                });
            })
            ->with('product:id,title,barcode,sku')
            ->orderBy('expired_date')
            ->get()
            ->map(function (StockBatch $batch) {
                return [
                    'id' => $batch->id,
                    'product' => $batch->product?->title,
                    'barcode' => $batch->product?->barcode,
                    'batch_code' => $batch->batch_code,
                    'qty_remaining' => $batch->qty_remaining,
                    'buy_price' => $batch->buy_price,
                    'loss_value' => $batch->qty_remaining * $batch->buy_price,
                    'expired_date' => $batch->expired_date?->toDateString(),
                    'status' => $this->batchStatus($batch),
                ];
            });

        return Inertia::render('Dashboard/Stock/ExpiryReport', [
            'batches' => $batches,
            'totalLoss' => $batches->sum('loss_value'),
            'days' => $days,
        ]);
    }

    /**
     * Show the bulk stock-in page (multi-row form + file import).
     */
    public function bulkForm(Request $request)
    {
        $products = Product::query()
            ->orderBy('title')
            ->get(['id', 'title', 'barcode', 'sku', 'buy_price'])
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'barcode' => $p->barcode,
                'sku' => $p->sku,
                'buy_price' => (int) $p->buy_price,
            ]);

        return Inertia::render('Dashboard/Stock/BulkIn', [
            'products' => $products,
        ]);
    }

    /**
     * Store multiple stock-in rows at once (all-or-nothing).
     */
    public function bulkStore(Request $request)
    {
        $request->validate([
            'rows' => 'required|array|min:1',
            'rows.*.product_id' => 'required|exists:products,id',
            'rows.*.qty' => 'required|integer|min:1',
            'rows.*.buy_price' => 'required|integer|min:0',
            'rows.*.received_date' => 'required|date',
            'rows.*.expired_date' => 'nullable|date|after_or_equal:rows.*.received_date',
            'rows.*.note' => 'nullable|string',
        ]);

        $count = $this->stockService->bulkStockIn($request->input('rows'));

        return back()->with('success', "{$count} batch stok berhasil dicatat.");
    }

    /**
     * Import stock-in batches from an Excel/CSV file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,txt',
        ]);

        $import = new StockBatchImport($this->stockService);
        Excel::import($import, $request->file('file'));

        if (! empty($import->errors)) {
            return back()->withErrors([
                'file' => implode(' ', array_slice($import->errors, 0, 10)),
            ]);
        }

        return back()->with('success', "{$import->imported} batch stok berhasil diimpor.");
    }

    /**
     * Download an import template (CSV) with the expected columns.
     */
    public function template(): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="template_stok_masuk.csv"',
        ];

        return response()->streamDownload(function () {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['barcode', 'qty', 'buy_price', 'received_date', 'expired_date', 'note']);
            fputcsv($out, ['8991234567890', '50', '12000', '2026-06-26', '2027-06-26', 'contoh batch']);
            fclose($out);
        }, 'template_stok_masuk.csv', $headers);
    }

    private function batchStatus(StockBatch $batch): string
    {
        if ($batch->qty_remaining <= 0) {
            return 'habis';
        }
        if ($batch->expired_date === null) {
            return 'aman';
        }
        if ($batch->expired_date->isPast()) {
            return 'expired';
        }
        if ($batch->expired_date->lte(now()->addDays(30))) {
            return 'mendekati_expired';
        }

        return 'aman';
    }
}
