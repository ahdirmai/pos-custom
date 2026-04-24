import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useWishlist } from '@/Context/WishlistContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const { isWishlisted, toggle: toggleWishlist } = useWishlist();

    const formatPrice = (value) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const hasStock = product.stock > 0;
    const hasFlashSale = !!product.has_flash_sale;
    const { auth } = usePage().props;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            toast.error('Silakan login untuk belanja');
            router.visit(route('login'));
            return;
        }

        if (hasStock) {
            router.post(route('user.cart.store'), {
                product_id: product.id,
                qty: 1
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        (t) => (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{product.title}</span>
                                <span className="text-primary-600 font-bold">+1</span>
                            </div>
                        ),
                        {
                            duration: 1500,
                            position: 'bottom-center',
                            icon: '🛒',
                        }
                    );
                },
                onError: () => toast.error('Gagal menambahkan ke keranjang')
            });
        }
    };

    return (
        <article className="group relative bg-white rounded-lg flex flex-col h-full shadow-[0_1px_6px_0_rgba(49,53,59,0.12)] hover:shadow-[0_4px_12px_rgba(49,53,59,0.16)] transition-shadow duration-200">
            <Link
                href={route('user.product.show', product.id)}
                className={`flex flex-col h-full w-full ${!hasStock ? 'opacity-75' : ''}`}
                title={product.title}
            >
                {/* Image Section */}
                <div className="relative w-full pt-[100%] overflow-hidden rounded-t-lg bg-gray-50">
                    <img
                        src={product.image || '/images/placeholder.png'}
                        alt={product.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${!hasStock ? 'grayscale' : ''}`}
                        loading="lazy"
                    />
                    
                    {/* Out of Stock Overlay */}
                    {!hasStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                            <span className="px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                                Habis
                            </span>
                        </div>
                    )}
                    
                    {/* Discount Label */}
                    {hasStock && hasFlashSale && (
                        <div className="absolute top-2 -left-[5px] z-10 flex flex-col">
                            <span className="bg-[#f3673b] text-white text-[10px] font-bold px-2 py-[4px] rounded-[8px_12px_12px_0] h-[20px] flex items-center justify-center tracking-[0.1px]">
                                -{product.discount_percentage}%
                            </span>
                            <span className="block w-[5px] h-[5px] bg-[#e03f0d] rounded-bl-[5px]"></span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-[8px]">
                    <h2 className="text-[13px] md:text-[14px] leading-[1.5] text-[#212121] line-clamp-2 overflow-hidden break-words mb-1">
                        {product.title}
                    </h2>
                    
                    <div className="flex flex-col mt-auto mb-[2px]">
                        <span className="text-[14px] font-bold text-[#212121] leading-[18px]">
                            {formatPrice(product.current_price || product.sell_price)}
                        </span>
                        {hasFlashSale && (
                            <span className="text-[10px] text-[#aab4c8] line-through mt-0.5">
                                {formatPrice(product.original_price || product.sell_price)}
                            </span>
                        )}
                    </div>

                    {/* Rating and Sold */}
                    <div className="flex items-center mt-1 text-[12px] text-[#6d7588]">
                        <svg className="w-4 h-4 text-amber-400 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        <span className="mr-1">{product.average_rating ? Number(product.average_rating).toFixed(1) : '0.0'}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-[#aab4c8] mx-1"></span>
                        <span className="truncate">{product.sold_count || 0} terjual</span>
                    </div>

                    {/* Location / Shop (Dummy or from relation) */}
                    <div className="flex flex-col flex-1 text-left mt-2">
                        <span className="text-[12px] text-[#6d7588] truncate">
                            {product.category?.name || 'Umum'}
                        </span>
                        <span className="text-[12px] text-[#6d7588] truncate font-medium">
                            Toko Utama
                        </span>
                    </div>
                </div>
            </Link>

            {/* Hover Actions (Wishlist & Cart logic) */}
            <div className="absolute right-2 top-2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:text-primary-600 transition-colors"
                    title={isWishlisted(product.id) ? 'Hapus wishlist' : 'Tambah wishlist'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${isWishlisted(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
        </article>
    );
}
