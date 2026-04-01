import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Banner from '@/Components/EndUser/Banner';
import CategoryList from '@/Components/EndUser/CategoryList';
import ProductCard from '@/Components/EndUser/ProductCard';

export default function Index({ heroBanners = [], promoBanners = [], productCategories = [], products = [], latestPosts = [] }) {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('user.products'), { q: searchQuery.trim() });
        }
    };
    
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

            <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 py-6 space-y-8 pb-24">

                {/* Hero Banner Carousel */}
                <div className="relative">
                    {activeHeroBanner ? (
                        <div className="relative overflow-hidden rounded-xl">
                            <div
                                key={activeHeroBanner.id}
                                className="transition-opacity duration-1000 ease-in-out"
                            >
                                <Banner
                                    image={activeHeroBanner.image}
                                    title={activeHeroBanner.title}
                                    subtitle={activeHeroBanner.subtitle}
                                    className="h-[200px] sm:h-[300px] md:h-[400px]"
                                />
                            </div>

                            {/* Carousel Indicators */}
                            {heroBanners.length > 1 && (
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                                    {heroBanners.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentHeroIndex(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentHeroIndex
                                                ? 'bg-primary-600 w-8'
                                                : 'bg-white/70 hover:bg-white'
                                                }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Fallback if no hero banner
                        <div className="h-[200px] sm:h-[300px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            No Active Hero Banner
                        </div>
                    )}
                </div>

                {/* Search Bar - Mobile Only (Desktop has it in Header) */}
                <div className="block md:hidden">
                    <form onSubmit={handleSearch} className="relative w-full mx-auto">
                        <div className="relative flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari di Toko..."
                                className="w-full pl-4 pr-12 py-3 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:ring-0 text-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 bottom-0 px-4 bg-gray-50 flex items-center justify-center border-l border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Product Categories */}
                <CategoryList categories={productCategories} />

                {/* Promo Banner */}
                {activePromoBanner && (
                    <Banner
                        image={activePromoBanner.image}
                        className="h-24 sm:h-32 md:h-40 rounded-xl mt-4"
                        title={activePromoBanner.title}
                        subtitle={activePromoBanner.subtitle}
                    />
                )}

                {/* Products Grid Section */}
                <div className="flex flex-col mb-8">
                    <div className="flex items-center justify-between mb-4 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary-600 w-1.5 h-6 rounded-full"></div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">Produk Populer</h2>
                        </div>
                        <Link href={route('user.products')} className="text-[13px] font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Latest Posts */}
                {latestPosts && latestPosts.length > 0 && (
                    <div className="border-t border-gray-200 pt-8 pb-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary-600 w-1.5 h-6 rounded-full"></div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">Post Terbaru</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {latestPosts.map((post) => (
                                <Link
                                    href={route('user.article.show', post.slug)}
                                    key={post.id}
                                    className="group flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-[0_4px_12px_rgba(49,53,59,0.12)] transition-shadow bg-white"
                                >
                                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-[11px] font-semibold text-primary-600 uppercase mb-1">{post.category || 'Artikel'}</span>
                                        <h3 className="text-[14px] font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                                            {post.title}
                                        </h3>
                                        <div className="mt-auto text-[12px] text-gray-500">
                                            {post.date}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                            <Link href={route('user.articles')} className="text-[13px] font-semibold px-6 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                                Lihat Semua Postingan
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
