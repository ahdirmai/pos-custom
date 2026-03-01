import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategoryList({ categories }) {
    return (
        <div className="py-8">
            <div className="flex justify-between items-end mb-6 px-4 md:px-0">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Kategori Pilihan</h2>
                <Link href={route('user.categories')} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1 transition-colors">
                    Lihat Semua <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>

            {/* Scroll Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 px-4 md:px-0 pb-4 hide-scrollbar snap-pl">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={route('user.products', { category: category.name })}
                        className="group flex flex-col items-center gap-3 shrink-0 snap-start w-[80px] sm:w-[100px] md:w-[120px]"
                    >
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Overlay on desktop hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight whitespace-normal">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
