import React, { useEffect, useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Pagination from "@/Components/Dashboard/Pagination";
import {
    IconDatabaseOff,
    IconSearch,
    IconHistory,
    IconReceipt,
    IconPrinter,
    IconFilter,
    IconX,
    IconCheck,
    IconTruckDelivery,
    IconPackage,
    IconReload,
    IconBan,
    IconEye,
    IconCash,
} from "@tabler/icons-react";

const defaultFilters = {
    invoice: "",
    start_date: "",
    end_date: "",
    status: "",
};

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const Orders = ({ transactions, filters }) => {
    const [filterData, setFilterData] = useState({
        ...defaultFilters,
        ...filters,
    });
    const [showFilters, setShowFilters] = useState(false);

    // Modal states
    const [resiModal, setResiModal] = useState({
        open: false,
        transaction: null,
        tracking_number: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFilterData({
            ...defaultFilters,
            ...filters,
        });
    }, [filters]);

    const handleChange = (field, value) => {
        setFilterData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyFilters = (event) => {
        event.preventDefault();
        router.get(route("transactions.orders"), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilterData(defaultFilters);
        router.get(route("transactions.orders"), defaultFilters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    // Actions
    const updateStatus = (transaction, status) => {
        if (!confirm(`Ubah status menjadi ${status}?`)) return;

        router.patch(route('transactions.updateStatus', transaction.id), {
            status: status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Toast handled by layout/flash
            }
        });
    };

    const submitResi = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.patch(route('transactions.updateResi', resiModal.transaction.id), {
            tracking_number: resiModal.tracking_number
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setResiModal({ open: false, transaction: null, tracking_number: "" });
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const rows = transactions?.data ?? [];
    const links = transactions?.links ?? [];
    const currentPage = transactions?.current_page ?? 1;
    const perPage = transactions?.per_page ? Number(transactions?.per_page) : rows.length || 1;

    const hasActiveFilters = filterData.invoice || filterData.start_date || filterData.end_date || filterData.status;

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
            case 'processing':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Diproses</span>;
            case 'shipped':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Dikirim</span>;
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Selesai</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Batal</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">-</span>;
        }
    };

    return (
        <>
            <Head title="Pesanan Online" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <IconPackage size={28} className="text-primary-500" />
                            Pesanan Online
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Kelola pesanan masuk dari pelanggan
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters || hasActiveFilters
                                ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-950/50 dark:border-primary-800 dark:text-primary-400"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                }`}
                        >
                            <IconFilter size={18} />
                            <span>Filter</span>
                            {hasActiveFilters && (
                                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-slide-up">
                        <form onSubmit={applyFilters}>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nomor Invoice</label>
                                    <input
                                        type="text"
                                        placeholder="TRX-..."
                                        value={filterData.invoice}
                                        onChange={(e) => handleChange("invoice", e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                                    <select
                                        value={filterData.status}
                                        onChange={(e) => handleChange("status", e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Diproses</option>
                                        <option value="shipped">Dikirim</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled">Batal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={filterData.start_date}
                                        onChange={(e) => handleChange("start_date", e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button type="submit" className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors">
                                        <IconSearch size={18} />
                                        <span>Cari</span>
                                    </button>
                                    {hasActiveFilters && (
                                        <button type="button" onClick={resetFilters} className="h-11 px-4 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 transition-colors">
                                            <IconX size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Orders List Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 bg-opacity-50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Bayar</th>
                                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Pesanan</th>
                                    <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {rows.length > 0 ? (
                                    rows.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{transaction.invoice}</span>
                                                {transaction.tracking_number && (
                                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                        <IconTruckDelivery size={12} />
                                                        {transaction.tracking_number}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                                                {transaction.created_at}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{transaction.customer?.name ?? 'Guest'}</div>
                                                <div className="text-xs text-slate-500">{transaction.customer?.phone ?? '-'}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                                                {formatCurrency(transaction.grand_total)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                {/* Payment Status Logic */}
                                                {transaction.payment_status === 'paid' ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Dibayar ({transaction.payment_method})
                                                    </span>
                                                ) : transaction.payment_status === 'pending' && transaction.payment_proof ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                            Belum Dikonfirmasi
                                                        </span>
                                                        <button
                                                            onClick={() => window.open(`/storage/${transaction.payment_proof}`, '_blank')}
                                                            className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                                                        >
                                                            <IconEye size={12} /> Lihat Bukti
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-center">
                                                {renderStatusBadge(transaction.order_status)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Confirm Payment Action */}
                                                    {transaction.payment_status === 'pending' && transaction.payment_proof && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Konfirmasi pembayaran ini valid?')) {
                                                                    router.patch(route('transactions.confirm-payment', transaction.id), {}, { preserveScroll: true });
                                                                }
                                                            }}
                                                            className="p-2 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-50"
                                                            title="Konfirmasi Pembayaran"
                                                        >
                                                            <IconCash size={18} />
                                                        </button>
                                                    )}

                                                    <Link href={route('transactions.print', transaction.invoice)} className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100" title="Print Invoice">
                                                        <IconPrinter size={18} />
                                                    </Link>

                                                    {transaction.order_status === 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(transaction, 'processing')}
                                                            className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                                                        >
                                                            <IconReload size={14} /> Proses
                                                        </button>
                                                    )}

                                                    {transaction.order_status === 'processing' && (
                                                        <button
                                                            onClick={() => setResiModal({ open: true, transaction: transaction, tracking_number: transaction.tracking_number || '' })}
                                                            className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 border border-purple-200 flex items-center gap-1"
                                                        >
                                                            <IconTruckDelivery size={14} /> Kirim
                                                        </button>
                                                    )}



                                                    {['pending', 'processing'].includes(transaction.order_status) && (
                                                        <button
                                                            onClick={() => updateStatus(transaction, 'cancelled')}
                                                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                                            title="Batalkan Pesanan"
                                                        >
                                                            <IconBan size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <IconDatabaseOff size={32} className="mb-2 text-slate-300" />
                                                <p>Belum ada data pesanan online</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {links.length > 3 && <Pagination links={links} />}
            </div>

            {/* Input Resi Modal */}
            {resiModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setResiModal({ open: false, transaction: null, tracking_number: "" })} />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Input Nomor Resi</h3>
                        <form onSubmit={submitResi}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nomor Resi / Tracking Number</label>
                                <input
                                    type="text"
                                    required
                                    value={resiModal.tracking_number}
                                    onChange={(e) => setResiModal({ ...resiModal, tracking_number: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                    placeholder="Contoh: JP123456789"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setResiModal({ open: false, transaction: null, tracking_number: "" })}
                                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 font-medium disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan & Kirim'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

Orders.layout = (page) => <DashboardLayout children={page} />;

export default Orders;
