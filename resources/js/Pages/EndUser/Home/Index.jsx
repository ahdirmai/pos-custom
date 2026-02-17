import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Banner from '@/Components/EndUser/Banner';
import CategoryList from '@/Components/EndUser/CategoryList';
import ProductCard from '@/Components/EndUser/ProductCard';

export default function Index({ heroBanners = [], promoBanners = [], productCategories = [], products = [], latestPosts = [] }) {
    
    // Carousel State
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        if (heroBanners.length > 1) {
            const interval = setInterval(() => {
                setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroBanners.length);
            }, 5000); // 5 seconds

            return () => clearInterval(interval);
        }
    }, [heroBanners]);

    const activeHeroBanner = heroBanners.length > 0 ? heroBanners[currentHeroIndex] : null;
    const activePromoBanner = promoBanners.length > 0 ? promoBanners[0] : null;

    return (
        <UserLayout>
            <Head title="Home" />

            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-8 space-y-12">
                
                {/* Hero Banner Carousel */}
                <div className="relative">
                    {activeHeroBanner ? (
                        <div className="relative overflow-hidden rounded-2xl">
                             <div 
                                key={activeHeroBanner.id}
                                className="transition-opacity duration-1000 ease-in-out"
                             >
                                <Banner 
                                    image={activeHeroBanner.image} 
                                    title={activeHeroBanner.title} 
                                    subtitle={activeHeroBanner.subtitle}
                                    className="h-[400px] md:h-[500px]"
                                />
                             </div>
                             
                             {/* Carousel Indicators */}
                             {heroBanners.length > 1 && (
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                                    {heroBanners.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentHeroIndex(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                                index === currentHeroIndex 
                                                ? 'bg-white w-8' 
                                                : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                             )}
                        </div>
                    ) : (
                         // Fallback if no hero banner
                         <div className="h-[400px] md:h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                             No Active Hero Banner
                         </div>
                    )}
                </div>

                {/* Product Categories */}
                <CategoryList categories={productCategories} />

                {/* Promo Banner */}
                {activePromoBanner && (
                    <Banner 
                        image={activePromoBanner.image}
                        className="h-40 md:h-60"
                        title={activePromoBanner.title} // Optional: display title if needed
                        subtitle={activePromoBanner.subtitle} // Optional: display subtitle if needed
                    />
                )}

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
                     <div className="py-8 border-t border-gray-100 px-4 md:px-0">
                        {/* Header with visual accent */}
                        <div className="relative mb-4 inline-block">
                            <div className="absolute inset-0 bg-yellow-200 transform -skew-x-3 rounded-lg opacity-70"></div>
                            <h2 className="relative text-xl font-bold text-gray-900 px-3 py-1 z-10">Post Terbaru</h2>
                        </div>
                        
                        <div className="flex flex-col divide-y divide-gray-100 border-b border-gray-100">
                            {latestPosts.map((post) => (
                                <Link 
                                    href={route('user.article.show', post.slug)} 
                                    key={post.id} 
                                    className="group py-4 flex items-start justify-between hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2 first:pt-0 last:pb-0 cursor-pointer"
                                >
                                     <div className="flex-1 pr-4">
                                        <div className="text-[11px] text-gray-500 mb-1">In <span className="font-semibold text-gray-600">{post.category || 'Panduan'}</span></div>
                                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                                             {post.title}
                                        </h3>
                                        <div className="text-xs text-gray-400 font-medium">
                                             {post.date}
                                        </div>
                                     </div>
                                     <div className="flex-shrink-0 w-28 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden bg-gray-100 shadow-sm relative mt-0.5">
                                        <img 
                                            src={post.image} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                     </div>
                                </Link>
                            ))}
                        </div>
                        
                        {/* View All Posts Button */}
                        <div className="mt-6 text-center md:text-left">
                            <Link href={route('user.articles')} className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                Lihat Semua Postingan
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>
                )} 

            </div>
        </UserLayout>
    );
}
