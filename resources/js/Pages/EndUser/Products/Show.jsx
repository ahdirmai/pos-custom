import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import ProductCard from '@/Components/EndUser/ProductCard';
import toast from 'react-hot-toast';

export default function ProductShow({ product, reviews, relatedProducts, vouchers = [] }) {
    const { storeProfile } = usePage().props;
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeVouchers, setActiveVouchers] = useState([]);

    const toggleVoucher = (voucher) => {
        setActiveVouchers((prev) => {
            const isSelected = prev.find(v => v.id === voucher.id);
            if (isSelected) {
                return prev.filter(v => v.id !== voucher.id);
            } else {
                const filtered = prev.filter(v => v.discount_target !== voucher.discount_target);
                return [...filtered, voucher];
            }
        });
    };

    const formatPrice = (value) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const hasFlashSale = !!product.has_flash_sale;
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
            is_buy_now: true,
            vouchers: activeVouchers.map(v => v.code)
        }, {
            onError: () => toast.error('Gagal memproses pesanan'),
        });
    };

    return (
        <UserLayout hideMobileNav={true}>
            <Head title={product.title} />

            <div className="max-w-[1240px] px-4 md:px-0 mx-auto w-full py-4 md:py-8 pb-4 md:pb-8">

                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 mb-6 text-[13px] text-gray-500 bg-white p-3 rounded-lg shadow-[0_1px_6px_0_rgba(49,53,59,0.12)]">
                    <button
                        onClick={() => window.history.back()}
                        className="mr-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Kembali"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <Link href="/" className="hover:text-primary-600 font-medium">Beranda</Link>
                    <span className="text-gray-300">/</span>
                    <Link href={route('user.products')} className="hover:text-primary-600 font-medium">Katalog</Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-xs">{product.category?.name || 'Umum'}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Left: Product Image */}
                    <div className="w-full lg:w-5/12 xl:w-4/12 flex-shrink-0">
                        <div className="sticky top-24 relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-[0_1px_6px_0_rgba(49,53,59,0.12)] border border-gray-100 p-2">
                            <div className="w-full h-full rounded-xl overflow-hidden relative">
                                <img
                                    src={product.image || '/images/placeholder.png'}
                                    alt={product.title}
                                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                />
                                {/* Overlay / Status */}
                                {!hasStock && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                                        <span className="px-4 py-2 bg-gray-900 text-white text-sm font-bold tracking-widest uppercase rounded">
                                            Habis Terjual
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex-1">
                        {/* Main Details Area */}
                        <div className="flex-1">
                            <div className="mb-[15px]">
                                <h1 className="text-[16px] md:text-[18px] text-[#212121] font-bold leading-snug mb-2">
                                    {product.title}
                                </h1>
                                <h2 className="text-[24px] font-bold text-[#212121] tracking-tight leading-none mb-1">
                                    {formatPrice(product.current_price || product.sell_price)}
                                </h2>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    {hasFlashSale && (
                                        <>
                                            <div className="text-[16px] font-medium text-[#9fa6b0] line-through">
                                                {formatPrice(product.original_price || product.sell_price)}
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#fff1ec] text-[#e65100] text-[12px] font-bold">
                                                Hemat {product.discount_percentage}%
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#fee2e2] text-[#b91c1c] text-[12px] font-bold tracking-wide uppercase">
                                                Flash Sale
                                            </span>
                                        </>
                                    )}
                                </div>



                                <div className="flex items-center text-[13px] text-[#6d7588] mt-2 mb-4">
                                    <svg className="w-4 h-4 text-amber-400 mr-1 pb-[1px]" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-extrabold text-[#212121] mr-1">{product.average_rating ? Number(product.average_rating).toFixed(1) : '-'}</span>
                                    <span className="mr-1">({product.reviews_count || 0})</span>
                                    <span className="mx-1 text-[#aab4c8]">•</span>
                                    <span>{product.sold_count || '0'} terjual</span>
                                </div>
                            </div>

                            {/* Thin Divider */}
                            <hr className="border-gray-200" />

                            {/* Shipping Estimate Info */}
                            <div className="flex justify-between items-center py-4">
                                <div className="flex items-center text-[14px] font-bold text-[#212121]">
                                    <svg className="w-[18px] h-[18px] mr-2 text-[#6d7588]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8h-4V7M6 16v-3m10 3v-3m0 3h-4m-6 0H4M8 16A2 2 0 108 20 2 2 0 008 16zM18 16A2 2 0 1018 20 2 2 0 0018 16z" />
                                    </svg>
                                    Dikirim dari <span className="ml-[3px] text-[#212121]">{storeProfile?.city || 'Gudang Pusat'}</span>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Quantity Selector */}
                            <div className="py-4 flex items-center justify-between">
                                <span className="text-[14px] font-bold text-[#212121]">Atur Jumlah</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-[#e5e7e9] rounded-lg bg-white h-8 overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-full flex items-center justify-center text-primary-600 hover:bg-gray-50 border-r border-[#e5e7e9] disabled:text-gray-300"
                                            disabled={!hasStock || quantity <= 1}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3]" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="w-12 text-center font-bold text-[13px] text-[#212121] leading-none">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            className="w-8 h-full flex items-center justify-center text-primary-600 hover:bg-gray-50 border-l border-[#e5e7e9] disabled:text-gray-300"
                                            disabled={!hasStock || quantity >= product.stock}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3]" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <span className={`text-[12px] font-medium ${lowStock ? 'text-red-500' : 'text-[#656C7B]'}`}>
                                        Sisa {product.stock}
                                    </span>
                                </div>
                            </div>

                            {/* Thick Divider / Space (Mobile Only) */}
                            <div className="h-[8px] md:hidden bg-[#f3f4f5] -mx-4 my-4"></div>
                            <hr className="hidden md:block border-[#e5e7e9] mt-2 mb-4" />

                            {/* Store Info */}
                            <div className="flex items-center pt-2 pb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#1019A1] to-[#01B9FD] rounded-full flex items-center justify-center text-white italic text-3xl mr-3 font-serif overflow-hidden">
                                    {storeProfile?.logo ? (
                                        <img src={storeProfile.logo} className="w-full h-full object-cover" alt={storeProfile?.name || 'Logo'} />
                                    ) : (
                                        <span className="relative top-[-2px]">{storeProfile?.name?.charAt(0) || 'T'}</span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center text-[18px] font-bold text-[#212121]">
                                        <svg className="w-5 h-5 text-[#863df7] mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {storeProfile?.name || 'Toko Utama'}
                                    </div>
                                    <div className="text-[14px] text-[#6d7588] mt-0.5 ml-1">
                                        {storeProfile?.city || storeProfile?.address || 'Lokasi Toko'}
                                    </div>
                                </div>
                            </div>

                            {/* Keep any extra divs aligned properly below */}


                            {/* Additional Information details */}
                            {product.productDetail && (
                                <div className="py-4 border-y border-gray-100 mb-6 flex flex-wrap gap-y-4 text-[13px]">
                                    <div className="w-1/2">
                                        <span className="block text-gray-500 mb-1">Berat Standar</span>
                                        <span className="font-bold text-gray-900">{product.productDetail.weight} gram</span>
                                    </div>
                                    <div className="w-1/2">
                                        <span className="block text-gray-500 mb-1">Kondisi</span>
                                        <span className="font-bold text-gray-900">Baru</span>
                                    </div>
                                    <div className="w-1/2">
                                        <span className="block text-gray-500 mb-1">Dimensi</span>
                                        <span className="font-bold text-gray-900">
                                            {product.productDetail.length} x {product.productDetail.width} x {product.productDetail.height} cm
                                        </span>
                                    </div>
                                    <div className="w-1/2">
                                        <span className="block text-gray-500 mb-1">Kategori</span>
                                        <span className="font-bold text-primary-600">{product.category?.name || 'Umum'}</span>
                                    </div>
                                </div>
                            )}

                            {/* Tabs Component embedded gracefully */}
                            <div className="mt-8">
                                <div className="flex gap-6 border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`pb-3 text-[15px] font-bold border-b-2 transition-colors ${activeTab === 'description'
                                            ? 'border-primary-600 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Detail Produk
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`pb-3 text-[15px] font-bold border-b-2 transition-colors ${activeTab === 'reviews'
                                            ? 'border-primary-600 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Ulasan ({product.reviews_count || 0})
                                    </button>
                                </div>

                                <div className='pt-4'>
                                    {activeTab === 'description' && (
                                        <div
                                            className="prose prose-sm max-w-none text-[#31353b] leading-relaxed text-[14px]"
                                            dangerouslySetInnerHTML={{ __html: product.description || '<p>Tidak ada detail deskripsi untuk produk ini.</p>' }}
                                        />
                                    )}

                                    {activeTab === 'reviews' && (
                                        <div className="animate-fade-in">
                                            {/* Rating Summary */}
                                            {product.reviews_count > 0 ? (
                                                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
                                                    <div className="text-center md:border-r md:border-gray-200 md:pr-8">
                                                        <div className="text-5xl font-extrabold text-gray-900 mb-2">
                                                            {Number(product.average_rating).toFixed(1)}
                                                            <span className="text-xl text-gray-400 font-medium">/5</span>
                                                        </div>
                                                        <div className="flex justify-center gap-1 mb-2">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${(product.average_rating || 0) >= star ? 'text-amber-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                        <p className="text-[13px] font-bold text-gray-500">{product.reviews_count} ulasan pembeli</p>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {/* Review List */}
                                            {reviews?.data?.length > 0 ? (
                                                <div className="space-y-6">
                                                    {reviews.data.map(review => (
                                                        <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                                                                        {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[14px] font-bold text-gray-900">{review.user?.name || 'Anonim'}</p>
                                                                        <p className="text-[12px] text-gray-400">{new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-0.5">
                                                                    {[1, 2, 3, 4, 5].map(star => (
                                                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${review.rating >= star ? 'text-amber-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {review.comment && (
                                                                <p className="text-[14px] text-gray-700 ml-14 leading-relaxed">{review.comment}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                    </svg>
                                                    <p className="text-gray-900 font-bold mb-1">Belum Ada Ulasan</p>
                                                    <p className="text-gray-500 text-[13px]">Jadilah yang pertama memberikan ulasan untuk produk ini.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>



                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-6 md:mt-8 pt-6 border-t border-[#E5E7E9]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-[1.14286rem] md:text-xl font-bold text-[#212121] leading-[22px] tracking-tight">Produk Terkait</h3>
                            </div>
                            <Link href={route('user.products')} className="text-[14px] font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                            {relatedProducts.map(item => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Padding at the bottom for floating section */}
                <div className="h-[90px] md:h-[80px]"></div>
            </div>

            {/* Floating Action Bar (Beli Sekarang) - Reference Match */}
            <div className="fixed z-[100] bottom-0 left-0 right-0 bg-white border-t border-[#E5E7E9] shadow-[0_-2px_6px_0_rgba(49,53,59,0.16)] pb-safe rounded-t-2xl md:rounded-none">
                <div className="max-w-[1240px] mx-auto w-full px-5 py-3 md:py-4 flex items-center justify-between gap-4">

                    {/* Left: Store Info & Product Info (Hidden on mobile) */}
                    <div className="hidden lg:flex items-center gap-4 flex-1 overflow-hidden">
                        <div className="w-[48px] h-[48px] rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center font-serif text-white font-bold text-xl bg-gradient-to-br from-[#1019A1] to-[#01B9FD]">
                            {product.image ? (
                                <img src={product.image} className="w-full h-full object-cover" alt="Product" />
                            ) : (
                                <span>{product?.title?.charAt(0) || 'P'}</span>
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden w-[320px]">
                            <h3 className="text-[14px] font-bold text-[#212121] truncate w-full leading-snug">
                                {product.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-extrabold text-[14px] text-[#212121]">
                                    {formatPrice(product.sell_price * quantity)}
                                </span>
                                {product.discount > 0 && (
                                    <span className="text-[12px] text-[#9fa6b0] line-through font-normal">
                                        {formatPrice((product.original_price || product.sell_price * 1.2) * quantity)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2.5 w-full lg:w-auto h-[44px]">
                        <button
                            onClick={() => {
                                setIsWishlisted(!isWishlisted);
                                toast.success(isWishlisted ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
                            }}
                            className={`flex lg:hidden flex-shrink-0 w-[44px] h-[44px] items-center justify-center border rounded-lg transition-colors ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-[#E5E7E9] text-[#6d7588] bg-white hover:bg-gray-50'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isWishlisted ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        <a href="#" className="hidden lg:flex min-w-[100px] h-[44px] px-4 items-center justify-center gap-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-sm text-[15px]">
                            <svg fill="currentColor" height="15" viewBox="0 0 16 16" width="15">
                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                            </svg>
                            Chat
                        </a>

                        <button
                            onClick={handleBuyNow}
                            disabled={!hasStock}
                            className="flex-1 lg:flex-none h-[44px] lg:px-6 min-w-[140px] flex items-center justify-center bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors shadow-[0_2px_6px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed text-[15px] font-extrabold whitespace-nowrap"
                        >
                            Beli Langsung
                        </button>

                        <button
                            onClick={handleAddToCart}
                            disabled={!hasStock}
                            className="flex-1 lg:flex-none h-[44px] lg:px-6 min-w-[140px] flex items-center justify-center bg-primary-600 text-white rounded-lg font-extrabold hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-[15px] whitespace-nowrap"
                        >
                            <span className="mr-1.5 font-normal">+</span> Keranjang
                        </button>
                    </div>
                </div>
            </div>

        </UserLayout>
    );
}
