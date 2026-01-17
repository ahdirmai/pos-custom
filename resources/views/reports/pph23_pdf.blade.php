<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan PPh 23</title>
    <style>
        body { font-family: sans-serif; font-size: 10pt; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h2 { margin: 0; }
        .header p { margin: 5px 0 0; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f4f4f4; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .total-row td { font-weight: bold; background-color: #f9f9f9; }
        .badge { display: inline-block; padding: 2px 5px; border-radius: 4px; font-size: 8pt; }
        .bg-green { background-color: #d1fae5; color: #065f46; }
        .bg-orange { background-color: #ffedd5; color: #9a3412; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Laporan PPh 23</h2>
        <p>Periode: {{ \Carbon\Carbon::parse($start_date)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($end_date)->format('d/m/Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%" class="text-center">No</th>
                <th width="15%">Invoice</th>
                <th width="10%">Tanggal</th>
                <th width="20%">Pelanggan</th>
                <th width="15%">NPWP</th>
                <th width="10%" class="text-right">DPP Jasa</th>
                <th width="10%" class="text-center">Tarif</th>
                <th width="15%" class="text-right">PPh 23</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $index => $row)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ $row['invoice_number'] }}</td>
                <td>{{ $row['date'] }}</td>
                <td>{{ $row['customer_name'] }}</td>
                <td>{{ $row['customer_npwp'] }}</td>
                <td class="text-right">Rp {{ number_format($row['total_dpp_jasa'], 0, ',', '.') }}</td>
                <td class="text-center">
                    <span class="badge {{ $row['tax_rate'] == 0.02 ? 'bg-green' : 'bg-orange' }}">
                        {{ $row['tax_rate'] * 100 }}%
                    </span>
                </td>
                <td class="text-right">Rp {{ number_format($row['pph23_amount'], 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="8" class="text-center">Tidak ada data transaksi.</td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="5" class="text-right">Total</td>
                <td class="text-right">Rp {{ number_format($total_dpp, 0, ',', '.') }}</td>
                <td></td>
                <td class="text-right">Rp {{ number_format($total_pph, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
