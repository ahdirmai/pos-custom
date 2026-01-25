# Voucher System Database Integration Brief

## 1. Existing Database Analysis
Based on the analysis of the current `app/Models` directory, here is how the new Voucher system will integrate:

- **Transaction (`transactions` table)**: Currently tracks `discount`, `grand_total`, `shipping_cost`.
    - *Sync Strategy*: The `discount` column will store the total deducted amount. We need a way to link which voucher caused this discount.
- **Customer (`customers` table)**: Used for attributing transactions.
    - *Sync Strategy*: Essential for implementing `max_usage_per_user` limits.
- **Product (`products` table)**: Contains `category_id`, `buy_price`, `sell_price`.
    - *Sync Strategy*: Needed for "Product-specific" vouchers.
- **Cart (`carts` table)**: Temporary holding specific to a cashier/user.
    - *Sync Strategy*: Validation logic checks active cart items against voucher rules (Min spend, active products) before determining eligibility.

## 2. Proposed Schema Extension

### A. New Model: `Voucher`
Represents the discount campaign rules.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | bigInteger | PK |
| `code` | string | Unique code (e.g., 'SALE2026'). Indexed. |
| `name` | string | Internally descriptive name. |
| `discount_target` | enum | `subtotal` (Total Belanjaan sebelum ongkir), `shipping` (Ongkir). |
| `discount_type` | enum | `fixed` (Nominal tetap), `percentage` (Persen). |
| `amount` | decimal | The value (e.g., 10 for 10% or 10000 for Rp10k). |
| `min_spend` | decimal | Nullable. Minimum subtotal required. |
| `max_discount`| decimal | Nullable. Cap for percentage discounts. |
| `quota` | integer | Global usage limit. |
| `used_count` | integer | Counter for usages (cached for atomic updates). |
| `limit_per_user`| integer | Nullable. Max times a single customer can use it. |
| `start_date` | datetime | Validity start. |
| `end_date` | datetime | Validity end. |
| `is_active` | boolean | Kill switch. |
| `applicable_products`| json | Nullable. Array of Product IDs or Category IDs (Only if needed for specific product restrictions, otherwise applies to subtotal). |

### B. New Model: `VoucherUsage`
Links a transaction to a voucher usage, verifying the "quota" consumption.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | bigInteger | PK |
| `voucher_id` | bigInteger | FK -> vouchers.id |
| `transaction_id`| bigInteger | FK -> transactions.id |
| `customer_id` | bigInteger | FK -> customers.id (Nullable if anonymous) |
| `discount_amount`| decimal | Snapshot of how much was saved in this tx. |
| `used_at` | datetime | Timestamp. |

## 3. Synchronization Logic (Business Flow)

### Scenario: Checkout Process
1.  **Validation (Pre-Calculation)**
    - Frontend sends `voucher_code` + `cart_items`.
    - Backend looks up `Voucher`:
        - check `is_active`, `start_date`, `end_date`.
        - check `quota > used_count`.
        - check `cart_total >= min_spend`.
        - check User History: `VoucherUsage::where('customer_id', $user)->count() < limit_per_user`.
    - Backend returns `discount_nominal`.

2.  **Transaction Commit (Atomic Sync)**
    - Inside `DB::transaction(function() { ... })`:
    - **Lock Voucher**: `Voucher::lockForUpdate()->find($id)`.
    - **Re-Verify Quota**: Ensure stock didn't run out during the click.
    - **Create Transaction**:
        - `discount` = Calculated voucher amount.
        - `grand_total` = Subtotal - Discount + Shipping.
    - **Create VoucherUsage**: Record the specific usage.
    - **Update Voucher**: Increment `used_count` (or decrement `quota`).
    - **Commit**.

## 4. Required Relationships in Existing Models

**In `App\Models\Transaction`**
```php
public function voucherUsage()
{
    return $this->hasOne(VoucherUsage::class);
}

public function voucher() // Optional shorthand
{
    return $this->hasOneThrough(Voucher::class, VoucherUsage::class);
}
```

**In `App\Models\Customer`**
```php
public function voucherUsages()
{
    return $this->hasMany(VoucherUsage::class);
}
```
