# Phase 1: Checkout & Order Foundation - Detailed Plan

**Goal**: Enable customers to complete a "Real" checkout process with **Biteship Shipping Rates** and **Voucher Support**, saving orders to the database.

## 1. Database Schema Changes (Updated)
**Objective**: Prepare database for Online Orders, Shipping, and Vouchers.

### Tasks
- [x] **Voucher Tables** (Already created via `2026_01_25_062118_create_vouchers_tables.php`)
    - [x] `vouchers` table.
    - [x] `voucher_usages` table.
- [x] **Transactions & Shipping Tables**
    - [x] `transaction_shippings` table (Already created).
    - [x] `shipping_couriers` table (Already created).
    - [x] **Modify `transactions` Table**:
        - [x] Change `cashier_id` to `nullable`.
        - [x] Add `order_status` ENUM.
        - [x] Add `shipping_address`, `shipping_courier`, `shipping_cost`.
        - [x] Add `voucher_id` (nullable) and `discount_amount`.

## 2. Backend Implementation
**Objective**: checkout logic with Shipping & Vouchers.

### Tasks
- [x] **Biteship Integration (Rate Checking)**
    - [x] `BiteshipService` created.
    - [x] `ShippingController::checkRates` implemented.
    - [x] **Action**: Verify API Key in `.env` and test endpoint responsiveness.
- [x] **Voucher Logic (User Side)**
    - [x] **Create `VoucherService`**:
        - [x] `checkValidity($code, $cartTotal, $userId)`: logic to validate voucher (Quota, Date, Min Spend).
        - [x] `calculateDiscount($voucher, $cartTotal, $shippingCost)`: Logic for Fixed/Percent & Subtotal/Shipping targets.
- [x] **Create `User\CheckoutController`**
    - [x] `index()`: Return Cart + Address Form.
    - [x] `store()` (The Order Placement):
        - [x] Validate Stock.
        - [x] **Validate Voucher** (if applied): Re-check validity before saving.
        - [x] **Validate Shipping**: Re-calculate shipping cost server-side using `BiteshipService`.
        - [x] Create `Transaction`.
        - [x] Create `TransactionItem`.
        - [x] Create `TransactionShipping` (Stored as transaction columns mainly).
        - [x] Create `VoucherUsage` (if voucher used) & Increment `used_count`.
        - [x] clear Cart.

## 3. Frontend Implementation (Customer View)
**Objective**: Checkout UI with Rate Selection & Voucher Input.

### Tasks
- [x] **Checkout Page UI**
    - [x] **Address Form**: Standardize input for Biteship (Postal Code is critical).
    - [x] **Courier Selection**: 
        - [x] Fetch rates via `ShippingController::checkRates` (via CheckoutController).
        - [x] Display list of couriers with prices.
    - [x] **Voucher Input**:
        - [x] Text input for Code.
        - [x] "Apply" button triggers validation.
        - [x] Display Discount Amount (Red text: "- Rp 10.000").
    - [x] **Total Calculation**: `(Subtotal - VoucherProduct) + (Shipping - VoucherShipping)`.
- [x] **My Orders / Invoice**
- [x] **Unauthenticated Access**: Handle redirect to login for restricted pages (Checkout, Orders).
    - [x] **Authenticated Layout**: specific layout for User Dashboard (Orders, Profile).
- [x] **Admin Customer Sync**
    - [x] **CustomerController**: When creating a customer, also create a User with 'customer' role.
    - [x] **Auto-generate credentials**: Email (`phone@toko.com`) and default password.

## Phase 1 Checklist

- [x] **Database**
    - [x] `transactions` table modification migration created & run.
- [x] **Backend**
    - [x] `VoucherService` validation logic implemented.
    - [x] `CheckoutController` implemented with Biteship & Voucher support.
- [x] **Frontend**
    - [x] Checkout Page: Address, Shipping Rate Select, Voucher Input.
- [ ] **Access Control & Layout**
    - [ ] **Unauthenticated Access**: Handle redirect to login for restricted pages (Checkout, Orders).
    - [ ] **Authenticated Layout**: specific layout for User Dashboard (Orders, Profile).
