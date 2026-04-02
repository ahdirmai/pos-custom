import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useCart } from '@/Context/CartContext';
import { useWishlist } from '@/Context/WishlistContext';

import Dropdown from '@/Components/Dropdown';

export default function Header() {
    const { url } = usePage();
    const { cartCount, setIsCartOpen } = useCart();
    const { wishlistCount } = useWishlist();
    const [searchQuery, setSearchQuery] = useState('');

    const isActive = (path) => {
        if (path === '/') {
            return url === '/';
        }
        return url.startsWith(path);
    };

    const { auth, storeProfile, categories } = usePage().props;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // handle search
        }
    };

    return (
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
            {/* Top Bar (Optional if you want to mimic Blogpedia's top links) */}


            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-4 sm:gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        {storeProfile?.logo ? (
                            <img
                                src={storeProfile.logo}
                                alt={storeProfile?.name || 'Store Logo'}
                                className="h-8 w-auto object-contain"
                            />
                        ) : (
                            <ApplicationLogo className="h-8 w-auto text-primary-600" />
                        )}
                        {storeProfile?.name && (
                            <span className="text-lg sm:text-xl font-extrabold text-primary-600 truncate max-w-[130px] sm:max-w-[160px] tracking-tight">
                                {storeProfile.name}
                            </span>
                        )}
                    </Link>


                    {/* Search Bar */}


                    {/* Right Icons */}
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full relative transition-colors"
                            title="Keranjang"
                        >
                            <span className="sr-only">Keranjang</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>

                        <div className="hidden md:block w-px h-6 bg-gray-200 mx-2"></div>

                        {auth.user ? (
                            <div className="hidden md:flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 px-2 py-1.5 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium">
                                            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                                                {auth.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="truncate max-w-[100px]">{auth.user.name}</span>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('user.profile')}>Profil Saya</Dropdown.Link>
                                        <Dropdown.Link href={route('user.orders.index')}>Pesanan Saya</Dropdown.Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 focus:text-red-700 hover:text-red-700 hover:bg-red-50">
                                            Keluar
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    href={route('login')}
                                    className="px-4 py-1.5 text-sm font-bold text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-4 py-1.5 text-sm font-bold text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </header>
    );
}
