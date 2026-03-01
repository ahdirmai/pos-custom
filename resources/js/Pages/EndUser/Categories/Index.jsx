import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Index({ categories = [] }) {
    return (
        <UserLayout>
            <Head title="Semua Kategori" />

            <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 pb-24">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            href={route('user.index')}
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Semua Kategori</h1>
                    </div>
                    <p className="text-sm text-gray-500 ml-7">
                        {categories.length} kategori tersedia
                    </p>
                </div>

                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={route('user.products', { category: category.name })}
                                className="group relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Info */}
                                <div className="p-3 sm:p-4">
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                        {category.products_count ?? 0} produk
                                    </p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="absolute top-3 right-3 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">Belum ada kategori</h3>
                        <p className="text-gray-500 mt-1">Kategori produk belum tersedia saat ini.</p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
