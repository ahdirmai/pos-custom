import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useCart } from '@/Context/CartContext';

export default function Header() {
    const { url } = usePage();
    const { cartCount, setIsCartOpen } = useCart();

    const isActive = (path) => {
         if (path === '/') {
            return url === '/';
        }
        return url.startsWith(path);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 ml-10">
                        <Link href="/" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/') ? 'text-indigo-600' : 'text-gray-500'}`}>
                            Beranda
                        </Link>
                        <Link href="/katalog" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/katalog') ? 'text-indigo-600' : 'text-gray-500'}`}>
                            Katalog
                        </Link>
                        <Link href="/artikel" className={`text-sm font-medium transition-colors hover:text-indigo-600 ${isActive('/artikel') ? 'text-indigo-600' : 'text-gray-500'}`}>
                            Artikel
                        </Link>
                    </nav>

                    {/* Search Bar - Hidden on mobile, visible on desktop */}
                    <div className="hidden lg:flex flex-1 mx-8">
                        <div className="relative w-full max-w-xl ml-auto">
                             <input
                                type="text"
                                placeholder="Cari produk..."
                                className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                            />
                             <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        <Link href="#" className="hidden md:block text-gray-500 hover:text-gray-900">
                            Masuk
                        </Link>
                         <button className="text-gray-500 hover:text-gray-900 relative">
                            <span className="sr-only">Favorit</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="text-gray-500 hover:text-gray-900 relative"
                        >
                            <span className="sr-only">Keranjang</span>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
             {/* Mobile Search - Visible only on mobile */}
            <div className="hidden px-4 pb-2">
                 <div className="relative w-full">
                     <input
                        type="text"
                        placeholder="Cari produk..."
                        className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm text-sm"
                    />
                     <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
