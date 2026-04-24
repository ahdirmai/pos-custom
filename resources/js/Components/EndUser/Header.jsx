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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <div className="flex justify-between items-center h-16 gap-3 sm:gap-6">
                    {/* Left Section: Nav Toggle & Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Hamburger Toggle (Mobile) */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
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
                    </div>

                    {/* Kategori Dropdown & Search Bar */}
                    <div className="hidden lg:flex flex-1 items-center gap-4 mx-4">
                        <button className="text-gray-700 font-medium whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                            Kategori
                        </button>
                        
                        <div className="flex-1 relative">
                            <form onSubmit={handleSearch} className="flex border border-[#B3BBC9] rounded-lg h-10 w-full overflow-hidden transition-colors hover:border-primary-600 focus-within:border-primary-600">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk..."
                                    className="flex-1 border-none focus:ring-0 px-4 text-sm bg-transparent outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-3 bg-gray-50 border-l border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>                    {/* Right Icons */}
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

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 transition-opacity" 
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                    
                    {/* Drawer */}
                    <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl flex flex-col transform transition-transform duration-300">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <span className="font-bold text-lg text-primary-600">Menu</span>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                            {!auth.user && (
                                <div className="flex gap-2 mb-6">
                                    <Link href={route('login')} className="flex-1 text-center py-2 px-4 border border-primary-600 text-primary-600 rounded-lg font-bold text-sm">Masuk</Link>
                                    <Link href={route('register')} className="flex-1 text-center py-2 px-4 bg-primary-600 text-white rounded-lg font-bold text-sm">Daftar</Link>
                                </div>
                            )}

                            <nav className="flex flex-col space-y-2">
                                <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className={`px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                    Beranda
                                </Link>
                                <Link onClick={() => setIsMobileMenuOpen(false)} href="/products" className={`px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${isActive('/products') ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                    Katalog Produk
                                </Link>
                                <Link onClick={() => setIsMobileMenuOpen(false)} href="/wishlist" className="px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-gray-700 hover:bg-gray-50">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    Wishlist ({wishlistCount})
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

        </header>
    );
}
