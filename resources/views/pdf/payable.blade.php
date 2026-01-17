<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Hutang - {{ $payable->document_number }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        
        @page { size: 215mm 330mm; margin: 15mm; }
        
        body {
            font-family: 'Inter', Helvetica, Arial, sans-serif;
            color: #000;
            margin: 0;
            padding: 0;
            background: #fff;
            font-size: 10.5pt;
            line-height: 1.3;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 700; }
        .muted { color: #666; font-size: 8.5pt; }

        /* Header Style */
        header { margin-bottom: 15px; }
        .header-table { width: 100%; border-collapse: collapse; }
        .header-logo { width: 50px; padding-right: 12px; }
        .company-details h1 { margin: 0; font-size: 14pt; text-transform: uppercase; letter-spacing: 0.5px; }
        .company-details p { margin: 1px 0; font-size: 8.5pt; color: #444; }
        
        .doc-title { margin: 0; font-size: 24pt; letter-spacing: 4px; color: #f0f0f0; font-weight: 800; line-height: 1; }
        .doc-number { font-size: 10pt; font-weight: 700; margin-top: 3px; }

        /* Grid Info */
        .info-grid { display: table; width: 100%; margin-bottom: 25px; }
        .col { display: table-cell; vertical-align: top; }
        .col-left { width: 65%; }
        .col-right { width: 35%; }
        
        .box-title { 
            font-size: 8.5pt; 
            font-weight: 800; 
            text-transform: uppercase; 
            letter-spacing: 0.8px; 
            color: #555;
            margin-bottom: 6px; 
        }

        .supplier-name { font-size: 12pt; font-weight: 800; margin-bottom: 2px; }

        /* Financial Summary (Kecil & Abu-abu) */
        .financial-summary {
            border: 1px solid #d1d5db; /* Warna abu-abu halus */
            border-radius: 8px;
            padding: 10px 12px;
            background-color: #fff;
            width: 230px; /* Ukuran kotak lebih ramping */
            float: right;
        }

        .summary-row {
            display: table;
            width: 100%;
            margin-bottom: 4px;
        }

        .summary-row span { display: table-cell; vertical-align: middle; }
        .summary-row .label { font-size: 9pt; color: #4b5563; }
        .summary-row .value { text-align: right; font-size: 10pt; font-weight: 700; font-variant-numeric: tabular-nums; }
        .dept{color:#c2410c;font-size:17px !important}

        .line-divider { border-top: 1px solid #f3f4f6; margin: 6px 0; }
        .line-bold { border-top: 1px solid #d1d5db; margin: 6px 0; }

        /* Table Style */
        table.main-table { width: 100%; border-collapse: collapse; margin-top: 5px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
        table.main-table th { 
            background-color: #1e293b; 
            color: #ffffff; 
            padding: 8px 10px; 
            text-align: left; 
            font-size: 8.5pt; 
            text-transform: uppercase;
            border-bottom: 2px solid #0f172a;
        }
        table.main-table td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-size: 9.5pt; }

        /* Signature Area */
        .signature-section { display: table; width: 100%; margin-top: 40px; }
        .sig-box { display: table-cell; width: 33.3%; text-align: center; }
        .sig-space { height: 60px; }
        .sig-line { display: inline-block; width: 75%; border-top: 1px solid #000; padding-top: 4px; font-weight: 700; font-size: 9pt; }

        .page-footer {
            margin-top: 30px;
            border-top: 1px dashed #e2e8f0;
            padding-top: 8px;
            font-size: 7.5pt;
            color: #94a3b8;
        }

        @media print {
            .no-print { display: none; }
            .financial-summary { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>

    <header>
        <table class="header-table">
            <tr>
                <td>
                    <table style="border:none;">
                        <tr>
                            <td class="header-logo">
                                @if ($store['logo_data'] ?? false)
                                    <img src="{{ $store['logo_data'] }}" style="max-width:45pt;">
                                @else
                                    <div style="font-size:20pt; font-weight:800; background:#334155; color:#fff; width:45px; height:45px; text-align:center; line-height:45px; border-radius:6px;">{{ substr($store['name'],0,1) }}</div>
                                @endif
                            </td>
                            <td class="company-details">
                                <h1>{{ $store['name'] }}</h1>
                                <p>{{ $store['address'] }}</p>
                                <p>Telp: {{ $store['phone'] }}</p>
                            </td>
                        </tr>
                    </table>
                </td>
                <td class="text-right" style="vertical-align: top;">
                    <h1 class="doc-title">HUTANG</h1>
                    <div class="doc-number">NO: {{ $payable->document_number }}</div>
                    <div class="muted">Tempo: {{ $payable->due_date ? \Carbon\Carbon::parse($payable->due_date)->format('d/m/Y') : '-' }}</div>
                </td>
            </tr>
        </table>
        <div style="border-top: 1.5px solid #334155; margin-top: 8px;"></div>
    </header>

    <div class="info-grid">
        <div class="col col-left">
            <div class="box-title">Supplier / Penagih</div>
            <div class="supplier-name">{{ $payable->supplier->name ?? 'Tanpa Nama' }}</div>
            <div class="muted">
                {{ $payable->supplier->address ?? '-' }}<br>
                {{ $payable->supplier->phone ?? '-' }}
            </div>
        </div>

        <div class="col col-right">
            <div class="financial-summary">
                <div class="summary-row">
                    <span class="label">Total Tagihan:</span>
                    <span class="value">Rp {{ number_format($payable->total, 0, ',', '.') }}</span>
                </div>
                
                <div class="line-divider"></div>
                
                <div class="summary-row" style="color: #16a34a;">
                    <span class="label">Sudah Dibayar:</span>
                    <span class="value">(-) Rp {{ number_format($payable->paid, 0, ',', '.') }}</span>
                </div>

                <div class="line-bold"></div>

                <div class="summary-row" style="margin-top: 5px;">
                    <span class="label" style="font-weight: 700;">SISA NOTA:</span>
                    <span class="value dept" >Rp {{ number_format(max(0, $payable->total - $payable->paid), 0, ',', '.') }}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="box-title">Rincian Pembayaran</div>
    <table class="main-table">
        <thead>
            <tr>
                <th class="text-center" style="width: 30px;">No</th>
                <th>Tanggal</th>
                <th>Keterangan / Metode</th>
                <th class="text-right">Jumlah Bayar</th>
            </tr>
        </thead>
        <tbody>
            @forelse($payable->payments as $index => $pay)
                <tr>
                    <td class="text-center muted">{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($pay->paid_at)->format('d/m/Y') }}</td>
                    <td>
                        <span class="font-bold">{{ strtoupper($pay->method) }}</span>
                        @if($pay->note) <span class="muted">- {{ $pay->note }}</span> @endif
                    </td>
                    <td class="text-right font-bold">
                        Rp {{ number_format($pay->amount, 0, ',', '.') }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" class="text-center muted" style="padding: 20px;">Belum ada riwayat pembayaran.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="signature-section">
        <div class="sig-box">
            <div class="muted">Dibuat Oleh,</div>
            <div class="sig-space"></div>
            <div class="sig-line">Admin</div>
        </div>
        <div class="sig-box"></div>
        <div class="sig-box">
            <div class="muted">Hormat Kami,</div>
            <div class="sig-space"></div>
            <div class="sig-line">{{ $payable->supplier->name ?? 'Supplier' }}</div>
        </div>
    </div>

    <div class="page-footer">
        <table style="width: 100%; border:none;">
            <tr>
                <td>Dicetak pada: {{ now()->format('d/m/Y H:i') }}</td>
                <td class="text-right">
                    <img src="{{ $barcode }}" style="height: 25px; vertical-align: middle;">
                    <span style="margin-left: 8px; font-weight: 700;">{{ $payable->document_number }}</span>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>