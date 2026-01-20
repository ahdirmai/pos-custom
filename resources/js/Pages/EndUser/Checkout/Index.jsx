import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { useCart } from '@/Context/CartContext';
import toast from 'react-hot-toast';

export default function CheckoutIndex() {
    const { cartItems, cartTotal, clearCart } = useCart();
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: '',
        paymentMethod: 'cod'
    });

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            router.get('/katalog');
             toast.error('Keranjang belanja kosong');
        }
    }, [cartItems]);

    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation (Simple)
        if (!formData.name || !formData.phone || !formData.address) {
            toast.error('Mohon lengkapi data pengiriman');
            return;
        }

        // Generate order data
        const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const invoiceNumber = 'INV-' + orderId.toUpperCase().substr(0, 8);
        
        const orderData = {
            id: orderId,
            invoice: invoiceNumber,
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            items: cartItems,
            customer: {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
            },
            paymentMethod: formData.paymentMethod,
            note: formData.note,
        };

        // Save to localStorage
        localStorage.setItem('lastOrder', JSON.stringify(orderData));

        // Show loading toast
        const loadingToast = toast.loading('Memproses pesanan...');

        // Simulate API Call
        setTimeout(() => {
            clearCart();
            toast.dismiss(loadingToast);
            toast.success('Pesanan berhasil dibuat!');
            
            // Use window.location for reliable redirect
            window.location.href = `/nota/${orderId}`;
        }, 1500);
    };

    if (cartItems.length === 0) return null;

    return (
        <UserLayout>
            <Head title="Checkout" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout Pesanan</h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Shipping Info */}
                    <div className="flex-grow space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Informasi Pengiriman
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Nama Penerima</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Contoh: John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                                    <input 
                                        type="tel" 
                                        required
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="081234567890"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                                    <textarea 
                                        rows="3"
                                        required
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Contoh: Titip di pos satpam"
                                        value={formData.note}
                                        onChange={e => setFormData({...formData, note: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Metode Pembayaran
                            </h2>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">Bayar di Tempat (COD)</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Bayar tunai saat kurir mengantar barang.</p>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${formData.paymentMethod === 'transfer' ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="transfer"
                                        checked={formData.paymentMethod === 'transfer'}
                                        onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                                        disabled
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1 opacity-60">
                                         <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">Transfer Bank (Coming Soon)</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Transfer otomatis & konfirmasi instan.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
                            
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="h-12 w-12 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.qty} x {formatPrice(item.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.qty)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal Produk</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Ongkos Kirim</span>
                                    <span className="text-green-600 font-medium">Gratis</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                                    <span className="text-base font-bold text-gray-900">Total Pembayaran</span>
                                    <span className="text-xl font-bold text-indigo-600">{formatPrice(cartTotal)}</span>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Buat Pesanan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
