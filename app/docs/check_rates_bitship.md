# Biteship Check Rates Documentation

Dokumen ini menjelaskan teknis implementasi fitur **Cek Ongkos Kirim** menggunakan layanan Biteship.

---

## 1. Overview

Fitur ini digunakan untuk mendapatkan estimasi biaya pengiriman dari berbagai kurir berdasarkan:
- Lokasi asal (Toko/Gudang)
- Lokasi tujuan (Pelanggan)
- Berat dan dimensi barang
- Daftar kurir yang aktif

## 2. Implementation Details

Logika utama ditangani oleh class `App\Services\BiteshipService`.

### Method: `checkRates`

Method ini mempersiapkan payload dan memanggil API Biteship endpoint `/v1/rates/couriers`.

#### Input Parameters (`$destinationDTO`, `$items`)

1.  **`$destinationDTO`** (Array): Data lokasi tujuan.
    - `postal_code` (Required): Kode pos tujuan.
    - `latitude` (Optional): Untuk akurasi lebih tinggi.
    - `longitude` (Optional).

2.  **`$items`** (Array): Daftar barang dalam keranjang.
    - `name`: Nama produk.
    - `value`: Harga per item.
    - `weight`: Berat dalam gram.
    - `quantity`: Jumlah item.

#### Configuration (Dynamic Settings)

- **Origin**: Diambil dari database setting `shop_postal_code`.
- **Couriers**: Diambil dari tabel `shipping_couriers` (hanya yang `is_active = true`).

---

## 3. API Request Structure (Internal -> Biteship)

Berikut adalah struktur payload yang dikirimkan sistem ke API Biteship:

```json
POST https://api.biteship.com/v1/rates/couriers
Authorization: <BITESHIP_API_KEY>
Content-Type: application/json

{
  "origin_postal_code": "12345",
  "destination_postal_code": "54321",
  "couriers": "jne,jnt,sicepat",
  "items": [
    {
      "name": "Product A",
      "value": 150000,
      "weight": 200,
      "quantity": 1
    }
  ]
}
```

---

## 4. Response Structure

Format response yang diharapkan dari Biteship (success):

```json
{
  "success": true,
  "object": "shipping_rate",
  "pricing": [
    {
      "available_for_cash_on_delivery": false,
      "available_for_proof_of_delivery": false,
      "available_for_instant_waybill_id": true,
      "company": "jne",
      "courier_name": "JNE",
      "courier_code": "jne",
      "courier_service_name": "Reguler",
      "courier_service_code": "reg",
      "description": "JNE Reguler",
      "duration": "1 - 2 days",
      "shipment_duration_range": "1 - 2",
      "shipment_duration_unit": "days",
      "service_type": "standard",
      "shipping_type": "parcel",
      "price": 10000,
      "type": "reg"
    },
    {
      "company": "sicepat",
      "courier_name": "SiCepat",
      "courier_code": "sicepat",
      "courier_service_name": "REG",
      "courier_service_code": "reg",
      "price": 11000,
      "duration": "1 - 2 days"
    }
  ]
}
```

### Error Handling

Jika terjadi kegagalan, `BiteshipService` akan mengembalikan array error:

```php
[
    'error' => 'Pesan error yang menjelaskan penyebab kegagalan.'
]
```

## 5. Notes

- **Unit Berat**: Pastikan semua berat dikonversi ke **Gram** sebelum dikirim ke service.
- **Fallback**: Jika tidak ada kurir yang aktif di database, sistem default menggunakan string `'biteship'` (semua kurir).