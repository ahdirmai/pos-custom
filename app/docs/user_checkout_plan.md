# Development Plan: User Checkout & Payment (Single Vendor)

**Goal**: Enable Self-Checkout for customers without disrupting the existing POS (Admin) logic.
**Architecture**: Use the existing `transactions` table but enhance it to support "Online Orders" status and nullable cashier.

## Phase 1: Foundation & Data Structure (Backend)
**Objective**: Enable saving "Online Orders" to the database.

1.  **Database Migration**:
    *   Modify `transactions` table:
        *   Make `cashier_id` nullable (Online orders don't have a cashier).
        *   Add `order_status` column: `['pending', 'processing', 'shipped', 'completed', 'cancelled']`.
        *   Add `shipping_address` (Text/JSON) and `tracking_number`.
    *   Ensure `payment_status` and `payment_method` are leveraged correctly.

2.  **Controller Refactoring**:
    *   Split `User\HomeController` logic.
    *   Create `User\CheckoutController`: Handle Cart validation, Shipping calculation (RajaOngkir), and Order Store.
    *   Create `User\OrderController`: Handle "My Orders" list and specific Order details (Invoice).

3.  **Checkout Logic Implementation**:
    *   **Input**: Customer Address, Courier selection.
    *   **Process**: Calculate Grand Total (Items + Shipping).
    *   **Output**: Create `Transaction` record with `order_status='pending'`, `payment_status='unpaid'` (for Transfer) or `pending` (for Gateway).
    *   **Inventory**: Deduct stock immediately (or reserve it).

## Phase 2: Payment & Customer Flow
**Objective**: Allow users to complete payment and view their history.

1.  **Payment Integration**:
    *   **Option A (Simpler)**: Manual Bank Transfer.
        *   User sees Bank Accounts (from `payment_settings`).
        *   User uploads "Payment Proof".
        *   Admin acts as "Cashier" to verify and mark as Paid.
    *   **Option B (Advanced)**: Payment Gateway (Midtrans/Xendit).
        *   Auto-update `payment_status` via Webhook.

2.  **Order History Page (`User\OrderController`)**:
    *   Replace dummy data in `Profile/Index.jsx` with `Transaction::where('customer_id', auth()->id())->latest()->get()`.
    *   Show status badges (`Belum Bayar`, `Diproses`, etc.).

3.  **PDF/Invoice**:
    *   Adapt existing Admin Invoice PDF for Customer download.

## Phase 3: Post-Purchase & Optimization
**Objective**: Enhance retention and operations.

1.  **Product Reviews**:
    *   Implement the Review mechanism (as per `product_review_brief.md`).
    *   Only allow reviews for `order_status='completed'`.

2.  **Notifications**:
    *   Email/WhatsApp to Customer when `status` changes (e.g., "Pesanan Dikirim").
    *   Notification to Admin when "New Order" arrives.

3.  *   **Admin Dashboard Update**:
        *   Create "Online Orders" view.
        *   **Action**: Admin inputs **Resi (Tracking Number)** to change status to `shipped`.
        *   **Action**: Admin updates status (`processing`, `completed`) manually or via buttons.

---

## Audit of Existing `App\Http\Controllers\User`

| Controller | Status | Note |
| :--- | :--- | :--- |
| `HomeController.php` | **Overloaded** | Contains Logic for `index`, `search`, `products`, `checkout`, `invoice`, `profile` (orders). **Recommendation**: Refactor into dedicated controllers (`ProductController`, `CheckoutController`, `OrderController`). |
| `products()` method | **Basic** | Currently updated to Real Data (Phase 0). Needs Filter logic. |
| `checkout()` | **Dummy** | Returns static view. Logic needs to move to `CheckoutController::store`. |
| `invoice($id)` | **Dummy** | Returns static view. Logic needs to fetch `Transaction::find($id)`. |
| `profile()` | **Dummy** | Returns static user/order data. Needs to fetch real `Auth::user()` and Relations. |
