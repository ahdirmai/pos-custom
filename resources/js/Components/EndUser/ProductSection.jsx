import React from 'react';
import { Link } from '@inertiajs/react';
import ProductCard from '@/Components/EndUser/ProductCard';

export default function ProductSection({ title, products, link = '#' }) {
    return (
        <div className="py-8 border-b border-gray-100 last:border-0">
            <div className="flex justify-between items-center mb-6 px-4 md:px-0">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <Link href={link} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold">
                    Lihat Semua
                </Link>
            </div>
            
            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-0 scrollbar-hide">
                {products.map((product) => (
                    <div key={product.id} className="min-w-[160px] w-40 md:w-56 flex-shrink-0">
                         <ProductCard product={product} />
                    </div>
                ))}

                {/* Show All Card */}
                 <Link href={link} className="min-w-[140px] w-40 md:w-48 flex-shrink-0 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-100 hover:border-indigo-400 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                         </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-indigo-600">Lihat Semua</span>
                     <span className="text-xs text-gray-400 mt-1">{title}</span>
                </Link>
            </div>
        </div>
    );
}
