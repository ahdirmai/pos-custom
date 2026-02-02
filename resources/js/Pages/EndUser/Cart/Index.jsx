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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Keranjang Belanja</h1>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="flex-grow">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <ul className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="p-4 sm:p-6 flex items-center gap-4">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    <Link href="#" className="hover:text-indigo-600 transition-colors">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                                <p className="text-sm font-bold text-indigo-600 mt-1 sm:hidden">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>

                                            {/* Price (Desktop) */}
                                            <div className="hidden sm:block text-right w-32">
                                                <p className="text-sm font-bold text-indigo-600">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-indigo-500 focus:outline-none"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-indigo-500 focus:outline-none"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Hapus item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-96 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Total Item</span>
                                        <span>{cartCount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <span className="text-base font-bold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-indigo-600">{formatPrice(cartTotal)}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Checkout (Dummy)
                                </button>
                                <div className="mt-4 text-center">
                                    <Link href="/katalog" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                        Lanjut Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Keranjang Anda Kosong</h2>
                        <p className="text-gray-500 mb-8">Wah, keranjang belanjaanmu masih kosong nih. Yuk, mulai belanja!</p>
                        <Link href="/katalog" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700">
                            Mulai Belanja
                        </Link>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
