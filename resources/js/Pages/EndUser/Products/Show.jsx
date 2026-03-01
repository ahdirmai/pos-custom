import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import ProductCard from '@/Components/EndUser/ProductCard';
import toast from 'react-hot-toast';

export default function ProductShow({ product, reviews, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isWishlisted, setIsWishlisted] = useState(false);

    const formatPrice = (value) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const hasDiscount = product.sell_price < product.buy_price * 1.5; // Example logic, or use real original price if available
    // Note: Product model only has buy_price and sell_price. I'll use sell_price.
    // Assuming no specific discount logic in model yet, relying on sell_price.

    const hasStock = product.stock > 0;
    const lowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = () => {
        router.post(route('user.cart.store'), {
            product_id: product.id,
            qty: quantity,
        }, {
            onSuccess: () => toast.success(`${product.title} ditambahkan ke keranjang`),
            onError: (errors) => {
                toast.error('Gagal menambahkan ke keranjang');
                console.error(errors);
            },
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

    return (
        <UserLayout>
            <Head title={product.title} />

            <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-4 md:py-8 pb-24">
                {/* Back Button & Breadcrumb */}
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="p-1.5 sm:p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center focus:outline-none"
                        title="Kembali"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-indigo-600">Home</Link>
                        <span>/</span>
                        <Link href={route('user.products')} className="hover:text-indigo-600">Katalog</Link>
                        <span>/</span>
                        <span className="text-gray-900">{product.category?.name || 'Umum'}</span>
                    </nav>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Top: Product Image */}
                    <div className="w-full">
                        <div className="relative aspect-square md:aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-3">
                            <img
                                src={product.image || '/images/placeholder.png'}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
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
                    </div>

                    {/* Bottom: Product Info */}
                    <div className="flex-1">
                        {/* Category */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg">{product.category?.name || 'Umum'}</span>
                        </div>

                        {/* Name */}
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
                            {product.title}
                        </h1>

                        {/* SKU & Sold */}
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                            <span>SKU: {product.sku || '-'}</span>
                            <span className="text-gray-300">|</span>
                            <span>{product.sold_count || 0} Terjual</span>
                        </div>

                        {/* Price */}
                        <div className="bg-gray-50 rounded-xl mb-2">
                            <div className="flex items-baseline gap-3">
                                <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                                    {formatPrice(product.sell_price)}
                                </span>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Jumlah</p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                        disabled={!hasStock}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                        disabled={!hasStock}
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

                        {/* Use ProductDetail for extra info if available */}
                        {product.productDetail && (
                            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 block">Berat</span>
                                    <span className="font-medium">{product.productDetail.weight} gram</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 block">Dimensi</span>
                                    <span className="font-medium">
                                        {product.productDetail.length}x{product.productDetail.width}x{product.productDetail.height} cm
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={!hasStock}
                                className="flex-1 py-2.5 px-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                Tambah Keranjang
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={!hasStock}
                                className="flex-1 py-2.5 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                Beli Sekarang
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-6 md:mt-8">
                    <div className="border-b border-gray-200">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'description'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Deskripsi
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviews'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Ulasan ({product.reviews_count || 0})
                            </button>
                        </div>
                    </div>

                    <div className='pt-2'>
                        {activeTab === 'description' && (
                            <div
                                className="prose prose-sm max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: product.description || 'Tidak ada deskripsi.' }}
                            />
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                {/* Rating Summary */}
                                <div className="flex items-center gap-6 mb-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-gray-900">
                                            {product.average_rating ? Number(product.average_rating).toFixed(1) : '-'}
                                        </div>
                                        <div className="flex gap-0.5 mt-1 justify-center">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${(product.average_rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{product.reviews_count || 0} ulasan</p>
                                    </div>
                                </div>

                                {/* Review List */}
                                {reviews?.data?.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.data.map(review => (
                                            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                                                            {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{review.user?.name || 'Anonim'}</p>
                                                            <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-sm text-gray-600 ml-10">{review.comment}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <p className="text-gray-500 text-sm">Belum ada ulasan untuk produk ini</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-6 md:mt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Produk Terkait</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                            {relatedProducts.map(item => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="md:hidden h-20"></div>
        </UserLayout>
    );
}
