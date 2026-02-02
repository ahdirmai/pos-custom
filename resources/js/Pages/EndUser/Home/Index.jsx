import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Banner from '@/Components/EndUser/Banner';
import CategoryList from '@/Components/EndUser/CategoryList';
import ProductCard from '@/Components/EndUser/ProductCard';

export default function Index({ storeBanner, productCategories = [], promoBanner, products = [], latestPosts = [] }) {
    return (
        <UserLayout>
            <Head title="Home" />

            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-8 space-y-12">
                
                {/* Store Banner */}
                <Banner 
                    image={storeBanner.image} 
                    title={storeBanner.title} 
                    subtitle={storeBanner.subtitle}
                    className="h-[400px] md:h-[500px]"
                 />

                {/* Product Categories */}
                <CategoryList categories={productCategories} />

                {/* Promo Banner */}
                <Banner 
                    image={promoBanner.image}
                    className="h-40 md:h-60"
                />

                {/* Products Grid */}
                <div className="space-y-8">
                    <div className="flex justify-between items-end px-4 md:px-0">
                         <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">10 Rekomendasi Produk Terlaris</h2>
                            <p className="text-gray-500 mt-1">Produk paling diminati minggu ini</p>
                         </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 md:px-0">
                        {products.map((product) => (
                             <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Main CTA Button */}
                 <div className="flex justify-center py-4">
                     <Link href={route('user.products')} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105">
                        Lihat Semua Produk
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                     </Link>
                </div>

                {/* Latest Posts */}
                {latestPosts && latestPosts.length > 0 && (
                     <div className="py-12 border-t border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 px-4 md:px-0 tracking-tight">Inspirasi & Tips</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                            {latestPosts.map((post) => (
                                <div key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                     <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                     </div>
                                     <div className="p-6 flex flex-col flex-1">
                                         <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Blog</span>
                                         <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h3>
                                         <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                                         <a href="#" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                             Baca Selengkapnya
                                             <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                         </a>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )} 

            </div>
        </UserLayout>
    );
}
