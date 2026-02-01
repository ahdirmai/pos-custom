import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Index({ recentSearches, popularProducts }) {
    return (
        <UserLayout>
            <Head title="Pencarian" />
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cari Produk</h1>
                    
                    {/* Big Search Input */}
                    <div className="relative mb-8">
                        <input
                            type="text"
                            placeholder="Cari produk yang anda inginkan..."
                            className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                            autoFocus
                        />
                         <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                             </svg>
                        </button>
                    </div>

                    {/* Recent Searches */}
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pencarian Terakhir</h2>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((term, index) => (
                                <button key={index} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 text-sm">
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popular Products */}
                     <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Populer Saat Ini</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {popularProducts.map((product) => (
                                <div key={product.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                                        <p className="text-xs text-indigo-600 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
