<?php

namespace App\Console\Commands;

use App\Models\Payable;
use App\Models\Receivable;
use App\Models\Product;
use App\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class NotificationCleanup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup old notifications and trigger daily debt alerts';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService)
    {
        // 1. Prune read notifications > 30 days
        $count = DB::table('notifications')
            ->whereNotNull('read_at')
            ->where('read_at', '<', now()->subDays(30))
            ->delete();
        
        $this->info("Pruned {$count} old read notifications.");

        // 2. Prune stock alerts if stock > 0 (Restock)
        // For efficiency, we can query products with stock > 0, and delete matching notifications
        // OR simpler: Query 'StockAlert' notifications, check their JSON p_id, if product stock > 0, delete.
        // But doing this for all might be heavy?
        // Let's rely on Deduplication logic: If stock > 0, no new alert.
        // But we want to DELETE alerts if issue is resolved?
        // Brief: "Notifikasi stok akan otomatis dihapus jika stok sudah diisi kembali"
        
        $stockNotifications = DB::table('notifications')
            ->where('type', 'App\Notifications\StockAlert')
            ->get();
            
        foreach ($stockNotifications as $note) {
            $data = json_decode($note->data, true);
            if (isset($data['p_id'])) {
                $product = Product::find($data['p_id']);
                // If product deleted or stock > 0, delete notification
                if (!$product || $product->stock > 0) {
                    DB::table('notifications')->where('id', $note->id)->delete();
                }
            }
        }
        $this->info("Pruned resolved stock alerts.");

        // 3. Prune debt alerts if paid
        // Brief: "Notifikasi hutang akan otomatis dihapus jika status transaksi di tabel utama berubah menjadi 'Lunas'"
        $debtNotifications = DB::table('notifications')
            ->where('type', 'App\Notifications\DebtAlert')
            ->get();
            
        foreach ($debtNotifications as $note) {
            $data = json_decode($note->data, true);
            if (isset($data['type']) && isset($data['ref_id'])) {
                $isPaid = false;
                if ($data['type'] === 'payable') {
                    $payable = Payable::find($data['ref_id']);
                    if (!$payable || $payable->status === 'paid') $isPaid = true;
                } else {
                    $receivable = Receivable::find($data['ref_id']);
                    if (!$receivable || $receivable->status === 'paid') $isPaid = true;
                }

                if ($isPaid) {
                    DB::table('notifications')->where('id', $note->id)->delete();
                }
            }
        }
        $this->info("Pruned resolved debt alerts.");

        // 4. Trigger time-based debt alerts (H-7, H-0, etc.)
        $this->info("Checking time-based debt alerts...");
        
        // Payables
        $payables = Payable::where('status', '!=', 'paid')->whereNotNull('due_date')->get();
        foreach ($payables as $payable) {
            // Logic to check date triggers?
            // Actually, NotificationService doesn't check dates, it just sends if requested.
            // Brief says Pemicu: H-7, H-0, Overdue.
            // We can just run this daily and if condition is met, call sendDebtAlert.
            // sendDebtAlert handles deduplication. So we can just call it for ALL unpaid debts?
            // If we call it for ALL, it will update `updated_at` every day.
            // If we only want to trigger on H-7, H-0, etc, we filter:
            $daysUntil = now()->diffInDays($payable->due_date, false);
            // $daysUntil < 0 means overdue. 0 means today. 7 means next week.
            
            if ($daysUntil <= 7) {
                $notificationService->sendDebtAlert($payable, 'payable');
            }
        }

        // Receivables
        $receivables = Receivable::where('status', '!=', 'paid')->whereNotNull('due_date')->get();
        foreach ($receivables as $receivable) {
            $daysUntil = now()->diffInDays($receivable->due_date, false);
            if ($daysUntil <= 7) {
                $notificationService->sendDebtAlert($receivable, 'receivable');
            }
        }
        
        $this->info("Done.");
    }
}
