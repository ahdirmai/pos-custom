import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/Components/EndUser/Header';
import Footer from '@/Components/EndUser/Footer';
import MobileNavbar from '@/Components/EndUser/MobileNavbar';
import CartDrawer from '@/Components/EndUser/CartDrawer';
import { CartProvider } from '@/Context/CartContext';

export default function UserLayout({ children }) {
    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 antialiased">
                <Header />
                <CartDrawer />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
                <MobileNavbar />
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
        </CartProvider>
    );
}

