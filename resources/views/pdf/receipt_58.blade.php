@php
    // Helper format currency sederhana
    $formatPrice = fn($v) => 'Rp ' . number_format($v ?? 0, 0, ',', '.');
    
    // Hitung-hitungan
    $subtotal = ($transaction->grand_total ?? 0) + ($transaction->discount ?? 0);
    $discount = $transaction->discount ?? 0;
    $grandTotal = $transaction->grand_total ?? 0;
    $cash = $transaction->cash ?? 0;
    $change = $transaction->change ?? 0;
    $paymentMethod = strtoupper($transaction->payment_method ?? 'TUNAI');
@endphp

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Struk Belanja {{ $transaction->invoice }}</title>
    <style>
/* ===========================
   SETTING THERMAL 58MM
=========================== */
@page { 
    margin: 0;
    size: 58mm auto;
}

/* Reset */
* {
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    background: #fff;
}

/* Body utama */
body { 
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    line-height: 1.25;
    color: #000;

    /* Area cetak aman */
    width: 48mm;
    margin: 0 auto;
    padding: 20px;
}

/* Helpers */
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-bold { font-weight: bold; }
.uppercase { text-transform: uppercase; }

/* Divider */
.divider {
    border-bottom: 1px dashed #000;
    margin: 6px 0;
}
.divider-solid {
    border-bottom: 1px solid #000;
    margin: 6px 0;
}

/* Header */
.store-name { 
    font-size: 15px; 
    margin-bottom: 2px; 
}
.store-info { 
    font-size: 11px; 
}

/* Meta */
.meta-table { 
    width: 100%; 
    font-size: 11px; 
    border-collapse: collapse; 
}
.meta-table td { 
    padding: 1px 0; 
}

/* Items */
.item-table { 
    width: 100%; 
    border-collapse: collapse; 
}
.item-table td { 
    vertical-align: top; 
    padding: 2px 0; 
}

.item-name { 
    display: block; 
    font-weight: bold; 
    margin-bottom: 1px; 
    word-break: break-word;
}

.item-calc { 
    font-size: 11px; 
}

/* Total */
.total-section { 
    width: 100%; 
}

.total-row { 
    display: table;
    width: 100%;
}

.total-row span {
    display: table-cell;
}

.total-row span:last-child {
    text-align: right;
}

.grand-total { 
    font-size: 14px; 
    margin: 6px 0; 
    border-top: 1px dashed #000; 
    border-bottom: 1px dashed #000; 
    padding: 4px 0; 
}

/* Footer */
.barcode { 
    margin-top: 10px; 
}
.barcode img { 
    height: 38px; 
    max-width: 100%; 
}

.footer-msg { 
    margin-top: 6px; 
    font-size: 11px; 
    font-style: italic; 
}
@media print {
    body { -webkit-print-color-adjust: exact; }
}

</style>

</head>
<body onload="window.print()"> <!-- Otomatis print saat dibuka -->

    <!-- Header Toko -->
    <div class="text-center">
        <div class="store-name text-bold uppercase">{{ $store['name'] }}</div>
        <div class="store-info">
            @if(!empty($store['address'])){{ $store['address'] }}<br>@endif
            @if(!empty($store['phone']))Telp: {{ $store['phone'] }}<br>@endif
        </div>
    </div>

    <div class="divider-solid"></div>

    <!-- Info Transaksi -->
    <table class="meta-table">
        <tr>
            <td width="30%">No. Trx</td>
            <td class="text-right text-bold">{{ $transaction->invoice }}</td>
        </tr>
        <tr>
            <td>Tanggal</td>
            <td class="text-right">{{ \Carbon\Carbon::parse($transaction->created_at)->format('d/m/Y H:i') }}</td>
        </tr>
        <tr>
            <td>Kasir</td>
            <td class="text-right">{{ Str::limit($transaction->cashier->name ?? '-', 15) }}</td>
        </tr>
        <tr>
            <td>Pelanggan</td>
            <td class="text-right">{{ Str::limit($transaction->customer->name ?? 'Umum', 15) }}</td>
        </tr>
    </table>

    <div class="divider"></div>

    <!-- Daftar Item -->
    <table class="item-table">
        @foreach($transaction->details as $item)
            @php
                $qty = max(1, $item->qty);
                $totalLine = $item->price; 
                $unitPrice = $qty ? ($totalLine / $qty) : $totalLine;
            @endphp
            <tr>
                <td colspan="2">
                    <span class="item-name">{{ $item->product->title ?? 'Item Terhapus' }}</span>
                </td>
            </tr>
            <tr>
                <td class="item-calc">
                    {{ $qty }} x {{ $formatPrice($unitPrice) }}
                </td>
                <td class="text-right text-bold">
                    {{ $formatPrice($totalLine) }}
                </td>
            </tr>
        @endforeach
    </table>

    <div class="divider"></div>

    <!-- Kalkulasi Total -->
    <div class="total-section">
        <div class="total-row">
            <span>Subtotal</span>
            <span>{{ $formatPrice($subtotal) }}</span>
        </div>
        
        @if($discount > 0)
        <div class="total-row">
            <span>Diskon</span>
            <span>-{{ $formatPrice($discount) }}</span>
        </div>
        @endif

        <div class="total-row grand-total text-bold">
            <span>TOTAL</span>
            <span>{{ $formatPrice($grandTotal) }}</span>
        </div>

        <div class="total-row">
            <span>Bayar ({{ $paymentMethod }})</span>
            <span>{{ $formatPrice($cash) }}</span>
        </div>
        
        @if($change > 0)
        <div class="total-row text-bold">
            <span>Kembali</span>
            <span>{{ $formatPrice($change) }}</span>
        </div>
        @endif
    </div>

    <div class="divider-solid"></div>

    <!-- Footer / Barcode -->
    <div class="text-center">
        @if(isset($barcode))
            <div class="barcode">
                <img src="{{ $barcode }}" alt="barcode scan">
            </div>
            <div style="font-size:10px; letter-spacing:1px;margin-top:5px">{{ $transaction->invoice }}</div>
        @endif
        
        <div class="footer-msg">
            Terima Kasih atas kunjungan Anda!<br>
            <i>Simpan struk ini sebagai bukti pembayaran.</i>
        </div>
    </div>

</body>
</html>