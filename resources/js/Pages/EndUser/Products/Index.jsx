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
            router.get(route('user.products'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [params.category, params.q, params.sort, params.min_price, params.max_price, params.min_rating, params.page]);

    const handleFilterChange = (key, value) => {
        setParams(prev => ({
            ...prev,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {})
        }));
    };

    const FilterContent = ({ isMobile = false }) => {
        const [showCategory, setShowCategory] = useState(true);
        const [showPrice, setShowPrice] = useState(true);
        const [showRating, setShowRating] = useState(true);

        const sectionHeader = (label, isOpen, toggle) => (
            <button
                onClick={toggle}
                className="w-full flex justify-between items-center py-3 text-left border-b border-gray-100"
            >
                <span className="text-[14px] font-bold text-gray-900 tracking-wide">{label}</span>
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
            <div className={`space-y-4 ${isMobile ? '' : 'p-4 bg-white rounded-xl shadow-[0_1px_6px_0_rgba(49,53,59,0.12)]'}`}>
                {/* Category Section */}
                <div className="pb-2">
                    {sectionHeader('Kategori', showCategory, () => setShowCategory(v => !v))}
                    {showCategory && (
                        <div className="mt-3 space-y-2">
                            <button
                                onClick={() => handleFilterChange('category', 'Semua')}
                                className={`block w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${params.category === 'Semua'
                                        ? 'bg-primary-50 text-primary-600 font-bold'
                                        : 'text-gray-600 hover:bg-gray-50 font-medium'
                                    }`}
                            >
                                Semua Kategori
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleFilterChange('category', cat.name)}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors ${params.category === cat.name
                                            ? 'bg-primary-50 text-primary-600 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 font-medium'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Harga Section */}
                <div className="pb-2">
                    {sectionHeader('Harga', showPrice, () => setShowPrice(v => !v))}
                    {showPrice && (
                        <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                                    <input
                                        type="number"
                                        value={params.min_price}
                                        onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                        className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded-lg text-[13px] focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Min"
                                    />
                                </div>
                                <span className="text-gray-400 font-bold">-</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                                    <input
                                        type="number"
                                        value={params.max_price}
                                        onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                        className="w-full pl-9 pr-2 py-2 border border-gray-300 rounded-lg text-[13px] focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Rating Section */}
                <div className="pb-2">
                    {sectionHeader('Rating', showRating, () => setShowRating(v => !v))}
                    {showRating && (
                        <div className="mt-3 space-y-2">
                            {[null, 4, 3, 2, 1].map((stars) => (
                                <button
                                    key={stars ?? 'all'}
                                    onClick={() => handleFilterChange('min_rating', stars ?? '')}
                                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] transition-colors ${String(params.min_rating) === String(stars ?? '')
                                            ? 'bg-primary-50 text-primary-600 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 font-medium'
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
            </div>
        );
    };

    return (
        <UserLayout>
            <Head title="Katalog Produk" />

            <div className="max-w-[1240px] px-4 md:px-0 mx-auto w-full py-4 md:py-8 pb-24">
                
                {/* Search / Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-primary-600 rounded-full hidden md:block"></div>
                        Katalog Produk {params.category !== 'Semua' && <span className="text-gray-400 text-lg font-normal">/ {params.category}</span>}
                    </h1>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                value={params.q}
                                onChange={(e) => handleFilterChange('q', e.target.value)}
                                placeholder="Cari di kategori ini..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-[13px] focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="md:hidden flex items-center justify-center p-2.5 bg-white border border-gray-300 rounded-lg text-gray-600 shadow-sm relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            {(params.category !== 'Semua' || params.min_price || params.max_price || params.min_rating) && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">

                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden md:block w-64 flex-shrink-0">
                        <FilterContent />
                    </aside>

                    {/* Filter Drawer for Mobile */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-[60] flex md:hidden">
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/60 transition-opacity"
                                onClick={() => setShowMobileFilters(false)}
                            />

                            {/* Drawer slides from bottom / left */}
                            <div className="relative max-w-[85%] w-full bg-white h-full shadow-2xl flex flex-col transform transition-transform">
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                                    <h2 className="text-lg font-bold text-gray-900">Filter</h2>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-5 bg-white">
                                    <FilterContent isMobile={true} />
                                </div>
                                <div className="p-4 border-t border-gray-200 flex gap-3 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                    <button
                                        onClick={() => {
                                            setParams({ category: 'Semua', q: '', sort: 'newest', min_price: '', max_price: '', min_rating: '', page: 1 });
                                            setShowMobileFilters(false);
                                        }}
                                        className="w-1/3 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 text-center"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="w-2/3 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary-700 text-center"
                                    >
                                        Terapkan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                        
                        {/* Sort Control */}
                        <div className="flex justify-between items-center mb-4 bg-white p-3 md:p-4 rounded-xl shadow-[0_1px_6px_0_rgba(49,53,59,0.12)] border border-gray-100">
                            <span className="text-[13px] text-gray-500 font-medium">
                                Menampilkan <span className="font-bold text-gray-900">{products.data.length}</span> produk
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-gray-500 hidden sm:block font-medium">Urutkan:</span>
                                <select
                                    value={params.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="border-gray-200 bg-gray-50 rounded-lg text-[13px] font-bold text-gray-700 focus:ring-primary-500 focus:border-primary-500 py-1.5 pl-3 pr-8 shadow-sm cursor-pointer"
                                >
                                    <option value="newest">Paling Sesuai</option>
                                    <option value="price_asc">Harga Terendah</option>
                                    <option value="price_desc">Harga Tertinggi</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl shadow-[0_1px_6px_0_rgba(49,53,59,0.12)] border border-gray-100 flex flex-col items-center justify-center">
                                <img src="https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/kratos/a8a1ab96.png" alt="Empty" className="w-40 mb-4 opacity-75" />
                                <h3 className="text-[18px] font-bold text-gray-900">Oops, produk nggak ditemukan</h3>
                                <p className="text-[14px] text-gray-500 mt-2 max-w-sm mx-auto">
                                    Coba kata kunci lain atau hapus filter untuk melihat lebih banyak produk.
                                </p>
                                <button
                                    onClick={() => setParams({ category: 'Semua', q: '', sort: 'newest', min_price: '', max_price: '', min_rating: '', page: 1 })}
                                    className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary-700 transition-colors"
                                >
                                    Hapus Semua Filter
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.links && products.links.length > 3 && (
                            <div className="mt-8 flex justify-center pb-8 border-t border-gray-100 pt-6">
                                <ul className="flex flex-wrap items-center gap-1.5">
                                    {products.links.map((link, key) => {
                                        let label = link.label;
                                        if (label.includes('Previous')) label = '&laquo;';
                                        if (label.includes('Next')) label = '&raquo;';
                                        
                                        return link.url ? (
                                            <li key={key}>
                                                <Link
                                                    preserveScroll
                                                    preserveState
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const urlObj = new URL(link.url);
                                                        handleFilterChange('page', urlObj.searchParams.get('page'));
                                                    }}
                                                    className={`block px-3.5 py-2 text-[13px] font-semibold rounded-lg transition-colors min-w-[36px] text-center ${link.active
                                                            ? 'bg-primary-600 text-white shadow-md'
                                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    dangerouslySetInnerHTML={{ __html: label }}
                                                />
                                            </li>
                                        ) : (
                                            <li key={key}>
                                                <span
                                                    className={`block px-3.5 py-2 text-[13px] font-semibold text-gray-400 rounded-lg min-w-[36px] text-center ${link.active ? 'bg-primary-600 text-white' : 'bg-transparent'}`}
                                                    dangerouslySetInnerHTML={{ __html: label }}
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
