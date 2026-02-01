<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentProofController extends Controller
{
    /**
     * Upload payment proof for a transaction
     */
    public function upload(Request $request, $transactionId)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            DB::beginTransaction();

            // Find transaction and verify ownership
            $transaction = Transaction::where('id', $transactionId)
                ->where('user_id', Auth::id())
                ->where('payment_method', 'manual_transfer')
                ->firstOrFail();

            // Only allow upload if no payment proof yet or still pending
            if ($transaction->payment_proof && $transaction->payment_status !== 'pending') {
                return back()->withErrors(['error' => 'Bukti pembayaran sudah diupload dan sedang diproses.']);
            }

            // Delete old proof if exists
            if ($transaction->payment_proof) {
                \Storage::disk('public')->delete($transaction->payment_proof);
            }

            // Store new payment proof
            $paymentProofPath = $request->file('payment_proof')->store('payment_proofs', 'public');

            // Update transaction
            $transaction->update([
                'payment_proof' => $paymentProofPath,
            ]);

            DB::commit();

            return back()->with('success', 'Bukti pembayaran berhasil diupload. Pembayaran Anda sedang diverifikasi.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Gagal mengupload bukti pembayaran: '.$e->getMessage()]);
        }
    }
}
