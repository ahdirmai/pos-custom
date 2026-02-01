import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { useCart } from '@/Context/CartContext';
import ProductCard from '@/Components/EndUser/ProductCard';
import toast from 'react-hot-toast';

export default function ProductShow({ product, reviews, relatedProducts }) {
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0] || null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isWishlisted, setIsWishlisted] = useState(false);

    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const hasDiscount = product.original_price > product.price;
    const hasStock = product.stock > 0;
    const lowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = () => {
        // Validation for variants if needed (Phase 2)
        // if (product.variants?.sizes && !selectedSize) { ... }

        router.post(route('user.cart.store'), {
            product_id: product.id,
            qty: quantity,
        }, {
            onSuccess: () => toast.success(`${product.name} ditambahkan ke keranjang`),
            onError: () => toast.error('Gagal menambahkan ke keranjang'),
            preserveScroll: true
        });
    };

    const handleBuyNow = () => {
        router.post(route('user.cart.store'), {
            product_id: product.id,
            qty: quantity,
        }, {
            onSuccess: () => router.visit(route('user.checkout')),
            onError: () => toast.error('Gagal memproses pesanan'),
        });
    };

    const ratingDistribution = useMemo(() => {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => dist[r.rating]++);
        return dist;
    }, [reviews]);

    return (
        <UserLayout>
            <Head title={product.name} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Breadcrumb */}
                <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-indigo-600">Home</Link>
                    <span>/</span>
                    <Link href="/katalog" className="hover:text-indigo-600">Katalog</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.category}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Product Images */}
                    <div className="w-full lg:w-1/2 xl:w-[55%]">
                        {/* Main Image */}
                        <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-3">
                            <img 
                                src={product.images[selectedImage]} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {hasDiscount && (
                                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg">
                                    -{product.discount_percent}%
                                </span>
                            )}
                            {/* Wishlist Button */}
                            <button 
                                onClick={() => {
                                    setIsWishlisted(!isWishlisted);
                                    toast.success(isWishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
                                }}
                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedImage === idx ? 'border-indigo-600' : 'border-transparent'
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex-1 lg:sticky lg:top-24 lg:self-start">
                        {/* Category & Brand */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg">{product.category}</span>
                            <span className="text-sm text-gray-500">{product.brand}</span>
                        </div>

                        {/* Name */}
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
                            {product.name}
                        </h1>

                        {/* Rating & Sold */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-bold text-gray-900">{product.rating}</span>
                                <span className="text-gray-500">({product.review_count} ulasan)</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500">{product.sold_count}+ terjual</span>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex items-baseline gap-3">
                                <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                                    {formatPrice(product.price)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {formatPrice(product.original_price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Color Variants */}
                        {product.variants?.colors && (
                            <div className="mb-5">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Warna: <span className="text-gray-900">{selectedColor?.name}</span>
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {product.variants.colors.map(color => (
                                        <button
                                            key={color.id}
                                            onClick={() => setSelectedColor(color)}
                                            disabled={color.stock === 0}
                                            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                                                selectedColor?.id === color.id 
                                                    ? 'border-indigo-600 ring-2 ring-indigo-600/30' 
                                                    : 'border-gray-200'
                                            } ${color.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {selectedColor?.id === color.id && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Variants */}
                        {product.variants?.sizes && (
                            <div className="mb-5">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-700">Ukuran</p>
                                    <button 
                                        onClick={() => setActiveTab('size_chart')}
                                        className="text-xs text-indigo-600 font-medium hover:underline"
                                    >
                                        Panduan Ukuran
                                    </button>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {product.variants.sizes.map(size => (
                                        <button
                                            key={size.id}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={size.stock === 0}
                                            className={`min-w-[48px] px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                                selectedSize?.id === size.id 
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                            } ${size.stock === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                                        >
                                            {size.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-5">
                            <p className="text-sm font-medium text-gray-700 mb-2">Jumlah</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Stok: <span className={lowStock ? 'text-orange-600 font-medium' : ''}>{product.stock}</span>
                                    {lowStock && <span className="text-orange-600"> (Sisa sedikit!)</span>}
                                </span>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 font-medium">Dikirim dari {product.shipping?.origin}</p>
                                    {product.shipping?.free_shipping && (
                                        <p className="text-sm text-green-600 font-medium">Gratis Ongkir</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons - Desktop */}
                        <div className="hidden md:flex gap-3">
                            <button 
                                onClick={handleAddToCart}
                                disabled={!hasStock}
                                className="flex-1 py-3.5 px-6 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Tambah Keranjang
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                disabled={!hasStock}
                                className="flex-1 py-3.5 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Beli Sekarang
                            </button>
                        </div>

                        {/* Share & Chat */}
                        <div className="hidden md:flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Bagikan
                            </button>
                            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Chat Penjual
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-8 md:mt-12">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200 -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                            {[
                                { id: 'description', label: 'Deskripsi' },
                                { id: 'specifications', label: 'Spesifikasi' },
                                { id: 'size_chart', label: 'Panduan Ukuran' },
                                { id: 'reviews', label: `Ulasan (${reviews.length})` },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="py-6">
                        {/* Description */}
                        {activeTab === 'description' && (
                            <div 
                                className="prose prose-sm max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        )}

                        {/* Specifications */}
                        {activeTab === 'specifications' && (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {product.specifications.map((spec, idx) => (
                                    <div key={idx} className="flex justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-500">{spec.label}</span>
                                        <span className="font-medium text-gray-900">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Size Chart */}
                        {activeTab === 'size_chart' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Ukuran</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Lingkar Dada</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Panjang</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Lengan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {product.size_chart.map((row, idx) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-3 font-medium text-gray-900">{row.size}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.length}</td>
                                                <td className="px-4 py-3 text-gray-600">{row.sleeve}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Reviews */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                {/* Rating Summary */}
                                <div className="flex flex-col sm:flex-row gap-6 p-6 bg-gray-50 rounded-2xl">
                                    <div className="text-center sm:text-left">
                                        <div className="text-5xl font-bold text-gray-900">{product.rating}</div>
                                        <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                                            {[1,2,3,4,5].map(star => (
                                                <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${star <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{product.review_count} ulasan</p>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {[5,4,3,2,1].map(star => (
                                            <div key={star} className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 w-8">{star} ★</span>
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-amber-400 rounded-full"
                                                        style={{ width: `${(ratingDistribution[star] / reviews.length) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500 w-8">{ratingDistribution[star]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Review List */}
                                {reviews.map(review => (
                                    <div key={review.id} className="p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-gray-900">{review.user}</p>
                                                    <span className="text-xs text-gray-400">{review.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[1,2,3,4,5].map(star => (
                                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">Varian: {review.variant}</p>
                                                <p className="text-sm text-gray-700 mt-2">{review.content}</p>
                                                {review.images.length > 0 && (
                                                    <div className="flex gap-2 mt-3">
                                                        {review.images.map((img, idx) => (
                                                            <img key={idx} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-8 md:mt-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Mungkin Anda Juga Suka</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                        {relatedProducts.slice(0, 8).map(item => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                <div className="flex gap-3 max-w-md mx-auto">
                    <button 
                        onClick={handleAddToCart}
                        disabled={!hasStock}
                        className="flex-1 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl disabled:opacity-50"
                    >
                        Keranjang
                    </button>
                    <button 
                        onClick={handleBuyNow}
                        disabled={!hasStock}
                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl disabled:opacity-50"
                    >
                        Beli
                    </button>
                </div>
            </div>

            {/* Spacer for sticky CTA */}
            <div className="md:hidden h-20"></div>
        </UserLayout>
    );
}
