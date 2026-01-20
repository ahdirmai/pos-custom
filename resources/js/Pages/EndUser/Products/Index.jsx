import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import ProductCard from '@/Components/EndUser/ProductCard';

export default function Index({ products }) {
    return (
        <UserLayout>
            <Head title="Katalog Produk" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Katalog Produk</h1>
                
                {/* Filters Placeholder */}
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {['Semua', 'Fashion', 'Elektronik', 'Rumah Tangga', 'Kecantikan'].map((filter) => (
                         <button key={filter} className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap">
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
