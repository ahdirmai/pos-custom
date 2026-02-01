import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategoryList({ categories }) {
    return (
        <div className="py-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-4 md:px-0">Kategori</h2>
            
             {/* Use CSS Grid for better control on desktop, flex for mobile scrolling */}
            <div className="flex md:grid md:grid-cols-5 md:gap-4 overflow-x-auto space-x-4 md:space-x-0 pb-4 px-4 md:px-0 scrollbar-hide">
                {categories.map((category) => (
                    <Link key={category.id} href="#" className="flex-shrink-0 flex flex-col items-center group w-20 md:w-auto">
                        
                        {/* Mobile: Circle */}
                        <div className="md:hidden w-16 h-16 rounded-full overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        </div>

                         {/* Desktop: Card */}
                        <div className="hidden md:flex flex-col w-full h-32 relative rounded-lg overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300">
                             <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-50 transition-all" />
                             <div className="relative z-10 flex items-center justify-center h-full">
                                 <span className="text-white text-lg font-bold tracking-wide drop-shadow-md">{category.name}</span>
                             </div>
                        </div>

                        {/* Text for Mobile */}
                        <span className="mt-2 text-xs md:hidden text-center text-gray-700 font-medium group-hover:text-indigo-600 line-clamp-2">{category.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
