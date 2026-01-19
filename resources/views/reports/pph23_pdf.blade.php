<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan PPh 23</title>
    <style>
        /* Pengaturan Ukuran Kertas F4 */
        @page {
            size: 210mm 330mm;
            margin: 15mm;
        }

        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            font-size: 8.5pt; /* Tulisan diperkecil */
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.4;
        }

        .header { 
            text-align: center; 
            margin-bottom: 15px; 
            border-bottom: 2px solid #444;
            padding-bottom: 10px;
        }
        .header h2 { margin: 0; text-transform: uppercase; color: #2c3e50; font-size: 20pt; }
        .header p { margin: 3px 0 0; color: #7f8c8d; font-size: 9pt; }

        /* Styling Tabel dengan Radius */
        .table-container {
            border-radius: 8px;
            overflow: hidden; /* Memastikan radius terlihat */
            border: 1px solid #cbd5e0;
        }

        table { 
            width: 100%; 
            border-collapse: separate; /* Penting untuk radius */
            border-spacing: 0; 
        }

        th { 
            background-color: #2d3748; 
            color: white; 
            text-transform: uppercase;
            font-size: 8pt;
            letter-spacing: 0.5px;
            padding: 10px 8px;
        }

        td { 
            padding: 8px; 
            border-bottom: 1px solid #edf2f7;
            border-right: 1px solid #edf2f7;
        }

        td:last-child, th:last-child { border-right: none; }

        /* Beda Warna Baris (Zebra) */
        tbody tr:nth-child(even) { background-color: #f8fafc; }
        tbody tr:nth-child(odd) { background-color: #ffffff; }
        tbody tr:hover { background-color: #f1f5f9; }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }

        /* Footer/Total Style */
        .total-row td { 
            font-weight: bold; 
            background-color: #edf2f7 !important; 
            color: #2d3748;
            border-top: 2px solid #cbd5e0;
        }

        /* Badge Style */
        .badge { 
            display: inline-block; 
            padding: 2px 8px; 
            border-radius: 12px; 
            font-size: 7.5pt; 
            font-weight: bold;
        }
        .bg-green { background-color: #def7ec; color: #03543f; border: 1px solid #84e1bc; }
        .bg-orange { background-color: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }

        .no-data { padding: 20px; color: #a0aec0; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Laporan PPh 23</h2>
        <p>Periode: {{ \Carbon\Carbon::parse($start_date)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($end_date)->format('d/m/Y') }}</p>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th width="4%" class="text-center">No</th>
                    <th width="18%">No. Invoice</th>
                    <th width="16%" class="text-center">Tanggal</th>
                    <th width="24%">Nama Pelanggan</th>
                    <th width="15%" class="text-right">DPP Jasa</th>
                    <th width="8%" class="text-center">Tarif</th>
                    <th width="15%" class="text-right">PPh 23</th>
                </tr>
            </thead>
            <tbody>
                @forelse($transactions as $index => $row)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="font-bold">{{ $row['invoice_number'] }}</td>
                    <td class="text-center">{{ $row['date'] }}</td>
                    <td>{{ $row['customer_name'] }}</td>
                    <td class="text-right">Rp {{ number_format($row['total_dpp_jasa'], 0, ',', '.') }}</td>
                    <td class="text-center">
                        <span class="badge {{ $row['tax_rate'] == 0.02 ? 'bg-green' : 'bg-orange' }}">
                            {{ $row['tax_rate'] * 100 }}%
                        </span>
                    </td>
                    <td class="text-right font-bold" style="color: #c53030;">
                        Rp {{ number_format($row['pph23_amount'], 0, ',', '.') }}
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="text-center no-data">Tidak ditemukan data transaksi untuk periode ini.</td>
                </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td colspan="4" class="text-right">TOTAL KESELURUHAN</td>
                    <td class="text-right">Rp {{ number_format($total_dpp, 0, ',', '.') }}</td>
                    <td></td>
                    <td class="text-right">Rp {{ number_format($total_pph, 0, ',', '.') }}</td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div style="margin-top: 15px; font-size: 7pt; color: #718096; text-align: right;">
        * Dicetak secara otomatis pada {{ date('d/m/Y H:i') }}
    </div>
</body>
</html>