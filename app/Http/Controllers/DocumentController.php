<?php

namespace App\Http\Controllers;

use App\Models\Payable;
use App\Models\Receivable;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Picqer\Barcode\BarcodeGeneratorPNG;

class DocumentController extends Controller
{
    private function ensureFontDirectory(): void
    {
        $fontDir = storage_path('fonts');
        if (! is_dir($fontDir)) {
            @mkdir($fontDir, 0755, true);
        }
    }

    private function storeProfile(): array
    {
        $logo = \App\Models\Setting::get('store_logo');
        if ($logo && ! str_starts_with($logo, 'http') && ! str_starts_with($logo, '/storage')) {
            $logo = asset('storage/'.ltrim($logo, '/'));
        }

        $logoData = null;
        if ($logo) {
            $localPath = null;
            if (str_starts_with($logo, asset('storage'))) {
                $localPath = public_path(str_replace(asset(''), '', $logo));
            } elseif (str_starts_with($logo, '/storage')) {
                $localPath = public_path($logo);
            }

            if ($localPath && file_exists($localPath)) {
                $logoData = 'data:image/png;base64,'.base64_encode(file_get_contents($localPath));
            }
        }

        return [
            'name' => \App\Models\Setting::get('store_name', 'Toko Anda'),
            'logo' => $logo,
            'logo_data' => $logoData,
            'address' => \App\Models\Setting::get('store_address', ''),
            'phone' => \App\Models\Setting::get('store_phone', ''),
            'email' => \App\Models\Setting::get('store_email', ''),
            'website' => \App\Models\Setting::get('store_website', ''),
        ];
    }

    private function barcode(string $code): string
    {
        $generator = new BarcodeGeneratorPNG;
        $data = $generator->getBarcode($code, $generator::TYPE_CODE_128);

        return 'data:image/png;base64,'.base64_encode($data);
    }

    public function invoice(string $invoice)
    {
        $this->ensureFontDirectory();

        $transaction = Transaction::with(['details.product', 'cashier', 'customer'])
            ->where('invoice', $invoice)
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf.invoice', [
            'transaction' => $transaction,
            'store' => $this->storeProfile(),
            'barcode' => $this->barcode($transaction->invoice),
        ])->setPaper('a4');

        return $pdf->stream("invoice-{$transaction->invoice}.pdf");
    }

    /**
     * Public version of invoice (no auth needed).
     */
    public function publicInvoice(string $invoice)
    {
        return $this->invoice($invoice);
    }

    public function receipt(string $invoice, string $size = '80')
    {
        $this->ensureFontDirectory();

        $transaction = Transaction::with(['details.product', 'cashier', 'customer'])
            ->where('invoice', $invoice)
            ->firstOrFail();

        $template = $size === '58' ? 'pdf.receipt_58' : 'pdf.receipt_80';
        $width = $size === '58' ? 164.4 : 226.8; // points (mm*2.8346)
        $pdf = Pdf::loadView($template, [
            'transaction' => $transaction,
            'store' => $this->storeProfile(),
            'barcode' => $this->barcode($transaction->invoice),
        ])->setPaper([0, 0, $width, 800], 'portrait');

        return $pdf->stream("receipt-{$transaction->invoice}-{$size}.pdf");
    }

    public function shipping(string $invoice)
    {
        $this->ensureFontDirectory();

        $transaction = Transaction::with(['details.product', 'customer', 'cashier'])
            ->where('invoice', $invoice)
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf.shipping_label', [
            'transaction' => $transaction,
            'store' => $this->storeProfile(),
            'barcode' => $this->barcode($transaction->invoice),
        ]);

        // Set kertas 150mm x 100mm (dalam Points: 1mm = 2.83465pt)
        // 150mm = 425pt, 100mm = 283pt
        $pdf->setPaper([0, 0, 425, 283], 'landscape');

        return $pdf->stream("shipping-{$transaction->invoice}.pdf");
    }

    public function receivable(Receivable $receivable)
    {
        $this->ensureFontDirectory();

        $receivable->load(['customer', 'payments.bankAccount', 'payments.user']);

        $pdf = Pdf::loadView('pdf.receivable', [
            'receivable' => $receivable,
            'store' => $this->storeProfile(),
            'barcode' => $this->barcode($receivable->invoice),
        ])->setPaper('a5', 'portrait');

        return $pdf->stream("piutang-{$receivable->invoice}.pdf");
    }

    public function payable(Payable $payable)
    {
        $this->ensureFontDirectory();

        $payable->load(['supplier', 'payments.bankAccount', 'payments.user']);

        $pdf = Pdf::loadView('pdf.payable', [
            'payable' => $payable,
            'store' => $this->storeProfile(),
            'barcode' => $this->barcode($payable->document_number),
        ])->setPaper('a5', 'portrait');

        return $pdf->stream("hutang-{$payable->document_number}.pdf");
    }

    public function pphPdf(Request $request)
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
            'store' => $this->storeProfile(),
        ]);

        return $pdf->stream('laporan-pph23.pdf');
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
        // $rate = $hasNpwp ? 0.02 : 0.04;
        $rate = 0.01;

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
