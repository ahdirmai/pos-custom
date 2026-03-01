import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import ProductCard from '@/Components/EndUser/ProductCard';

export default function Index({ products, filters, categories }) {
    const { url } = usePage();
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // State for filters
    const [params, setParams] = useState({
        category: filters.category || 'Semua',
        q: filters.q || '',
        sort: filters.sort || 'newest',
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
        min_rating: filters.min_rating || '',
        page: filters.page || 1,
    });

    // Debounce for search and price
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only push if params changed from initial filters 
            // (Comparing objects deeply is better but simple check helps)
            router.get(route('user.products'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [params.category, params.q, params.sort, params.min_price, params.max_price, params.min_rating, params.page]);

    const handleFilterChange = (key, value) => {
        // If changing a filter instead of page, reset to page 1
        setParams(prev => ({
            ...prev,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {})
        }));
    };

    const FilterContent = () => {
        const [showCategory, setShowCategory] = useState(true);
        const [showPrice, setShowPrice] = useState(true);
        const [showRating, setShowRating] = useState(true);

        const sectionHeader = (label, isOpen, toggle) => (
            <button
                onClick={toggle}
                className="w-full flex justify-between items-center py-2 text-left"
            >
                <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">{label}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        );

        return (
            <div className="space-y-1 divide-y divide-gray-100">
                {/* Category Section */}
                <div className="pb-3">
                    {sectionHeader('Kategori', showCategory, () => setShowCategory(v => !v))}
                    {showCategory && (
                        <div className="mt-2 space-y-1">
                            <button
                                onClick={() => handleFilterChange('category', 'Semua')}
                                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${params.category === 'Semua'
                                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Semua Kategori
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleFilterChange('category', cat.name)}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${params.category === cat.name
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Rating Section */}
                <div className="py-3">
                    {sectionHeader('Rating', showRating, () => setShowRating(v => !v))}
                    {showRating && (
                        <div className="mt-2 space-y-1">
                            {[null, 4, 3, 2, 1].map((stars) => (
                                <button
                                    key={stars ?? 'all'}
                                    onClick={() => handleFilterChange('min_rating', stars ?? '')}
                                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${String(params.min_rating) === String(stars ?? '')
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {stars ? (
                                        <>
                                            <span className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <svg key={s} xmlns="http://www.w3.org/2000/svg"
                                                        className={`h-4 w-4 ${s <= stars ? 'text-amber-400' : 'text-gray-200'}`}
                                                        viewBox="0 0 20 20" fill="currentColor"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </span>
                                            <span className="text-xs text-gray-500">ke atas</span>
                                        </>
                                    ) : (
                                        <span>Semua Rating</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Section */}
                <div className="py-3">
                    {sectionHeader('Harga', showPrice, () => setShowPrice(v => !v))}
                    {showPrice && (
                        <div className="mt-2 space-y-3">
                            <div>
                                <label className="text-xs text-gray-500">Minimal</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                                    <input
                                        type="number"
                                        value={params.min_price}
                                        onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Maksimal</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                                    <input
                                        type="number"
                                        value={params.max_price}
                                        onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <UserLayout>
            <Head title="Katalog Produk" />

            <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-4 md:py-8 space-y-8 pb-24">
                <div className="flex flex-col gap-8">

                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden w-full flex-shrink-0">
                        <FilterContent />
                    </aside>

                    {/* Filter Drawer */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-50 flex">
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/50 transition-opacity"
                                onClick={() => setShowMobileFilters(false)}
                            />

                            {/* Drawer - slides from left */}
                            <div className="relative max-w-xs w-full bg-white h-full shadow-xl flex flex-col">
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">Filter</h2>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6">
                                    <FilterContent />
                                </div>
                                <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                        Terapkan Filter
                                    </button>
                                    <button
                                        onClick={() => {
                                            setParams({ category: 'Semua', q: '', sort: 'newest', min_price: '', max_price: '', page: 1 });
                                            setShowMobileFilters(false);
                                        }}
                                        className="w-full py-3 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Reset Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Top Bar */}
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-900">Katalog Produk</h1>
                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="block p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                    {(params.category !== 'Semua' || params.min_price || params.max_price) && (
                                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                                    )}
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={params.q}
                                        onChange={(e) => handleFilterChange('q', e.target.value)}
                                        placeholder="Cari produk..."
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {/* Sort */}
                                <select
                                    value={params.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="border-gray-300 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 py-2.5"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="price_asc">Harga Terendah</option>
                                    <option value="price_desc">Harga Tertinggi</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900">Produk tidak ditemukan</h3>
                                <p className="text-gray-500 mt-1">Coba ubah filter atau kata kunci pencarian Anda.</p>
                                <button
                                    onClick={() => setParams({ category: 'Semua', q: '', sort: 'newest', min_price: '', max_price: '', page: 1 })}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.links && products.links.length > 3 && (
                            <div className="mt-10 flex justify-center">
                                <div className="flex gap-1 flex-wrap justify-center">
                                    {products.links.map((link, key) => (
                                        link.url ? (
                                            <Link
                                                key={key}
                                                preserveScroll
                                                preserveState
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const urlObj = new URL(link.url);
                                                    handleFilterChange('page', urlObj.searchParams.get('page'));
                                                }}
                                                className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-colors ${link.active
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={key}
                                                className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-400 border border-gray-100 rounded-lg bg-gray-50 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
