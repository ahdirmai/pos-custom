<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class StockAlert extends Notification
{
    use Queueable;

    public $product;

    public $title;

    public $qty;

    public $level;

    /**
     * Create a new notification instance.
     */
    public function __construct($product, $title, $qty, $level = 'low')
    {
        $this->product = $product;
        $this->title = $title;
        $this->qty = $qty;
        $this->level = $level;
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
            'p_id' => $this->product->id,
            'name' => $this->title,
            'qty' => $this->qty,
            'lvl' => $this->level,
        ];
    }
}
