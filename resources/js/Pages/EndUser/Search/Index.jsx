import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import ProductCard from '@/Components/EndUser/ProductCard';

export default function SearchPage({ popularProducts = [], latestProducts = [], categories = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('user.products'), { q: searchQuery.trim() });
        }
    };

    return (
        <UserLayout>
            <Head title="Cari Produk" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[70vh]">

                {/* Search Form */}
                <div className="max-w-2xl mx-auto mb-8">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari produk yang kamu inginkan..."
                            className="w-full pl-12 pr-28 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm text-base"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Categories Quick Access */}
                {categories.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Cari Berdasarkan Kategori</h2>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={route('user.products', { category: cat.slug || cat.id })}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                >
                                    {cat.name}
                                    {cat.products_count > 0 && (
                                        <span className="text-[11px] text-gray-400 font-medium">({cat.products_count})</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Products */}
                {popularProducts.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg">🔥</span>
                            <h2 className="text-lg font-bold text-gray-900">Produk Terlaris</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {popularProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Latest Products */}
                {latestProducts.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-lg">✨</span>
                            <h2 className="text-lg font-bold text-gray-900">Produk Terbaru</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {latestProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
