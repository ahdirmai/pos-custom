import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Banner from '@/Components/EndUser/Banner';
import CategoryList from '@/Components/EndUser/CategoryList';
import ProductCard from '@/Components/EndUser/ProductCard';

function Countdown({ endAt }) {
    const getTimeLeft = () => {
        const diff = new Date(endAt).getTime() - Date.now();

        if (diff <= 0) {
            return { hours: '00', minutes: '00', seconds: '00' };
        }

        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

        return { hours, minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endAt]);

    const parts = [timeLeft.hours, timeLeft.minutes, timeLeft.seconds];

    return (
        <div className="flex items-center gap-2">
            {parts.map((part, index) => (
                <React.Fragment key={`${part}-${index}`}>
                    <span className="inline-flex items-center justify-center min-w-[40px] h-10 rounded-xl bg-white/15 border border-white/20 text-white font-black text-sm shadow-inner">
                        {part}
                    </span>
                    {index < parts.length - 1 && <span className="text-white/80 font-bold">:</span>}
                </React.Fragment>
            ))}
        </div>
    );
}

export default function Index({ heroBanners = [], promoBanners = [], productCategories = [], products = [], activeFlashSale = null, flashSaleStyle = null, latestPosts = [] }) {

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
    const flashSaleBlockStyle = flashSaleStyle ? {
        background: `linear-gradient(135deg, ${flashSaleStyle.bg_from} 0%, ${flashSaleStyle.bg_via} 45%, ${flashSaleStyle.bg_to} 100%)`,
        color: flashSaleStyle.text_color,
    } : {};

    return (
        <UserLayout>
            <Head title="Home" />

            <div className="w-full pb-24 font-['Open_Sauce_One',sans-serif]">
                
                {/* Hero Banner Carousel */}
                <section id="slideHome" className="w-full relative mb-6 pt-4 sm:pt-6">
                    <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                        {activeHeroBanner ? (
                            <div className="relative overflow-hidden rounded-xl shadow-[0_1px_24px_rgba(49,53,59,0.24)]">
                                <div
                                    key={activeHeroBanner.id}
                                    className="transition-opacity duration-1000 ease-in-out"
                                >
                                    <Banner
                                        image={activeHeroBanner.image}
                                        title={activeHeroBanner.title}
                                        subtitle={activeHeroBanner.subtitle}
                                        className="h-[200px] sm:h-[300px] md:h-[400px] w-full object-cover"
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
                            <div className="h-[200px] sm:h-[300px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                No Active Hero Banner
                            </div>
                        )}
                    </div>
                </section>

                <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6">

                    {/* Search Bar - Mobile Only */}
                    <section className="block lg:hidden mb-6 mt-2">
                        <form onSubmit={handleSearch} className="relative w-full mx-auto">
                            <div className="relative flex items-center border border-[#B3BBC9] rounded-lg overflow-hidden focus-within:border-primary-600 transition-colors h-[40px]">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Telusuri"
                                    className="w-full pl-4 pr-12 py-2 bg-transparent border-none text-[14px] text-[#080808] placeholder-[#aaa] focus:ring-0"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 bottom-0 w-[40px] flex items-center justify-center bg-transparent text-[#7C8597]"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <path d="m20.53 19.46-4.4-4.4a7.33 7.33 0 1 0-1.07 1.06l4.41 4.41a.77.77 0 0 0 1.06 0 .77.77 0 0 0 0-1.07Zm-15.78-9a5.75 5.75 0 1 1 5.75 5.75 5.76 5.76 0 0 1-5.75-5.72v-.03Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Product Categories */}
                    <div className="mb-6">
                        <CategoryList categories={productCategories} />
                    </div>

                    <hr className="w-full h-2 border-0 bg-[#E6E9F0] my-10 rounded-full" />

                    {/* Promo Banner / Flash Sale Concept */}
                    {activePromoBanner && (
                        <section className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h2 className="text-[1.42857rem] font-bold text-[#212121] leading-[26px]">Promo Spesial</h2>
                            </div>
                            <Banner
                                image={activePromoBanner.image}
                                className="h-24 sm:h-32 md:h-48 rounded-xl object-cover"
                                title={activePromoBanner.title}
                                subtitle={activePromoBanner.subtitle}
                            />
                        </section>
                    )}

                    {activeFlashSale?.products?.length > 0 && (
                        <section className="mb-10">
                            <div className="relative overflow-hidden rounded-[28px] p-5 md:p-6 shadow-[0_16px_40px_rgba(234,88,12,0.28)]" style={flashSaleBlockStyle}>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_30%)]"></div>
                                <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
                                    <div className="max-w-2xl">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-[0.24em] uppercase bg-white/15 border border-white/15 mb-3" style={{ color: flashSaleStyle?.text_color || '#ffffff' }}>
                                            {flashSaleStyle?.badge_text || 'Flash Sale'}
                                        </span>
                                        <h2 className="text-[1.6rem] md:text-[2rem] font-black tracking-tight leading-tight" style={{ color: flashSaleStyle?.text_color || '#ffffff' }}>
                                            {activeFlashSale.name}
                                        </h2>
                                        <p className="text-sm md:text-base mt-2 max-w-xl" style={{ color: flashSaleStyle?.muted_text_color || '#ffe7d6' }}>
                                            {activeFlashSale.description || 'Sesi promo cepat dengan harga terbaik untuk produk pilihan.'}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: flashSaleStyle?.muted_text_color || '#ffe7d6' }}>
                                            Berakhir dalam
                                        </div>
                                        <Countdown endAt={activeFlashSale.end_at} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                                    {activeFlashSale.products.slice(0, 5).map((product) => (
                                        <div key={product.id} className="rounded-[22px] p-[1px] bg-white/15 backdrop-blur-sm">
                                            <div className="rounded-[21px] bg-white/96 p-1.5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                                                <ProductCard product={product} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Products Grid Section */}
                    {products && products.length > 0 && (
                        <section className="mb-10 mt-6">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="text-[1.42857rem] font-bold text-[#212121] leading-[26px]">Produk Pilihan</h3>
                                <Link href={route('user.products')} className="text-[14px] font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                    Lihat Semua
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Latest Posts */}
                    {latestPosts && latestPosts.length > 0 && (
                        <section className="pt-6 pb-4 border-t border-[#E6E9F0] mt-8">
                            <div className="flex items-center justify-between mb-6 px-1">
                                <h3 className="text-[1.42857rem] font-bold text-[#212121] leading-[26px] tracking-tight">Post Terbaru</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {latestPosts.map((post) => (
                                    <Link
                                        href={route('user.article.show', post.slug)}
                                        key={post.id}
                                        className="group flex items-start gap-4 p-4 border border-[#e5e7e9] rounded-xl hover:shadow-[0_4px_12px_rgba(49,53,59,0.12)] transition-shadow bg-white"
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
                                            <h3 className="text-[14px] font-bold text-[#212121] mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                                                {post.title}
                                            </h3>
                                            <div className="mt-auto text-[12px] text-[#6d7588]">
                                                {post.date}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            
                            <div className="mt-6 flex justify-center">
                                <Link href={route('user.articles')} className="text-[13px] font-bold px-6 py-2.5 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                                    Lihat Semua Postingan
                                </Link>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
