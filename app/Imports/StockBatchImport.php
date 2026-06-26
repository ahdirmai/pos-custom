<?php

namespace App\Imports;

use App\Models\Product;
use App\Services\StockService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StockBatchImport implements ToCollection, WithHeadingRow
{
    /** @var array<int,string> */
    public array $errors = [];

    public int $imported = 0;

    public function __construct(private StockService $stockService) {}

    public function collection(Collection $rows): void
    {
        $batchRows = [];

        foreach ($rows as $index => $row) {
            $line = $index + 2; // +1 heading, +1 zero-based

            $barcode = trim((string) ($row['barcode'] ?? ''));
            $qty = (int) ($row['qty'] ?? 0);

            if ($barcode === '') {
                $this->errors[] = "Baris {$line}: barcode kosong.";

                continue;
            }
            if ($qty <= 0) {
                $this->errors[] = "Baris {$line}: qty harus lebih dari 0.";

                continue;
            }

            $product = Product::where('barcode', $barcode)->first();
            if (! $product) {
                $this->errors[] = "Baris {$line}: produk dengan barcode '{$barcode}' tidak ditemukan.";

                continue;
            }

            $batchRows[] = [
                'product' => $product,
                'qty' => $qty,
                'buy_price' => isset($row['buy_price']) && $row['buy_price'] !== null
                    ? (int) $row['buy_price']
                    : null,
                'received_date' => $this->parseDate($row['received_date'] ?? null),
                'expired_date' => $this->parseDate($row['expired_date'] ?? null),
                'note' => $row['note'] ?? null,
            ];
        }

        if (! empty($this->errors)) {
            return; // abort without writing any batch
        }

        $this->imported = $this->stockService->bulkStockIn($batchRows);
    }

    private function parseDate(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return Carbon::instance(
                    \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject((float) $value)
                )->toDateString();
            }

            return Carbon::parse($value)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }
}
