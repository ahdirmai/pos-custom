# Development Plan: Single Vendor Online Store

**Target**: Transform the POS system into a functional Single-Vendor Online Store.
**Key Constraint**: Do not disrupt existing POS logic.
**Key Logic**: Admin handles Resi input and Status updates.

## Phase 1: Checkout & Order Foundation
**Goal**: Customers can complete a "Real" checkout, saving orders to the database.

### 1.1 Database Schema
*   **Modify `transactions` table**:
    *   `cashier_id`: Change to **Nullable** (Online orders have no cashier initially).
    *   `order_status`: Add column (enum: `pending`, `paid`, `processing`, `shipped`, `completed`, `cancelled`).
    *   `tracking_number`: Add column (string, nullable) -> **For Admin Input**.
    *   `shipping_address`: Add column (text/json).
    *   `shipping_courier`: Add column (string).
    *   `shipping_cost`: Ensure exists.
    *   `voucher_id`: Add column (nullable) for tracking used voucher.
*   **New Tables (Implemented)**:
    *   `vouchers`, `voucher_usages` (For Discount System).
    *   `shipping_couriers`, `transaction_shippings` (For Biteship Integration).

### 1.2 Backend Logic (New Controllers)
*   **`User\CheckoutController`**:
    *   `store`: Validate stock, **Validate Voucher**, **Check Shipping (Biteship)**, create `Transaction` with status `pending`.
*   **`User\OrderController`**:
    *   `index`: Customer's "My Orders" list.
    *   `show`: Customer's Order Detail (Invoice).
*   **`Services\BiteshipService`**:
    *   `checkRates()`: Fetch shipping costs from Biteship API (Implemented).
*   **`Services\VoucherService`**:
    *   Validate and Calculate Discount logic.

### 1.3 Frontend (Customer)
*   **Checkout Page**:
    *   Integrate RajaOngkir/**Biteship** API for Province/City selection & Cost calculation.
    *   **Voucher Input**: Field to apply discount code.
    *   Interact with `CheckoutController` to submit real order.
*   **Success Page**: Redirect to real Invoice page after success.

## Phase 2: Payment & Fulfillment (Admin Logic)
**Goal**: Admin manages the order lifecycle (Payment -> Shipping).

### 2.1 Payment System
*   **Manual Transfer**:
    *   Customer sees Bank info.
    *   Customer uploads "Proof of Payment" (Image).
    *   Admin verifies and updates status `pending` -> `paid`.

### 2.2 Admin Dashboard (Online Orders)
*   **New Menu**: "Pesanan Online" (Filtered `transactions` where `cashier_id` is NULL).
*   **Detail View**:
    *   View Customer Info & Payment Proof.
    *   **View Shipping Info**: Courier, Service, Cost.
*   **Actions**:
    *   **Confirm Payment**: Button to switch validation status.
    *   **Input Resi**: Form to input `tracking_number` -> Updates status to `shipped`.
    *   **Complete Order**: Button to mark as `completed`.

## Phase 3: Post-Purchase (Reviews & Notifications)
**Goal**: Customer engagement.

### 3.1 Product Reviews
*   **Requirement**: Order must be `completed`.
*   **Feature**:
    *   User can rate (1-5) and comment on items in their order.
    *   Display reviews on Product Detail page.

### 3.2 Notifications
*   **Channel**: Simple Notification (Database/Email).
*   **Triggers**:
    *   "Pesanan Baru" (To Admin).
    *   "Pesanan Dikirim" (To Customer, with Resi).
