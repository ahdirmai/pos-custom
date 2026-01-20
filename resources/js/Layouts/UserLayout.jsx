import React from 'react';
import Header from '@/Components/EndUser/Header';
import Footer from '@/Components/EndUser/Footer';
import MobileNavbar from '@/Components/EndUser/MobileNavbar';
import CartDrawer from '@/Components/EndUser/CartDrawer';

export default function UserLayout({ children }) {
    return (
        // <CartProvider> moved to app.jsx
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 antialiased">
            <Header />
            <CartDrawer />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <MobileNavbar />
        </div>
    );
}
