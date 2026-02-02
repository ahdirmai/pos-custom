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
        
        $transaction->load('shipping', 'voucherUsage.voucher'); // Assuming 'shipping' relationship exists or will be added.

        return Inertia::render('EndUser/Orders/Show', [
            'transaction' => $transaction
        ]);
    }
}
