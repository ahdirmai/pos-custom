import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Banner from '@/Components/EndUser/Banner';
import CategoryList from '@/Components/EndUser/CategoryList';
import ProductSection from '@/Components/EndUser/ProductSection';

export default function Index({ storeBanner, productCategories, promoBanner, topCategories, latestPosts }) {
    return (
        <UserLayout>
            <Head title="Home" />

            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 space-y-8">
                
                {/* Store Banner */}
                <Banner 
                    image={storeBanner.image} 
                    title={storeBanner.title} 
                    subtitle={storeBanner.subtitle}
                    className="h-64 md:h-96"
                 />

                {/* Product Categories */}
                <CategoryList categories={productCategories} />

                {/* Promo Banner */}
                <Banner 
                    image={promoBanner.image}
                    className="h-40 md:h-60"
                />

                {/* Top Categories Sections */}
                <div className="space-y-8">
                    {topCategories.map((category) => (
                        <ProductSection 
                            key={category.id} 
                            title={category.name} 
                            products={category.products} 
                        />
                    ))}
                </div>

                {/* Main CTA Button */}
                 <div className="flex justify-center py-4">
                     <a href="#" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105">
                        Lihat Semua Produk
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                     </a>
                </div>

                {/* Latest Posts */}
                {latestPosts && latestPosts.length > 0 && (
                     <div className="py-8 border-t border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 px-4 md:px-0">Post Terbaru</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
                            {latestPosts.map((post) => (
                                <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row md:items-center p-4 gap-4">
                                     <img src={post.image} alt={post.title} className="w-full md:w-24 md:h-24 h-48 object-cover rounded-md flex-shrink-0" />
                                     <div className="flex-1">
                                         <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                                         <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
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
