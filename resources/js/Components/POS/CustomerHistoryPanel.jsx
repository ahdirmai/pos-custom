import React, { useState, useEffect } from "react";
import {
    IconHistory,
    IconCoin,
    IconCalendar,
    IconShoppingBag,
    IconX,
    IconLoader2,
    IconReceipt,
} from "@tabler/icons-react";

const formatPrice = (value = 0) =>
    value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });

export default function CustomerHistoryPanel({
    customerId,
    customerName,
    customerRegency,
    onClose,
}) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!customerId) return;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(route("customers.history", customerId), {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const result = await response.json();
                if (result.success) {
                    setData(result);
                } else {
                    setError(result.message || "Gagal memuat data");
                }
            } catch (err) {
                console.error("Customer history error:", err);
                setError("Gagal memuat data pelanggan");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [customerId]);

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl">
                <IconLoader2 size={40} className="animate-spin text-primary-500 mb-4" />
                <p className="text-slate-500 animate-pulse">Memuat riwayat...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl">
                <p className="text-danger-500 font-medium">{error}</p>
                <button onClick={onClose} className="mt-4 text-sm text-primary-500 underline">Tutup</button>
            </div>
        );
    }

    if (!data) return null;

    const { stats, recent_transactions, frequent_products } = data;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <IconHistory size={22} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-none">Riwayat Pelanggan</h3>
                        <p className="text-xs text-primary-100 mt-1 uppercase tracking-wider font-medium">Informasi Detail & Transaksi</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
                    >
                        <IconX size={24} />
                    </button>
                )}
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto custom-scrollbar">
                {/* Customer Info Section */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {customerName}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                        {customerRegency || "Wilayah tidak diketahui"}
                    </p>
                </div>

                {/* Stats Grid - Responsive (1 col mobile, 3 cols desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                    {/* Card 1 */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none group">
                        <IconReceipt size={70} className="absolute -right-4 -top-4 text-white opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Total Transaksi</p>
                            <p className="text-3xl font-black text-white mt-2 leading-none">
                                {stats.total_transactions}
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none group">
                        <IconCoin size={70} className="absolute -right-4 -top-4 text-white opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Total Belanja</p>
                            <p className="text-2xl font-black text-white mt-2 leading-none">
                                {formatPrice(stats.total_spent).replace("Rp", "Rp ")}
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-2xl shadow-lg shadow-amber-200 dark:shadow-none group">
                        <IconCalendar size={70} className="absolute -right-4 -top-4 text-white opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-amber-100 uppercase tracking-widest">Kunjungan Terakhir</p>
                            <p className="text-xl font-black text-white mt-2 leading-none">
                                {stats.last_visit || "Belum Ada"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-6">
                    {/* Frequent Products */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                            <IconShoppingBag size={18} className="text-primary-500" />
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Produk Favorit</h4>
                        </div>
                        {frequent_products && frequent_products.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {frequent_products.map((product) => (
                                    <span
                                        key={product.id}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-sm font-semibold text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900"
                                    >
                                        {product.title}
                                        <span className="px-1.5 py-0.5 rounded-md bg-primary-500 text-white text-[10px]">
                                            {product.total_qty}x
                                        </span>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Data produk belum tersedia</p>
                        )}
                    </div>

                    {/* Recent Transactions */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                            <IconReceipt size={18} className="text-primary-500" />
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Transaksi Terakhir</h4>
                        </div>
                        <div className="space-y-3">
                            {recent_transactions && recent_transactions.length > 0 ? (
                                recent_transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                #{tx.invoice}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {tx.date}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900 dark:text-white">
                                                {formatPrice(tx.total)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic text-center py-4">Belum ada riwayat transaksi</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CustomerHistoryButton({
    customerId,
    customerName,
    customerRegency = "",
    className = "",
}) {
    const [showHistory, setShowHistory] = useState(false);

    if (!customerId) return null;

    return (
        <>
            <button
                onClick={() => setShowHistory(true)}
                className={`p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary-500 hover:text-primary-500 transition-all active:scale-95 ${className}`}
                title="Lihat riwayat"
            >
                <IconHistory size={18} />
            </button>

            {/* History Modal Overlay */}
            {showHistory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
                    {/* Width updated to max-w-2xl or max-w-4xl for larger feel */}
                    <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-200">
                        <CustomerHistoryPanel
                            customerId={customerId}
                            customerName={customerName}
                            customerRegency={customerRegency}
                            onClose={() => setShowHistory(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}