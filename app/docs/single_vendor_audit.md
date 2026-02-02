# Audit Report: Single Vendor Store Readiness

**Date**: 2026-02-01
**Target System**: Single-Vendor Online Store with Shipping
**Status**: 🟠 PROTOTYPE ONLY (Backend Not Connected)

## 1. Executive Summary
The application has the *database structure* to support a single online store, but the **Customer Checkout Flow** is currently **simulated (dummy)**. Real transactions from customers are **not saved** to the database, and shipping costs are not calculated.

## 2. Critical Gaps

### A. Checkout Process (Critical)
| Feature | Current State | Required for Production |
| :--- | :--- | :--- |
| **Order Submission** | Frontend simulates success via `setTimeout` and `localStorage`. No data sent to server. | Connect to backend API (`POST /transactions`) to save proper `Transaction` record. |
| **Shipping Calculation** | Hardcoded as "Gratis". Address is a text field. | Integrate **RajaOngkir** (or similar). Add Province/City dropdowns. Calculate cost based on weight. |
| **Guest/User** | Checkout form is standalone. | Should link to logged-in user's saved addresses. |

### B. Payment
| Feature | Current State | Required for Production |
| :--- | :--- | :--- |
| **Methods** | COD only. Transfer is disabled. | Enable **Bank Transfer** (Manual check) or **Payment Gateway** (Midtrans/Xendit). |
| **Payment Proof** | No upload feature. | Capability to upload transfer proof if using manual transfer. |

## 3. Comparison with Marketplace Requirements
(As clarified, you aim for Single Vendor, not Marketplace)
-   You **DO NOT** need Multi-vendor tables.
-   You **DO** need to fix the Checkout flow to be real.

## 4. Immediate Next Steps (To Go Live)
1.  **Backend**: Create `API` endpoint for Customer Checkout.
2.  **Frontend**: Update `Checkout/Index.jsx` to:
    -   Fetch Provinces/Cities.
    -   Call `check-ongkir` API.
    -   Submit real data to Backend.
3.  **Payment**: Enable Bank Transfer option and handle "Unpaid" status orders.
