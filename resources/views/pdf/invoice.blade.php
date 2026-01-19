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
    <style>
        @page { size: 215mm 330mm; margin: 30px; }
        @font-face { font-family: 'Inter'; font-style: normal; font-weight: 400; src: url("{{ public_path('inter/Inter_24pt-Regular.ttf') }}") format('truetype') }
        @font-face { font-family: 'Inter'; font-style: normal; font-weight: 700; src: url("{{ public_path('inter/Inter_24pt-Bold.ttf') }}") format('truetype') }
        
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
        body { font-family: {!! $fontFamily !!}; margin: 0; padding: 0; color: {{ $textColor }}; background-color: #fff; line-height: 1.4; }
        
        /* Watermark */
        .watermark { position: fixed; top: 30%; left: 15%; opacity: 0.08; z-index: -1000; width: 70%; }
        
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

        /* Greeting */
        .greeting-box { margin-top: 20px; padding: 0 5px; }
        .greeting-text { font-size: 12px; color: #475569; text-align: justify; font-style: italic; border-left: 3px solid {{ $primaryColor }}; padding-left: 12px; }

        /* Main Table Items */
        .items-table{width:100%;border-collapse:separate;border-spacing:0;margin-top:20px;border-radius:8px;overflow:hidden}
        .items-table thead th { background: {{ $primaryColor }}; color: #fff; padding: 12px 10px; font-size: 11px; text-transform: uppercase; text-align: left; }
        .items-table tbody td { padding: 12px 10px; font-size: 12px; border-bottom: 1px solid #f1f5f9; }
        .items-table tbody tr:nth-child(even) { background-color: #f8fafc; }

        /* Summary */
        .summary-table { margin-top: 15px; }
        .summary-label { font-size: 12px; color: {{ $mutedColor }}; padding: 4px 0; }
        .summary-value { font-size: 13px; font-weight: 700; text-align: right; padding: 4px 0; }
        .total-row td { border-top: 2px solid {{ $textColor }}; padding-top: 10px; margin-top: 5px; }
        .total-label { font-size: 16px; font-weight: 700; }
        .total-amount { font-size: 20px; font-weight: 800; color: {{ $accentColor }}; }

        /* Footer Section */
        .footer-content { margin-top: 40px; }
        .prayer-text { font-size: 12px; font-weight: 700; text-align: center; margin-bottom: 5px; color: {{ $textColor }}; }
        .nb-text { font-size: 10px; color: {{ $accentColor }}; text-align: center; font-style: italic; margin-bottom: 25px; }
        
        .signature-table { width: 100%; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        .contact-info { font-size: 11px; color: {{ $mutedColor }}; line-height: 1.6; }
        .contact-info strong { color: {{ $textColor }}; }
        
        .signature-box { text-align: center; width: 200px; float: right; }
        .signature-name { margin-top: 120px; font-weight: 700; border-top: 1px solid {{ $textColor }}; padding-top: 5px; font-size: 13px; }
    </style>
</head>

<body>
    <!-- WATERMARK -->
    <div class="watermark">
        @php $logo = $store['logo_data'] ?: $store['logo']; @endphp
        @if($logo) <img src="{{ $logo }}" style="width: 100%;"> @endif
    </div>

    <!-- HEADER -->
    <table class="w-full header-table">
        <tr>
            <td>
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="logo-box">
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
                <span class="badge-nota">NOTA TRANSAKSI</span>
                <h2 class="invoice-number">{{ $transaction->invoice }}</h2>
                <div class="invoice-date">{{ \Carbon\Carbon::parse($transaction->created_at)->translatedFormat('d F Y H:i') }}</div>
            </td>
        </tr>
    </table>

    <!-- CUSTOMER & KASIR BOX -->
    <div class="info-container">
        <table class="w-full info-table">
            <tr>
                <td style="border-right: 1px solid #e2e8f0;">
                    <div class="info-label">Informasi Pelanggan</div>
                    <div class="info-value">{{ $transaction->customer->name ?? 'Pelanggan Umum' }}</div>
                    @if($transaction->customer?->no_telp)
                        <div class="info-subvalue">{{ $transaction->customer->no_telp }}</div>
                    @endif
                    <div class="info-subvalue">
                        {{ $transaction->customer->village_name ?? '' }} {{ $transaction->customer->regency_name ? ', '.$transaction->customer->regency_name : '' }}
                    </div>
                </td>
                <td>
                    <div class="info-label">Detail Pembayaran</div>
                    <table class="w-full" style="font-size: 12px;">
                        <tr>
                            <td style="padding:0; color:{{ $mutedColor }}">Kasir</td>
                            <td style="padding:0; text-align:right" class="font-bold">: {{ $transaction->cashier->name ?? '-' }}</td>
                        </tr>
                        <tr>
                            <td style="padding:2px 0; color:{{ $mutedColor }}">Metode</td>
                            <td style="padding:2px 0; text-align:right" class="font-bold">: {{ $transaction->payment_method }}</td>
                        </tr>
                        <tr>
                            <td style="padding:0; color:{{ $mutedColor }}">Status</td>
                            <td style="padding:0; text-align:right; color: {{ $primaryColor }}" class="font-bold">: {{ strtoupper($transaction->payment_status) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <div class="greeting-box">
        <div class="greeting-text">
            Kami Segenap tim <strong>SERDADU RIFLE INDONESIA</strong> mengucapkan terima kasih yang sebesar-besarnya atas kepercayaan Anda. Kami berkomitmen untuk selalu menjaga amanah dan kualitas layanan bagi Anda. Kami sungguh merasa sangat bahagia /senang apabila toko kami di promosikan pada komunitas atau kelompok saudara.
        </div>
    </div>

    <!-- TABLE ITEMS -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 45%;">Deskripsi Produk</th>
                <th class="text-center" style="width: 10%;">Qty</th>
                <th class="text-right" style="width: 20%;">Harga Satuan</th>
                <th class="text-right" style="width: 20%;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($transaction->details as $index => $detail)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td class="font-bold">{{ $detail->product->title ?? 'Produk' }}</td>
                    <td class="text-center">{{ $detail->qty }}</td>
                    <td class="text-right">{{ number_format($detail->price / max(1, $detail->qty), 0, ',', '.') }}</td>
                    <td class="text-right font-bold">{{ number_format($detail->price, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- CALCULATION -->
    <table class="w-full summary-table">
        <tr>
            <td style="width: 60%;">
                @if ($transaction->receivable && $transaction->receivable->due_date)
                    <div style="font-size: 11px; padding: 10px; background: #fff1f2; border-radius: 5px; color: #be123c; display: inline-block;">
                        <strong>PENTING:</strong> Jatuh tempo pembayaran pada {{ \Carbon\Carbon::parse($transaction->receivable->due_date)->format('d/m/Y') }}
                    </div>
                @endif
            </td>
            <td style="width: 40%;">
                <table class="w-full" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="summary-label">Diskon</td>
                        <td class="summary-value" style="color: {{ $primaryColor }}">- {{ number_format($transaction->discount ?? 0, 0, ',', '.') }}</td>
                    </tr>
                    <tr>
                        <td class="summary-label">Biaya Pengiriman</td>
                        <td class="summary-value">+ {{ number_format($transaction->shipping_cost ?? 0, 0, ',', '.') }}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="total-label">GRAND TOTAL</td>
                        <td class="total-amount text-right">
                            Rp {{ number_format($transaction->grand_total, 0, ',', '.') }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <!-- FOOTER -->
    <div class="footer-content">
        <div class="prayer-text">
            "SEMOGA ALLAH AKAN SELALU MELANCARKAN SEGALA URUSAN ANDA BAIK DI DUNIA DAN AKHIRAT. AAMIIN."
        </div>
        <div class="nb-text">
            * Barang yang telah dibeli tidak dapat dikembalikan / ditukar / diuangkan kembali.
        </div>

        <table class="signature-table">
            <tr>
                <td style="vertical-align: top;">
                    <div class="contact-info">
                        <strong>HUBUNGI KAMI:</strong><br>
                        ADMIN 1 : 0815-5969-2005<br>
                        ADMIN 2 : 0813-3434-5900<br>
                        WEB : WWW.SERDADURIFLE.ID
                    </div>
                    <div style="margin-top:15px;text-align:left;">
    <img src="{{ $barcode }}" alt="barcode" style="height:25px;display:block;margin:0 auto;">
    <span style="display:block;margin-top:4px;font-size:13px;color:{{ $mutedColor }};">{{ $transaction->invoice }}</span>
</div>

                </td>
                <td style="vertical-align: top;">
                    <div class="signature-box">
                        <div style="font-size: 12px; color: {{ $mutedColor }}">Hormat Kami,</div>
                        <div class="signature-name">
                            ARIEF RAHMAN HAKIM M.Pd.
                        </div>
                        <div style="font-size: 10px; color: {{ $mutedColor }};">Owner Serdadu Rifle</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>