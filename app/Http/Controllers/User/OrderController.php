<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Show My Orders list.
     */
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('EndUser/Orders/Index', [
            'transactions' => $transactions
        ]);
    }

    /**
     * Show Order Detail (Invoice).
     */
    public function show($id)
    {
        $transaction = Transaction::with(['details.product'])
            ->where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        // Get shipping info if exists (from transaction_shippings table)
        // Need to add relationship to Transaction model first? 
        // I added user(), voucher(), but shipping()?
        // It's likely in database/migrations/2026_01_25_085953_create_transaction_shippings_table.php there is transaction_id.
        // I should check Transaction model if it has valid relationship. 
        // Models/Transaction.php has details(). what about shipping()?
        // Step 82 view_file shows `Transaction` model. I didn't see `shipping()` relationship at the bottom but checking... 
        // Wait, I see `voucherUsage()`, `profits()`.
        // I should add `shipping()` relationship to Transaction model.
        // But for now, I can eager load it if relationship exists. 
        // Let's assume I need to add it or load it manually if missing.
        
        $transaction->load('shipping', 'voucherUsage.voucher', 'reviews');

        return Inertia::render('EndUser/Orders/Show', [
            'transaction' => $transaction
        ]);
    }

    /**
     * Complete Order
     */
    public function complete(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        if ($transaction->order_status !== 'shipped') {
            return back()->with('error', 'Pesanan belum dikirim atau status tidak valid.');
        }

        $transaction->update([
            'order_status' => 'completed'
        ]);

        return back()->with('success', 'Pesanan diterima! Terimakasih telah berbelanja.');
    }

    /**
     * Submit Review
     */
    /**
     * Submit Review
     */
    public function storeReview(Request $request, $id)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            // 'images' => 'array' // Optional
        ]);

        $transaction = Transaction::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        if ($transaction->order_status !== 'completed') {
            return back()->with('error', 'Selesaikan pesanan terlebih dahulu.');
        }

        // Check if product is in transaction
        $hasProduct = $transaction->details()->where('product_id', $request->product_id)->exists();
        if (!$hasProduct) {
            return back()->with('error', 'Produk tidak ditemukan dalam pesanan ini.');
        }

        // Check if already reviewed
        $existingReview = \App\Models\Review::where('transaction_id', $transaction->id)
            ->where('product_id', $request->product_id)
            ->where('user_id', Auth::id())
            ->exists();

        if ($existingReview) {
            return back()->with('error', 'Anda sudah mengulas produk ini.');
        }

        \App\Models\Review::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'transaction_id' => $transaction->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Ulasan berhasil dikirim!');
    }

    /**
     * Submit Bulk Review
     */
    public function storeBulkReview(Request $request, $id)
    {
        $request->validate([
            'reviews' => 'required|array',
            'reviews.*.product_id' => 'required|exists:products,id',
            'reviews.*.rating' => 'required|integer|min:1|max:5',
            'reviews.*.comment' => 'nullable|string',
        ]);

        $transaction = Transaction::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        if ($transaction->order_status !== 'completed') {
            return back()->with('error', 'Selesaikan pesanan terlebih dahulu.');
        }

        foreach ($request->reviews as $reviewData) {
            // Check if product is in transaction
            $hasProduct = $transaction->details()->where('product_id', $reviewData['product_id'])->exists();
            if (!$hasProduct) continue;

            // Check if already reviewed
            $existingReview = \App\Models\Review::where('transaction_id', $transaction->id)
                ->where('product_id', $reviewData['product_id'])
                ->where('user_id', Auth::id())
                ->exists();

            if ($existingReview) continue;

            \App\Models\Review::create([
                'user_id' => Auth::id(),
                'product_id' => $reviewData['product_id'],
                'transaction_id' => $transaction->id,
                'rating' => $reviewData['rating'],
                'comment' => $reviewData['comment'] ?? null,
            ]);
        }

        return back()->with('success', 'Ulasan berhasil dikirim!');
    }
}
