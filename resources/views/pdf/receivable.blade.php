@php
    $fontFamily = "'Inter', 'Helvetica', 'Arial', sans-serif";
    $primaryColor = "#4aa377"; // Hijau SRI
    $accentColor = "#a80000";  // Merah SRI
    $textColor = "#1e293b";
    $mutedColor = "#64748b";
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Piutang - {{ $receivable->invoice }}</title>
    <style>
        @page { size: 215mm 330mm; margin: 30px; }
        @font-face { font-family: 'Inter'; font-style: normal; font-weight: 400; src: url("{{ public_path('inter/Inter_24pt-Regular.ttf') }}") format('truetype') }
        @font-face { font-family: 'Inter'; font-style: normal; font-weight: 700; src: url("{{ public_path('inter/Inter_24pt-Bold.ttf') }}") format('truetype') }
        
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
        body { font-family: {!! $fontFamily !!}; margin: 0; padding: 0; color: {{ $textColor }}; background-color: #fff; line-height: 1.4; font-size: 12px; }
        
        /* Layout Helpers */
        .w-full { width: 100%; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        
        /* Header */
        .header-table td { vertical-align: top; }
        .logo-box { width: 70px; height: 70px; margin-right: 15px; }
        .store-name { font-size: 22px; font-weight: 700; color: {{ $textColor }}; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .store-address { font-size: 11px; color: {{ $mutedColor }}; margin-top: 4px; max-width: 350px; }
        
        .badge-nota { background: {{ $accentColor }}; color: #fff; padding:2px 15px 5px; font-size: 14px; font-weight: 700; border-radius: 4px; display: inline-block; margin-bottom: 8px; }
        .invoice-number { font-size: 35px; margin-top:-10px;margin-bottom:-10px;font-weight: 700; color: {{ $textColor }}}
        .invoice-date { font-size: 15px;color: {{ $mutedColor }}; }

        /* Info Box */
        .info-container { margin-top: 25px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .info-table { border-collapse: collapse; }
        .info-table td { padding: 12px 15px; width: 50%; vertical-align: top; }
        .info-label { font-size: 10px; text-transform: uppercase; color: {{ $mutedColor }}; font-weight: 700; margin-bottom: 4px; }
        .info-value { font-size: 13px; font-weight: 700; }
        .info-subvalue { font-size: 12px; color: {{ $mutedColor }}; margin-top: 2px; }

        /* Summary Box in Info */
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .summary-label { font-size: 12px; color: {{ $mutedColor }}; }
        .summary-val { font-size: 13px; font-weight: 700; }

        /* Main Table Items */
        .items-table{width:100%;border-collapse:separate;border-spacing:0;margin-top:20px;border-radius:8px;overflow:hidden}
        .items-table thead th { background: {{ $primaryColor }}; color: #fff; padding: 12px 10px; font-size: 11px; text-transform: uppercase; text-align: left; }
        .items-table tbody td { padding: 12px 10px; font-size: 12px; border-bottom: 1px solid #f1f5f9; }
        .items-table tbody tr:nth-child(even) { background-color: #f8fafc; }

        /* Footer Section */
        .footer-content { margin-top: 40px; }
        .signature-table { width: 100%; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        .contact-info { font-size: 11px; color: {{ $mutedColor }}; line-height: 1.6; }
        .contact-info strong { color: {{ $textColor }}; }
        
        .signature-box { text-align: center; width: 200px; float: right; }
        .signature-name { margin-top: 80px; font-weight: 700; border-top: 1px solid {{ $textColor }}; padding-top: 5px; font-size: 13px; }
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
                                <div style="background: {{ $primaryColor }}; color: white; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 20px;">
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
                <span class="badge-nota">TAGIHAN PIUTANG</span>
                <h2 class="invoice-number">{{ $receivable->invoice }}</h2>
                <div class="invoice-date">Jatuh Tempo: {{ $receivable->due_date ? \Carbon\Carbon::parse($receivable->due_date)->format('d/m/Y') : '-' }}</div>
            </td>
        </tr>
    </table>

    <!-- INFO CONTAINER -->
    <div class="info-container">
        <table class="w-full info-table">
            <tr>
                <td style="border-right: 1px solid #e2e8f0;">
                    <div class="info-label">Informasi Pelanggan</div>
                    <div class="info-value">{{ $receivable->customer->name ?? 'Pelanggan Umum' }}</div>
                    <div class="info-subvalue">
                         {{ $receivable->customer->address ?? '-' }}<br>
                        {{ $receivable->customer->phone ?? '-' }}
                    </div>
                </td>
                <td>
                    <div class="info-label">Ringkasan Tagihan</div>
                    <table class="w-full" style="font-size: 12px;">
                        <tr>
                            <td style="padding:2px 0; color:{{ $mutedColor }}">Total Tagihan</td>
                            <td style="padding:2px 0; text-align:right" class="font-bold">Rp {{ number_format($receivable->total, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td style="padding:2px 0; color:{{ $mutedColor }}">Sudah Dibayar</td>
                            <td style="padding:2px 0; text-align:right; color: {{ $primaryColor }}" class="font-bold">(-) Rp {{ number_format($receivable->paid, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td style="padding-top:8px; border-top: 1px dashed #cbd5e1; font-weight: 700;">SISA TAGIHAN</td>
                            <td style="padding-top:8px; border-top: 1px dashed #cbd5e1; text-align:right; color: {{ $accentColor }}; font-size: 14px;" class="font-bold">
                                Rp {{ number_format(max(0, $receivable->total - $receivable->paid), 0, ',', '.') }}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <div style="margin-top: 25px; margin-bottom: 10px; font-weight: 700; color: {{ $textColor }}; text-transform: uppercase; font-size: 13px;">
        Riwayat Pembayaran
    </div>

    <!-- TABLE ITEMS -->
    <table class="items-table">
        <thead>
            <tr>
                <th class="text-center" style="width: 50px;">No</th>
                <th>Tanggal Bayar</th>
                <th>Metode & Catatan</th>
                <th class="text-right">Jumlah Bayar</th>
            </tr>
        </thead>
        <tbody>
            @forelse($receivable->payments as $index => $pay)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($pay->paid_at)->format('d/m/Y H:i') }}</td>
                    <td>
                        <div class="font-bold">{{ strtoupper($pay->method ?? '-') }}</div>
                        @if($pay->note) <div style="font-size: 11px; color: {{ $mutedColor }}">{{ $pay->note }}</div> @endif
                    </td>
                    <td class="text-right font-bold">
                        Rp {{ number_format($pay->amount, 0, ',', '.') }}
                    </td>
                </tr>
             @empty
                <tr>
                    <td colspan="4" class="text-center" style="padding: 20px; color: {{ $mutedColor }}; font-style: italic;">Belum ada riwayat pembayaran.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- FOOTER -->
    <div class="footer-content">
        <table class="signature-table">
            <tr>
                <td style="vertical-align: top;">
                    <div class="contact-info">
                        <strong>HUBUNGI KAMI:</strong><br>
                        {{ $store['phone'] }}<br>
                        {{ $store['email'] }}
                    </div>
                    <div style="margin-top:15px;text-align:left;">
                        @if($barcode)
                            <img src="{{ $barcode }}" alt="barcode" style="height:25px;display:block;">
                            <span style="display:block;margin-top:4px;font-size:11px;color:{{ $mutedColor }};">{{ $receivable->invoice }}</span>
                        @endif
                    </div>
                </td>
                <td style="vertical-align: top;">
                    <div class="signature-box">
                        <div style="font-size: 12px; color: {{ $mutedColor }}">Hormat Kami,</div>
                        <div class="signature-name">
                            {{ $store['name'] }}
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>