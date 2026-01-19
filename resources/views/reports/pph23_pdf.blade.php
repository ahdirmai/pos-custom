<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan PPh 23</title>
    <style>
        @page { size: 215mm 330mm; margin: 30px; }
        @font-face { font-family: 'Inter'; font-style: normal; font-weight: 400; src: url("{{ public_path('inter/Inter_24pt-Regular.ttf') }}") format('truetype') }
        @font-face { font-family: 'Inter'; font-style: normal; font-weight: 700; src: url("{{ public_path('inter/Inter_24pt-Bold.ttf') }}") format('truetype') }
        
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
        body { font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; margin: 0; padding: 0; color: #1e293b; background-color: #fff; line-height: 1.4; font-size: 10px; }
        
        /* Layout Helpers */
        .w-full { width: 100%; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        
        /* Header */
        .header-table td { vertical-align: top; }
        .logo-box { width: 70px; height: 70px; margin-right: 15px; }
        .store-name { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .store-address { font-size: 11px; color: #64748b; margin-top: 4px; max-width: 350px; }
        
        .badge-nota { background: #4aa377; color: #fff; padding:2px 15px 5px; font-size: 14px; font-weight: 700; border-radius: 4px; display: inline-block; margin-bottom: 8px; }
        .report-title { font-size: 24px; margin-top: -5px; margin-bottom: 0px; font-weight: 700; color: #1e293b; }
        .report-period { font-size: 12px; color: #64748b; margin-top: 5px;}

        /* Table Styles */
        .table-container { margin-top: 20px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
        table { width: 100%; border-collapse: separate; border-spacing: 0; }
        th { background-color: #4aa377; color: white; text-transform: uppercase; font-size: 9px; padding: 10px 8px; text-align: left;}
        td { padding: 8px; border-bottom: 1px solid #f1f5f9; font-size: 9px; }
        tbody tr:nth-child(even) { background-color: #f8fafc; }
        
        /* Footer/Total Style */
        .total-row td { font-weight: bold; background-color: #f1f5f9 !important; color: #1e293b; border-top: 2px solid #cbd5e0; }
        
        /* Badge */
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 8px; font-weight: bold; }
        .bg-green { background-color: #def7ec; color: #03543f; }
        .bg-orange { background-color: #fef3c7; color: #92400e; }
        .no-data { padding: 20px; color: #94a3b8; font-style: italic; }

        /* Footer Info */
        .footer-info { margin-top: 15px; font-size: 8px; color: #94a3b8; text-align: right; }
    </style>
</head>
<body>
    <!-- HEADER -->
    <table class="w-full header-table">
        <tr>
            <td>
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="logo-box">
                            @php $logo = $store['logo_data'] ?: $store['logo']; @endphp
                            @if($logo)
                                <img src="{{ $logo }}" style="max-width: 100px; max-height: 100px;">
                            @else
                                <div style="background: #4aa377; color: white; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 20px;">
                                    {{ substr($store['name'], 0, 2) }}
                                </div>
                            @endif
                        </td>
                        <td>
                            <h1 class="store-name">{{ $store['name'] }}</h1>
                            <div class="store-address">
                                {{ $store['address'] }}<br>
                                <strong>Telp:</strong> {{ $store['phone'] ?? '-' }} &nbsp; <strong>Email:</strong> {{ $store['email'] }}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
            <td class="text-right">
                <span class="badge-nota">LAPORAN PAJAK</span>
                <h2 class="report-title">PPH 23</h2>
                <div class="report-period">
                    Periode: {{ \Carbon\Carbon::parse($start_date)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($end_date)->format('d/m/Y') }}
                </div>
            </td>
        </tr>
    </table>

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

    <div class="footer-info">
        * Dicetak secara otomatis pada {{ date('d/m/Y H:i') }}
    </div>
</body>
</html>