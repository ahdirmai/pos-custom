import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import ProductCard from '@/Components/EndUser/ProductCard';

export default function WishlistIndex({ products, wishlist_ids }) {
    return (
        <UserLayout>
            <Head title="Wishlist Saya" />

            <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-4 md:py-8 pb-24">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Wishlist Saya
                    <span className="ml-2 text-base font-normal text-gray-400">({products.length} produk)</span>
                </h1>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                        <div className="text-6xl mb-4">💔</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Wishlist masih kosong</h3>
                        <p className="text-gray-500 text-sm mb-6">Yuk, simpan produk favoritmu di sini!</p>
                        <Link
                            href={route('user.products')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Belanja Sekarang
                        </Link>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
