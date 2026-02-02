import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function MobileNavbar() {
    const { url } = usePage();

    const isActive = (path) => {
        return url === path || url.startsWith(path);
    };

    return (
        <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium relative">
                
                {/* Beranda */}
                <Link href="/" className={`inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 group ${isActive('/') && url === '/' ? 'text-indigo-600' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px] group-hover:text-indigo-600">Beranda</span>
                </Link>

                {/* Katalog */}
                <Link href="/katalog" className={`inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 group ${isActive('/katalog') ? 'text-indigo-600' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="text-[10px] group-hover:text-indigo-600">Katalog</span>
                </Link>

                {/* Cari (Search) - Prominent */}
                <div className="flex justify-center items-center -mt-6">
                    <Link href="/cari" className={`w-12 h-12 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 ${isActive('/cari') ? 'ring-4 ring-indigo-300' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </Link>
                    {/* Fixed label below the floating button */}
                     <span className={`absolute bottom-1 text-[10px] font-medium ${isActive('/cari') ? 'text-indigo-600' : 'text-gray-500'}`}>Cari</span>
                </div>

                {/* Artikel */}
                <Link href="/artikel" className={`inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 group ${isActive('/artikel') ? 'text-indigo-600' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span className="text-[10px] group-hover:text-indigo-600">Artikel</span>
                </Link>

                {/* Akun */}
                <Link href="/profile" className={`inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 group ${isActive('/profile') ? 'text-indigo-600' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px] group-hover:text-indigo-600">Akun</span>
                </Link>
            </div>
        </nav>
    );
}
