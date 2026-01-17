<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PphReportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(Request $request)
    {
        $filters = array_merge([
            'start_date' => now()->startOfMonth()->format('Y-m-d'),
            'end_date' => now()->endOfMonth()->format('Y-m-d'),
            'invoice' => null,
            'customer_id' => null,
        ], $request->only(['start_date', 'end_date', 'invoice', 'customer_id']));

        $query = Transaction::with(['customer', 'details.product', 'cashier'])
            // Filter transactions that have at least one PPh 23 product
            ->whereHas('details.product', function ($query) {
                $query->where('is_pph23', true);
            });

        $query = $this->applyFilters($query, $filters);

        // Calculate Stats
        $clonedQuery = clone $query;
        $stats = $clonedQuery->get()->map(function ($transaction) {
            $serviceItems = $transaction->details->filter(function ($detail) {
                return $detail->product->is_pph23 == 1;
            });
            $totalDppJasa = $serviceItems->sum(fn ($item) => $item->price);
            $hasNpwp = ! empty($transaction->customer->npwp);
            $rate = $hasNpwp ? 0.02 : 0.04;
            $pphAmount = $totalDppJasa * $rate;

            return [
                'grand_total' => $transaction->grand_total,
                'pph_amount' => $pphAmount,
            ];
        });

        $summary = [
            'total_transactions' => $stats->count(),
            'total_revenue' => $stats->sum('grand_total'),
            'total_pph' => $stats->sum('pph_amount'),
        ];

        $reports = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($transaction) {
                return $this->transformTransaction($transaction);
            });

        return Inertia::render('Dashboard/Reports/Pph23', [
            'reports' => $reports,
            'filters' => $filters,
            'customers' => Customer::select('id', 'name')->orderBy('name')->get(),
            'summary' => $summary,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $filters = array_merge([
            'start_date' => now()->startOfMonth()->format('Y-m-d'),
            'end_date' => now()->endOfMonth()->format('Y-m-d'),
        ], $request->all());

        $query = Transaction::with(['customer', 'details.product', 'cashier'])
            ->whereHas('details.product', fn ($q) => $q->where('is_pph23', true));

        $query = $this->applyFilters($query, $filters);

        $transactions = $query->latest()->get()->map(fn ($t) => $this->transformTransaction($t));

        // Calculate totals for PDF
        $totalDpp = $transactions->sum('total_dpp_jasa');
        $totalPph = $transactions->sum('pph23_amount');

        $pdf = Pdf::loadView('reports.pph23_pdf', [
            'transactions' => $transactions,
            'start_date' => $filters['start_date'],
            'end_date' => $filters['end_date'],
            'total_dpp' => $totalDpp,
            'total_pph' => $totalPph,
        ]);

        return $pdf->stream('laporan-pph23.pdf');
    }

    public function exportExcel(Request $request)
    {
        $filters = array_merge([
            'start_date' => now()->startOfMonth()->format('Y-m-d'),
            'end_date' => now()->endOfMonth()->format('Y-m-d'),
        ], $request->all());

        $query = Transaction::with(['customer', 'details.product', 'cashier'])
            ->whereHas('details.product', fn ($q) => $q->where('is_pph23', true));

        $query = $this->applyFilters($query, $filters);

        $transactions = $query->latest()->get()->map(fn ($t) => $this->transformTransaction($t));

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=laporan-pph23.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $columns = ['No', 'Invoice', 'Tanggal', 'Pelanggan', 'NPWP', 'Item Jasa', 'Total DPP Jasa', 'Tarif', 'PPh 23'];

        $callback = function () use ($transactions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($transactions as $index => $row) {
                fputcsv($file, [
                    $index + 1,
                    $row['invoice_number'],
                    $row['date'],
                    $row['customer_name'],
                    $row['customer_npwp'],
                    $row['service_names'],
                    $row['total_dpp_jasa'],
                    $row['tax_rate'] * 100 .'%',
                    $row['pph23_amount'],
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    protected function applyFilters($query, $filters)
    {
        return $query
            ->when($filters['start_date'] ?? null, function ($q, $date) use ($filters) {
                $q->whereBetween('created_at', [$date.' 00:00:00', ($filters['end_date'] ?? $date).' 23:59:59']);
            })
            ->when($filters['invoice'] ?? null, fn ($q, $inv) => $q->where('invoice', 'like', '%'.$inv.'%'))
            ->when($filters['customer_id'] ?? null, fn ($q, $id) => $q->where('customer_id', $id));
    }

    protected function transformTransaction($transaction)
    {
        // Items for calculation (only PPh 23)
        $serviceItems = $transaction->details->filter(function ($detail) {
            return $detail->product->is_pph23 == 1;
        });

        $totalDppJasa = $serviceItems->sum(fn ($item) => $item->price);
        $hasNpwp = ! empty($transaction->customer->npwp);
        $rate = $hasNpwp ? 0.02 : 0.04;

        // All items for display
        $allItems = $transaction->details->map(function ($item) use ($rate) {
            return [
                'product_name' => $item->product->title,
                'qty' => $item->qty,
                'price' => $item->price / $item->qty,
                'total_price' => $item->price,
                'is_pph23' => (bool) $item->product->is_pph23,
                'pph23_amount' => $item->product->is_pph23 ? $item->price * $rate : null,
            ];
        })->values();

        return [
            'id' => $transaction->id,
            'date' => Carbon::parse($transaction->created_at)->format('Y-m-d H:i'),
            'invoice_number' => $transaction->invoice,
            'customer_name' => $transaction->customer->name ?? 'Umum',
            'customer_npwp' => $transaction->customer->npwp ?? '-',
            'service_names' => $serviceItems->pluck('product.title')->implode(', '),
            'total_dpp_jasa' => $totalDppJasa,
            'tax_rate' => $rate,
            'pph23_amount' => $totalDppJasa * $rate,
            'discount' => $transaction->discount, // Add discount
            'grand_total' => $transaction->grand_total, // Add grand total
            'cashier_name' => $transaction->cashier->name ?? '-',
            'items' => $allItems, // Return all items
        ];
    }
}
