import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { useCart } from '@/Context/CartContext';
import toast from 'react-hot-toast';

export default function CartIndex() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart, cartCount } = useCart();

    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const handleCheckout = () => {
        if (cartCount === 0) return;
        
        // Dummy Checkout logic
        const confirm = window.confirm(`Total belanja: ${formatPrice(cartTotal)}. Lanjutkan ke pembayaran?`);
        if (confirm) {
            toast.success("Pesanan berhasil dibuat (Dummy)!");
            clearCart();
        }
    };

    return (
        <UserLayout>
            <Head title="Keranjang Belanja" />
            <div className="max-w-[1240px] px-4 md:px-0 mx-auto w-full py-6 md:py-8 pb-32">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary-600 rounded-full hidden md:block"></div>
                    Keranjang Belanja
                </h1>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Cart Items List */}
                        <div className="flex-1">
                            <div className="bg-white rounded-2xl shadow-[0_1px_6px_0_rgba(49,53,59,0.12)] border border-gray-100 overflow-hidden mb-6">
                                <ul className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                            
                                            <div className="flex items-start gap-4 flex-1">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0 w-20 h-20 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-[14px] sm:text-[15px] font-bold text-[#31353B] leading-snug mb-1 limit-2-lines">
                                                        <Link href="#" className="hover:text-primary-600 transition-colors">
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-[12px] text-gray-500 mb-2">{item.category}</p>
                                                    <p className="text-[15px] font-extrabold text-[#31353B]">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-end sm:justify-start gap-5 mt-2 sm:mt-0 sm:ml-4">
                                                
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors mr-2"
                                                        title="Hapus"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>

                                                    <div className="flex items-center border border-gray-300 rounded-lg bg-white h-8 overflow-hidden shadow-sm">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-8 h-full flex items-center justify-center text-primary-600 hover:bg-gray-50 font-medium"
                                                            disabled={item.qty <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-10 text-center text-[13px] font-bold text-gray-900 leading-none">{item.qty}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-8 h-full flex items-center justify-center text-primary-600 hover:bg-gray-50 font-medium"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-[360px] flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-[0_1px_6px_0_rgba(49,53,59,0.12)] border border-gray-100 p-6 sticky top-24">
                                <h2 className="text-[16px] font-bold text-gray-900 mb-5">Ringkasan Belanja</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-[14px] text-gray-600">
                                        <span>Total Harga ({cartCount} barang)</span>
                                        <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[14px] text-gray-600 hidden">
                                        <span>Total Diskon Barang</span>
                                        <span className="font-medium text-primary-600">- Rp0</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 border-dashed flex justify-between items-center">
                                        <span className="text-[16px] font-bold text-[#31353B]">Total Belanja</span>
                                        <span className="text-xl font-extrabold text-[#31353B]">{formatPrice(cartTotal)}</span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full py-3 px-4 bg-primary-600 text-white font-bold rounded-xl shadow-[0_2px_6px_rgba(3,172,14,0.3)] hover:bg-primary-700 transition-colors text-[15px]"
                                >
                                    Beli ({cartCount})
                                </button>
                                
                                <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                                    <Link href="/katalog" className="text-[14px] text-primary-600 hover:text-primary-800 font-bold flex items-center justify-center gap-1.5 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Lanjut Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-[0_1px_6px_0_rgba(49,53,59,0.12)] border border-gray-100 p-12 text-center py-24 flex flex-col items-center justify-center">
                        <img src="https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/kratos/a8a1ab96.png" alt="Empty Cart" className="w-56 mb-6 opacity-80" />
                        <h2 className="text-[20px] font-bold text-gray-900 mb-2">Keranjang Belanjamu Kosong</h2>
                        <p className="text-[14px] text-gray-500 mb-8 max-w-sm">Mending isi dengan barang-barang impianmu sekarang, yuk mulai belanja!</p>
                        <Link href="/katalog" className="inline-flex items-center justify-center px-8 py-3 font-bold rounded-xl text-white bg-primary-600 shadow-[0_2px_6px_rgba(3,172,14,0.3)] hover:bg-primary-700 transition-colors">
                            Mulai Belanja
                        </Link>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
