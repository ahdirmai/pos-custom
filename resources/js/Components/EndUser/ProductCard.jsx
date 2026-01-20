import React from 'react';
import { Link } from '@inertiajs/react';
import { useCart } from '@/Context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    // Format price to IDR
    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const hasStock = product.stock > 0;
    const lowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasStock) {
            addToCart(product);
            toast.success(
                (t) => (
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-green-600 font-bold">+1</span>
                    </div>
                ),
                {
                    duration: 1500,
                    position: 'bottom-center',
                    style: {
                        background: '#fff',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    },
                    icon: '🛒',
                }
            );
        }
    };

    return (
        <Link 
            href="#" 
            className={`group relative flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${!hasStock ? 'opacity-75' : ''}`}
        >
            {/* Image Section */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:blur-[2px] ${!hasStock ? 'grayscale' : ''}`}
                    loading="lazy"
                />
                
                {/* Stock Badge (Top Right) */}
                 <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
                    {!hasStock ? (
                        <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                            Habis
                        </span>
                    ) : lowStock ? (
                        <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm animate-pulse">
                            Sisa {product.stock}
                        </span>
                    ) : (
                         <span className="px-2 py-1 bg-gray-900/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-lg shadow-sm">
                            Stok: {product.stock}
                        </span>
                    )}
                 </div>

                {/* Category Badge (Top Left) */}
                 <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {product.category || 'Produk'}
                    </span>
                 </div>
                 
                 {/* Hover Action Buttons */}
                 <div className="hidden md:flex absolute inset-0 z-20 items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Detail Button */}
                    <button 
                        className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-100 hover:scale-110 transition-all duration-200"
                        title="Lihat Detail"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>

                    {/* Add to Cart Button */}
                    {hasStock && (
                        <button 
                            onClick={handleAddToCart}
                            className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 hover:scale-110 transition-all duration-200"
                            title="Tambah ke Keranjang"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                 </div>
            </div>

            {/* Content Section */}
            <div className="p-2 sm:p-3 flex-1 flex flex-col bg-white">
                <div className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                    {product.name}
                </div>
                
                {/* Rating & Sold */}
                {(product.rating || product.sold_count) && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] sm:text-xs text-gray-500">
                        {product.rating && (
                            <div className="flex items-center gap-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>{product.rating}</span>
                            </div>
                        )}
                        {product.rating && product.sold_count && <span>|</span>}
                        {product.sold_count && <span>{product.sold_count}+ terjual</span>}
                    </div>
                )}
                
                <div className="mt-auto border-t mt-1 border-gray-50 flex flex-col gap-2">
                    <p className="text-sm sm:text-base font-bold text-indigo-600">
                        {formatPrice(product.price)}
                    </p>
                    {/* Mobile Only: Full Width Add Button */}
                    {hasStock && (
                        <button 
                            onClick={handleAddToCart}
                            className="md:hidden w-full py-1.5 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1 active:bg-indigo-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add
                        </button>
                    )}
                </div>
            </div>
        </Link>
    );
}
