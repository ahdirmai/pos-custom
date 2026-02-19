# Admin Transaction Status Management

This document outlines the implementation of the feature to manage transaction statuses via the Admin Panel, specifically for "Online Orders" (where `cashier_id` is NULL).

## Feature Overview

Admins can:
1.  View a list of incoming online orders.
2.  Update the status of an order (`pending` -> `processing` -> `shipped` -> `completed` or `cancelled`).
3.  Input a Tracking Number (Resi) for shipped orders.

## Backend Implementation

### Controller: `App\Http\Controllers\Apps\TransactionController`

#### New Methods:
-   `orders(Request $request)`: Lists transactions where `cashier_id` is `NULL`. Supports filtering by status and date.
-   `updateStatus(Request $request, Transaction $transaction)`: Updates the `order_status` column.
-   `updateResi(Request $request, Transaction $transaction)`: Updates the `tracking_number` and sets status to `shipped`.

### Routes (`web.php`)

-   `GET /dashboard/transactions/orders` (View Orders)
-   `PATCH /dashboard/transactions/{transaction}/status` (Update Status)
-   `PATCH /dashboard/transactions/{transaction}/resi` (Update Resi)

## Frontend Implementation

### Page: `resources/js/Pages/Dashboard/Transactions/Orders.jsx`

-   Data Table columns:
    -   Invoice
    -   Date
    -   Customer
    -   Total
    -   Payment Status
    -   Order Status
    -   Tracking Number
    -   Actions (Process, Input Resi, Complete, Cancel)
