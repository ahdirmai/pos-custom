import React, { useEffect, useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function InvoiceIndex({ order }) {
    const { storeProfile } = usePage().props;
    const [orderData, setOrderData] = useState(null);

    // Load last order from localStorage
    useEffect(() => {
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
            setOrderData(JSON.parse(lastOrder));
        }
    }, []);

    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const store = useMemo(() => ({
        name: storeProfile?.name || 'Toko Online',
        logo: storeProfile?.logo || null,
        address: storeProfile?.address || '',
        phone: storeProfile?.phone || '',
        email: storeProfile?.email || '',
    }), [storeProfile]);

    // Generate simple barcode visualization
    const SimpleBarcode = ({ value }) => {
        const bars = useMemo(() => {
            const data = value || '';
            return data.split('').map((char, idx) => {
                const weight = (char.charCodeAt(0) + idx * 17) % 5;
                return 2 + weight;
            });
        }, [value]);

        return (
            <div className="flex items-end gap-[1px] justify-center mt-3">
                {bars.map((w, i) => (
                    <span
                        key={i}
                        style={{ width: `${w}px` }}
                        className="h-8 bg-gray-800 block"
                    />
                ))}
            </div>
        );
    };

    if (!orderData) {
        return (
            <UserLayout>
                <Head title="Invoice" />
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Pesanan</h1>
                    <p className="text-gray-500 mb-6">Data pesanan tidak ditemukan atau sudah kedaluwarsa.</p>
                    <Link href="/katalog" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                        Kembali Belanja
                    </Link>
                </div>
            </UserLayout>
        );
    }

    const items = orderData.items || [];
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    return (
        <UserLayout>
            <Head title={`Invoice ${orderData.invoice}`} />
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Success Banner */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-semibold text-green-800">Pesanan Berhasil Dibuat!</h2>
                        <p className="text-sm text-green-600">Terima kasih atas pesanan Anda. Simpan halaman ini sebagai bukti.</p>
                    </div>
                </div>

                {/* Invoice Card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-6 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    {store.logo ? (
                                        <img src={store.logo} alt={store.name} className="w-8 h-8 object-contain" />
                                    ) : (
                                        <span className="text-xl font-bold">{store.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{store.name}</p>
                                    {store.address && <p className="text-xs opacity-80">{store.address}</p>}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wider opacity-80">Invoice</p>
                                <p className="text-xl font-bold">{orderData.invoice}</p>
                                <p className="text-sm opacity-80">{orderData.date}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Penerima</p>
                                <p className="font-semibold text-gray-900">{orderData.customer.name}</p>
                                <p className="text-sm text-gray-600">{orderData.customer.phone}</p>
                                <p className="text-sm text-gray-600">{orderData.customer.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Status</p>
                                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                                    Menunggu Pembayaran
                                </span>
                                <p className="text-sm text-gray-600 mt-1">Metode: COD</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="px-6 py-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Produk</th>
                                    <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Qty</th>
                                    <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center text-gray-600">{item.qty}</td>
                                        <td className="py-3 text-right font-semibold text-gray-900">{formatPrice(item.price * item.qty)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 px-6 py-4">
                        <div className="max-w-xs ml-auto space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Ongkos Kirim</span>
                                <span className="text-green-600 font-medium">Gratis</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-indigo-600">{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Barcode + Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Invoice: {orderData.invoice}</p>
                        <SimpleBarcode value={orderData.invoice} />
                        <p className="text-xs text-gray-500 mt-4">Terima kasih telah berbelanja</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link 
                        href="/" 
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Kembali ke Home
                    </Link>
                    <button 
                        onClick={() => window.print()}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak Invoice
                    </button>
                </div>
            </div>
        </UserLayout>
    );
}
