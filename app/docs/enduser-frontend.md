# End User E-commerce Frontend Documentation

**Date**: 21 Januari 2026  
**Project**: POS Custom - End User Pages

---

## Overview

Implementasi halaman e-commerce untuk end-user dengan desain mobile-first dan responsive.

---

## Pages Implemented

### 1. Home Page (`/`)
- Banner hero dengan store info
- Category list (horizontal scroll)
- Product sections per kategori
- Promo banner

### 2. Catalog Page (`/katalog`)
- Grid produk dengan ProductCard component
- Filter dan sorting (placeholder)

### 3. Search Page (`/cari`)
- Recent searches
- Popular products grid

### 4. Product Detail Page (`/produk/:id`)
**Features:**
- Image gallery dengan thumbnails
- Variant selector (warna & ukuran)
- Quantity picker
- Tabs: Deskripsi, Spesifikasi, Panduan Ukuran, Ulasan
- Related products menggunakan ProductCard
- Mobile sticky CTA
- Wishlist toggle
- Share & Chat buttons

### 5. Checkout Page (`/checkout`)
- Form shipping: Nama, Telepon, Alamat, Catatan
- Payment method: COD (Transfer coming soon)
- Order summary dari CartContext
- Redirect ke Invoice setelah submit

### 6. Invoice Page (`/nota/:id`)
- Success banner
- Store header
- Customer & order details
- Itemized list dengan gambar
- Barcode visualization
- Print button

### 7. Profile Page (`/profile`)
**Tabs:**
- **Profil**: Info pribadi, keamanan akun
- **Alamat**: Daftar alamat tersimpan
- **Pesanan**: Order history dengan filter status
- **Wishlist**: Produk favorit
- **Ulasan**: Pending reviews

**Layout:**
- Mobile: Gradient header + horizontal tab pills
- Desktop: Sidebar dengan navigation

---

## Components

### ProductCard (`/Components/EndUser/ProductCard.jsx`)
- Image dengan hover blur effect
- Stock badge (Habis/Sisa X/Stok: X)
- Category badge
- Hover action buttons (View/Add to Cart)
- Rating & sold count display
- Mobile: Full-width add button
- Toast notification on add

### CartDrawer (`/Components/EndUser/CartDrawer.jsx`)
- Slide-in panel dari kanan
- Item list dengan quantity controls
- Subtotal display
- Checkout button

### Header (`/Components/EndUser/Header.jsx`)
- Logo & navigation
- Search bar (hidden on mobile/tablet)
- Cart icon dengan count badge

### MobileNavbar (`/Components/EndUser/MobileNavbar.jsx`)
- Fixed bottom navigation
- Home, Catalog, Search, Cart, Profile icons

### Footer (`/Components/EndUser/Footer.jsx`)
- Store info
- Quick links
- Social media

---

## Context

### CartContext (`/Context/CartContext.jsx`)
- Global state untuk cart items
- Persist ke localStorage
- Methods: addToCart, removeFromCart, updateQuantity, clearCart

---

## Layouts

### UserLayout (`/Layouts/UserLayout.jsx`)
- Wrapper untuk semua EndUser pages
- Includes: Header, Footer, MobileNavbar, CartDrawer
- Toaster untuk notifications

---

## Backend Routes

```php
// routes/web.php
Route::get('/', [HomeController::class, 'index']);
Route::get('/katalog', [HomeController::class, 'products']);
Route::get('/cari', [HomeController::class, 'search']);
Route::get('/artikel', [HomeController::class, 'articles']);
Route::get('/checkout', [HomeController::class, 'checkout']);
Route::get('/nota/{id}', [HomeController::class, 'invoice']);
Route::get('/profile', [HomeController::class, 'profile']);
Route::get('/produk/{id}', [HomeController::class, 'show']);
```

---

## UI/UX Guidelines

### Design Principles
- **Mobile First**: Semua pages didesain untuk mobile terlebih dahulu
- **Consistent**: Menggunakan design tokens yang sama
- **Touch Friendly**: Minimum touch target 44px

### Colors
- Primary: Indigo (`#4F46E5`)
- Success: Green
- Warning: Amber/Orange
- Error: Red

### Typography
- Font: Sans-serif (default Tailwind)
- Sizes: text-xs hingga text-3xl

### Spacing
- Menggunakan 8px grid system
- Padding/margin: p-2, p-3, p-4, p-6, etc.

---

## Dependencies

- **React**: Frontend framework
- **Inertia.js**: SPA routing
- **Tailwind CSS**: Styling
- **react-hot-toast**: Notifications
- **@tabler/icons-react**: Icons (optional)

---

## TODO / Next Steps

- [ ] Implement real authentication untuk Profile
- [ ] Connect to real product data dari database
- [ ] Implement checkout API dengan payment gateway
- [ ] Add product reviews submission
- [ ] Implement wishlist persistence
- [ ] Add address management CRUD
- [ ] Implement search functionality dengan filters
