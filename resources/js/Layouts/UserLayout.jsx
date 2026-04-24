import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/Components/EndUser/Header';
import Footer from '@/Components/EndUser/Footer';
import MobileNavbar from '@/Components/EndUser/MobileNavbar';
import CartDrawer from '@/Components/EndUser/CartDrawer';
import { CartProvider } from '@/Context/CartContext';
import { WishlistProvider } from '@/Context/WishlistContext';

export default function UserLayout({ children, hideMobileNav = false }) {
    return (
        <CartProvider>
            <WishlistProvider>
                <div className="min-h-screen bg-[#ffffff] flex flex-col font-sans text-[#212121] antialiased">
                    <Header />
                    <CartDrawer />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                    {!hideMobileNav && <MobileNavbar />}
                    <Toaster
                        position="bottom-center"
                        toastOptions={{
                            duration: 2000,
                            style: {
                                background: '#fff',
                                color: '#333',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            },
                        }}
                    />
                </div>
            </WishlistProvider>
        </CartProvider>
    );
}

