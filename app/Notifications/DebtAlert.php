<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DebtAlert extends Notification
{
    use Queueable;

    public $id;
    public $name;
    public $amount;
    public $type; // 'payable' or 'receivable'
    public $invoice;

    /**
     * Create a new notification instance.
     */
    public function __construct($id, $invoice, $name, $amount, $type)
    {
        $this->id = $id;
        $this->invoice = $invoice;
        $this->name = $name;
        $this->amount = $amount;
        $this->type = $type;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'inv_id' => $this->invoice,
            'name' => $this->name,
            'amt' => $this->amount,
            'type' => $this->type,
            'ref_id' => $this->id,
        ];
    }
}
