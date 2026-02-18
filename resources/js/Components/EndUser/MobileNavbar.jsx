import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function MobileNavbar() {
    const { url } = usePage();

    const isActive = (path) => {
        if (path === '/') {
            return url === '/';
        }
        return url.startsWith(path);
    };

    const navItems = [
        {
            label: 'Beranda',
            href: '/',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            label: 'Katalog',
            href: '/products',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            label: 'Cari',
            href: '/search',
            isFloating: true,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            label: 'Artikel',
            href: '/articles',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            )
        },
        {
            label: 'Akun',
            href: '/profile',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium relative">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    
                    if (item.isFloating) {
                        return (
                            <div key={item.href} className="relative flex justify-center items-center h-full">
                                <Link 
                                    href={item.href} 
                                    className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 ${
                                        active 
                                            ? 'bg-indigo-700 ring-4 ring-indigo-300 scale-110' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300'
                                    }`}
                                >
                                    {item.icon}
                                </Link>
                                <span className={`absolute bottom-2 text-[10px] font-medium transition-colors duration-200 ${
                                    active ? 'text-indigo-600' : 'text-gray-500'
                                }`}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className={`inline-flex flex-col items-center justify-center px-2 hover:bg-gray-50 group transition-colors duration-200 ${
                                active ? 'text-indigo-600' : 'text-gray-500'
                            }`}
                        >
                            {React.cloneElement(item.icon, {
                                className: `w-6 h-6 mb-1 transition-colors duration-200 ${
                                    active ? 'text-indigo-600' : 'group-hover:text-indigo-600'
                                }`
                            })}
                            <span className={`text-[10px] transition-colors duration-200 ${
                                active ? 'text-indigo-600' : 'group-hover:text-indigo-600'
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
