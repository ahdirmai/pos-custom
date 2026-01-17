# Fitur Laporan PPh Pasal 23 (Multi-Item Transaksi)

## I. Brief Pengembangan

### 1. Pendahuluan
Fitur ini dirancang untuk mendeteksi secara otomatis objek pajak PPh Pasal 23 (jasa) di dalam transaksi yang terdiri dari banyak item (barang & jasa). Fokus utama adalah pemisahan data administratif untuk pelaporan tanpa mengubah total tagihan pada modul kasir.

### 2. Tujuan
*   Memilah item jasa dari transaksi campuran di aplikasi POS.
*   Menghitung Dasar Pengenaan Pajak (DPP) khusus untuk item jasa.
*   Menentukan tarif pajak (2% atau 4%) berdasarkan kelengkapan data NPWP pelanggan secara otomatis.

### 3. Penyesuaian Struktur Data

#### A. Tabel `products` (Identifikasi)
Menambahkan flag untuk menandai item yang merupakan objek PPh 23.
*   `is_pph23` (Boolean): Default `false`.

#### B. Tabel `customers` (Validasi Tarif)
Menambahkan data pendukung untuk menentukan tarif final.
*   `npwp` (String, Nullable): Jika diisi, tarif PPh 23 = **2%**. Jika kosong, tarif = **4%**.

#### C. Tabel `transaction_details` (Integritas Data)
Memastikan harga jasa terkunci saat transaksi terjadi.
*   `price`: Menggunakan harga jual saat transaksi (bukan harga produk terbaru di tabel product) untuk akurasi laporan historis.

### 4. Alur Kerja Sistem (Logic)
1.  **Penyaringan Data:** Sistem memindai seluruh `transaction_details`. Hanya item dengan `product.is_pph23 = true` yang akan dihitung nilainya.
2.  **Kalkulasi per Invoice:** Jika dalam 1 invoice terdapat 2 item barang dan 1 item jasa, maka hanya 1 item jasa tersebut yang diambil nilainya sebagai **DPP Jasa**.
3.  **Penentuan Tarif:**
    *   Cek relasi `customer_id` pada transaksi.
    *   Jika `npwp` pelanggan ada -> Gunakan tarif 2%.
    *   Jika `npwp` tidak ada/pelanggan umum -> Gunakan tarif 4%.

### 5. Spesifikasi Tampilan Laporan (UI)
Laporan harus menyajikan data secara transparan per invoice agar mudah diaudit.

| Kolom | Deskripsi |
| :--- | :--- |
| **No. Invoice** | Nomor referensi transaksi di POS. |
| **Nama Pelanggan** | Nama pelanggan (atau 'Umum' jika tidak terdaftar). |
| **Item Jasa** | List nama-nama produk yang ditandai `is_pph23` dalam invoice tersebut. |
| **Total DPP Jasa** | Penjumlahan (Harga x Qty) hanya untuk item jasa. |
| **Tarif** | 2% atau 4% (Otomatis berdasarkan NPWP). |
| **Estimasi PPh 23** | Hasil perhitungan (Total DPP Jasa * Tarif). |

### 6. Contoh Skenario Transaksi Multi-Item
**Invoice INV-001:**
*   Produk A (Barang): Rp100.000 (`is_pph23`: false)
*   Produk B (Jasa): Rp500.000 (`is_pph23`: true)
*   **Total Transaksi di Kasir:** Rp600.000

**Hasil di Laporan PPh 23:**
*   **DPP Jasa:** Rp500.000
*   **PPh 23 (2%):** Rp10.000
*   *(Barang senilai Rp100.000 diabaikan dari laporan ini).*

### 7. Batasan Pengembangan
*   Laporan tidak mengubah nilai transaksi yang sudah terekam (*Read-only report*).
*   Laporan bersifat bantuan administratif (*Internal Record*).

---

## II. Dokumentasi Teknis

### 1. Skema Database (Migrations)
Gunakan perintah ini untuk menambahkan kolom yang diperlukan pada tabel yang sudah ada.

```php
// Migration untuk tabel products
Schema::table('products', function (Blueprint $table) {
    $table->boolean('is_pph23')->default(false)->after('price');
});

// Migration untuk tabel customers
Schema::table('customers', function (Blueprint $table) {
    $table->string('npwp', 20)->nullable()->after('name');
});
```

### 2. Controller & Query Logic
Controller ini bertugas memfilter hanya transaksi yang mengandung item jasa, kemudian menghitung DPP (Dasar Pengenaan Pajak) secara terpisah dari item barang lainnya.

```php
namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PphReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $reports = Transaction::with(['customer', 'details.product'])
            // Hanya ambil transaksi yang mengandung minimal satu produk PPh 23
            ->whereHas('details.product', function ($query) {
                $query->where('is_pph23', true);
            })
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($transaction) {
                // Filter detail untuk hanya mengambil item jasa
                $serviceItems = $transaction->details->filter(function ($detail) {
                    return $detail->product->is_pph23 === true;
                });

                // Hitung total DPP Jasa (Qty * Price saat transaksi)
                $totalDppJasa = $serviceItems->sum(function ($item) {
                    return $item->price * $item->quantity;
                });

                // Logic Tarif: 2% jika ada NPWP, 4% jika tidak ada
                $hasNpwp = !empty($transaction->customer->npwp);
                $rate = $hasNpwp ? 0.02 : 0.04;

                return [
                    'id' => $transaction->id,
                    'date' => $transaction->created_at->format('Y-m-d'),
                    'invoice_number' => $transaction->invoice_number,
                    'customer_name' => $transaction->customer->name ?? 'Umum',
                    'npwp' => $transaction->customer->npwp ?? '-',
                    'service_names' => $serviceItems->pluck('product.name')->implode(', '),
                    'total_dpp_jasa' => $totalDppJasa,
                    'tax_rate' => ($rate * 100) . '%',
                    'pph23_amount' => $totalDppJasa * $rate,
                ];
            });

        return Inertia::render('Reports/Pph23', [
            'reports' => $reports,
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }
}
```

### 3. Penjelasan Query & Filtering
*   **`whereHas`**: Memastikan transaksi "Belanja Kopi" (yang isinya hanya barang) tidak masuk ke laporan pajak ini.
*   **`filter` di dalam map**: Walaupun dalam satu invoice ada 10 item, filter ini memastikan kita hanya menghitung 1-2 item yang memang ditandai sebagai Jasa.
*   **Snap Price**: Menggunakan `$item->price` dari tabel detail transaksi, bukan dari tabel produk, untuk menjaga akurasi laporan historis jika terjadi perubahan harga di masa depan.

### 4. Struktur Output JSON untuk Frontend (React)
Hasil dari query di atas akan dikirim ke React dengan format seperti ini:

```json
{
  "invoice_number": "INV-2026-001",
  "customer_name": "PT Maju Terus",
  "service_names": "Jasa Instalasi, Jasa Maintenance",
  "total_dpp_jasa": 1500000,
  "tax_rate": "2%",
  "pph23_amount": 30000
}
```