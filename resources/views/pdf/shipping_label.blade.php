@php
    $formatPrice = fn($v) => 'Rp ' . number_format($v ?: 0, 0, ',', '.');
    $formatDate = fn($v) => \Carbon\Carbon::parse($v)->format('d M Y');
    
    // Icon User & WhatsApp (Base64)
    $iconUser = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTEyIDExYTMuNSAzLjUgMCAxIDAgMC03IDMuNSAzLjUgMCAwIDAgMCA3em0wIDJjLTMuODYgMC03IDIgLTcgNHYyYTEgMSAwIDAgMCAxIDFoMTJhMSAxIDAgMCAwIDEtMXYtMmMwLTIuMDItMy4xNC00LTctNHoiLz48L3N2Zz4=';
    $iconWA = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTEyLjA0IDJjLTUuNDYgMC05LjkxIDQuNDUtOS45MSA5LjkxIDAgMS43NS40NiAzLjQ1IDEuMzIgNC45NUwyLjA1IDIybDUuMjUtMS4zOGMxLjQ1Ljc5IDMuMDggMS4yMSA0Ljc0IDEuMjEgNS40NiAwIDkuOTEtNC40NSA5LjkxLTkuOTEgMC0yLjY1LTEuMDMtNS4xNC0yLjktNy4wMUMxNy4xOCAzLjAzIDE0LjY5IDIgMTIuMDQgMnpNMTIuMDUgMjAuMjFjLTEuNSAwLTIuOTctLjM5LTQuMjYtMS4xNWwtLjMtLjE4LTMuMTEuODIuODMtMy4wNC0uMi0uMzFjLS44Mi0xLjI3LTEuMjUtMi43Ni0xLjI1LTQuMjcgMC00LjUxIDMuNjctOC4xOCA4LjE4LTguMTggMi4xOCAwIDQuMjMuODUgNS43NyAyLjM5IDEuNTQgMS41NCAyLjM5IDMuNTkgMi4zOSA1Ljc3IDAgNC41Mi0zLjY3IDguMTUtOC4wNSA4LjE1em00LjQyLTYuMTFjLS4yNC0uMTItMS40My0uNzEtMS42NS0uNzktLjIyLS4wOC0uMzgtLjEyLS41NC4xMi0uMTYuMjQtLjYzLjc5LS43Ny45NS0uMTQuMTYtLjI5LjE4LS41My4wNi0uMjQtLjEyLTEuMDEtLjM3LTEuOTMtMS4xOS0uNzEtLjYzLTEuMTktMS40MS0xLjMzLTEuNjUtLjE0LS4yNC0uMDEtLjM3LjExLS40OC4xMS0uMTEuMjQtLjI5LjM2LS40My4xMi0uMTQuMTYtLjI0LjI0LS40LjA4LS4xNi4wNC0uMy0uMDItLjQyLS4wNi0uMTItLjU0LTEuMy0uNzQtMS43OC0uMTktLjQ3LS4zOS0uNC0uNTQtLjQxLS4xNC0uMDEtLjMtLjAxLS40Ni0uMDEtLjE2IDAtLjQyLjA2LS42NC4zLS4yMi4yNC0uODUuODMtLjg1IDIuMDIgMCAxLjE5Ljg3IDIuMzMuOTkgMi40OS4xMi4xNiAxLjcxIDIuNjEgNC4xNCAzLjY2IDEuNjMuNyAxLjk2LjU2IDIuNjYuNTIuNzgtLjA0IDEuNDMtLjU5IDEuNjMtMS4xNS4yLS41Ni4yLTEuMDQuMTQtMS4xNS0uMDYtLjExLS4yMi0uMTctLjQ2LS4yOXoiLz48L3N2Zz4=';
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        @page{margin:0;size:425.2pt 283.5pt}body{font-family:'Helvetica',sans-serif;margin:0;padding:0;width:425.2pt;height:283.5pt;color:#000}.container{padding:12pt;position:relative;height:259pt;box-sizing:border-box}table{width:100%;border-collapse:collapse;table-layout:fixed}td{vertical-align:top;overflow:hidden}.header{width:100%;table-layout:auto!important;margin-bottom:5pt}.header td{vertical-align:middle;padding:0 4pt}.logo-box{display:block;margin:0;padding:0}.divider{border-top:1px solid #000;margin:8pt 0}.section-box{border:1px solid #000;border-radius:6pt;padding:6pt;height:65pt}.title-label{font-size:7pt;text-transform:uppercase;color:#000;font-weight:700;margin-bottom:3pt}.text-bold{font-size:10pt;font-weight:700}.text-small{font-size:9pt;line-height:1.2}.text-muted{color:#000;font-size:8pt}.footer-absolute{position:absolute;bottom:15pt;left:15pt;right:15pt;border-top:1px solid #000;padding-top:8pt}.barcode-container{text-align:right;width:220pt;float:right}.barcode-img{height:35pt;width:100%;max-width:220pt;display:block;margin-left:auto}.invoice-number{font-size:8pt;font-weight:700;letter-spacing:2pt;margin-top:5pt;color:#000;text-align:center}ul{margin:0;padding-left:12pt}li{font-size:8pt;margin-bottom:2pt}.unboxing-wrapper{border:1.5px solid #000;border-radius:4px;overflow:hidden;width:100%;box-sizing:border-box}.unboxing-header{background-color:#000;color:#fff;font-size:8pt;font-weight:700;text-align:center;padding:3pt 0;text-transform:uppercase;letter-spacing:.5pt}.unboxing-content{padding:4pt 6pt;text-align:left;background-color:#fff}.warning-text{font-size:7pt;line-height:1.3;color:#000;font-weight:500}.icon-img{width:9pt;height:9pt;display:inline-block;vertical-align:middle;margin-right:1pt;margin-bottom:1.5pt;margin-top:3.5pt;}
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <table class="header">
            <tr>
                <td style="padding-right:0pt;">
                    <div class="logo-box" style="width:40pt;height:40pt;">
                        @if ($store['logo_data'] ?? false)
                            <img src="{{ $store['logo_data'] }}" style="max-width:40pt;max-height:40pt;object-fit:contain;">
                        @else
                            <div style="width:40pt;height:40pt;border:1px solid #e2e8f0;line-height:40pt;text-align:center;font-weight:700;font-size:17pt;">
                                {{ substr($store['name'], 0, 2) }}
                            </div>
                        @endif
                    </div>
                </td>
                <td style="text-align:left;transform:translateX(-15px);">
                    <div class="text-bold" style="font-size:13pt;line-height:1.1;">{{ $store['name'] }}</div>
                    <div class="text-small text-muted" style="margin-top:3pt;font-size:7pt;">{{ Str::limit($store['address'], 60) }}</div>
                    <div class="text-small text-muted" style="margin-top:2pt;letter-spacing:0.7pt;">
                        {{ $store['phone'] }}@if ($store['phone'] && $store['email']) | @endif{{ $store['email'] }}
                    </div>
                </td>
                <td width="180pt" style="text-align:right;vertical-align:top;">
                    <div class="text-muted" style="font-size:7pt;">INVOICE</div>
                    <div class="text-bold" style="font-size:20pt;color:#000;line-height:1.1;">{{ $transaction->invoice }}</div>
                    <div class="text-small">{{ $formatDate($transaction->created_at) }}</div>
                </td>
            </tr>
        </table>

        <div class="divider"></div>

        <!-- INFO PENERIMA & RINGKASAN -->
        <table>
            <tr>
                <td style="padding-right:5pt;width:65%;">
                    <div class="section-box">
                        <div class="title-label">Penerima</div>
                        <div class="text-bold">
                            <img src="{{ $iconUser }}" class="icon-img" alt="user">
                            <span style="vertical-align:middle;">{{ $transaction->customer->name ?? 'Umum' }}</span>
                            <span class="text-small" style="font-weight:700;font-size:9pt;margin-left:6pt;">
                                <img src="{{ $iconWA }}" class="icon-img" alt="wa">
                                <span style="vertical-align:middle;">{{ $transaction->customer->no_telp ?? '-' }}</span>
                            </span>
                        </div>
                        <div class="text-small" style="margin-top:4pt;">
                            {{ Str::limit($transaction->customer->address ?? 'No Address', 80) }}
                        </div>
                        <div class="text-small text-muted" style="margin-top:2pt;">
                            {{ $transaction->customer->village_name ?? '-' }}
                            @if ($transaction->customer->district_name), {{ $transaction->customer->district_name }}@endif
                            @if ($transaction->customer->regency_name), {{ $transaction->customer->regency_name }}@endif
                            @if ($transaction->customer->province_name), {{ $transaction->customer->province_name }}@endif
                        </div>
                    </div>
                </td>
                <td style="padding-left:5pt;width:35%;">
                    <div class="section-box">
                        <div class="title-label">Ringkasan Pesanan</div>
                        <table class="text-small">
                            <tr>
                                <td>Total Item</td>
                                <td style="text-align:right;">{{ $transaction->details->count() }} unit</td>
                            </tr>
                            <tr>
                                <td style="padding-top:15pt;" class="text-bold">Total</td>
                                <td style="padding-top:15pt;text-align:right;" class="text-bold">{{ $formatPrice($transaction->grand_total) }}</td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
        </table>

        <!-- DAFTAR PRODUK & NOTICE UNBOXING -->
        <table style="margin-top:8pt;width:100%;">
            <tr>
                <td style="vertical-align:top;padding-right:8pt;">
                    <div class="title-label">Daftar Produk</div>
                    <div style="height:55pt;overflow:hidden;">
                        <ul>
                            @foreach ($transaction->details->take(3) as $detail)
                                <li>{{ Str::limit($detail->product->title, 35) }} ({{ $detail->qty }}x)</li>
                            @endforeach
                        </ul>
                    </div>
                </td>
                <td style="width:220pt;vertical-align:top;padding-right:5pt;">
                    <div class="unboxing-wrapper">
                        <div class="unboxing-header">WAJIB VIDEO UNBOXING</div>
                        <div class="unboxing-content">
                            <div class="warning-text">
                                <b>1.</b> Rekam video utuh paket saat dibuka tanpa jeda.<br>
                                <b>2.</b> Tanpa video unboxing, komplain ditolak.<br>
                                <b>3.</b> Maksimal untuk komplain 1x24 jam.
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- FOOTER -->
        <div class="footer-absolute">
            <table style="table-layout:auto;">
                <tr>
                    <td class="text-muted" style="vertical-align:bottom;padding-bottom:2pt;line-height:1.5;">
                        Admin: <strong>{{ $transaction->cashier->name ?? '-' }}</strong><br>
                        Dicetak: {{ now()->format('d/m/Y H:i') }}
                    </td>
                    <td style="text-align:right;width:220pt;padding:0;">
                        <div class="barcode-container">
                            <img src="{{ $barcode }}" class="barcode-img" alt="barcode">
                            <div class="invoice-number">{{ $transaction->invoice }}</div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>