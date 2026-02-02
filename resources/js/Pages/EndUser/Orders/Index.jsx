import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedUserLayout from '@/Layouts/AuthenticatedUserLayout';

export default function OrderIndex({ transactions }) {
    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-indigo-100 text-indigo-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Belum Bayar';
            case 'processing': return 'Diproses';
            case 'shipped': return 'Dikirim';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <AuthenticatedUserLayout>
            <Head title="Riwayat Pesanan" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Riwayat Pesanan</h1>

                {transactions.data.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">Belum ada pesanan</h3>
                        <p className="mt-1 text-gray-500">Anda belum melakukan transaksi apapun.</p>
                        <div className="mt-6">
                            <Link href={route('user.products')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                Mulai Belanja
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transactions.data.map((transaction) => (
                            <Link 
                                key={transaction.id} 
                                href={route('user.invoice', transaction.id)}
                                className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:border-indigo-500 transition-colors p-6"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-indigo-600">{transaction.invoice}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.order_status)}`}>
                                                {getStatusLabel(transaction.order_status)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                        <div className="text-sm text-gray-900">
                                            <span className="font-medium">Total: </span>
                                            {formatPrice(transaction.grand_total)}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-4 min-w-[200px]">
                                        <div className="text-right">
                                            {transaction.tracking_number && (
                                                <p className="text-xs text-gray-500 mb-1">Resi: {transaction.tracking_number}</p>
                                            )}
                                            <p className="text-sm text-gray-600">{transaction.shipping_courier}</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                
                {/* Pagination */}
                {transactions.links && transactions.links.length > 3 && (
                     <div className="mt-8 flex justify-center">
                        <div className="flex gap-1">
                            {transactions.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`px-4 py-2 text-sm rounded-lg ${
                                        link.active 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                     </div>
                )}
            </div>
        </AuthenticatedUserLayout>
    );
}
