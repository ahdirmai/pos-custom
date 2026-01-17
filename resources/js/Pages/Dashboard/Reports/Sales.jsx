import React, { useEffect, useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import InputSelect from "@/Components/Dashboard/InputSelect";
import Button from "@/Components/Dashboard/Button";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import {
    IconCoin,
    IconDatabaseOff,
    IconDiscount2,
    IconReceipt2,
    IconShoppingBag,
    IconTrendingUp,
    IconFilter,
    IconX,
    IconSearch,
    IconCalendar,
} from "@tabler/icons-react";

// Summary Card Component
const SummaryCard = ({ icon, title, value, description, gradient }) => (
    <div
        className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${gradient} text-white shadow-lg`}
    >
        <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
            {React.cloneElement(icon, {
                size: 96,
                strokeWidth: 0.5,
                className: "transform translate-x-4 -translate-y-4",
            })}
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-white/20">
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <span className="text-sm font-medium opacity-90">{title}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm opacity-80 mt-1">{description}</p>
        </div>
    </div>
);

const defaultFilterState = {
    start_date: "",
    end_date: "",
    invoice: "",
    cashier_id: "",
    customer_id: "",
};

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const castFilterString = (value) =>
    typeof value === "number" ? String(value) : value ?? "";

const Sales = ({ transactions, summary, filters, cashiers, customers }) => {
    const [showFilters, setShowFilters] = useState(true);
    const [filterData, setFilterData] = useState({
        ...defaultFilterState,
        start_date: castFilterString(filters?.start_date),
        end_date: castFilterString(filters?.end_date),
        invoice: castFilterString(filters?.invoice),
        cashier_id: castFilterString(filters?.cashier_id),
        customer_id: castFilterString(filters?.customer_id),
    });

    const cashierFromFilters = useMemo(
        () =>
            cashiers.find(
                (c) => castFilterString(c.id) === filterData.cashier_id
            ) ?? null,
        [cashiers, filterData.cashier_id]
    );

    const customerFromFilters = useMemo(
        () =>
            customers.find(
                (c) => castFilterString(c.id) === filterData.customer_id
            ) ?? null,
        [customers, filterData.customer_id]
    );

    const [selectedCashier, setSelectedCashier] = useState(cashierFromFilters);
    const [selectedCustomer, setSelectedCustomer] =
        useState(customerFromFilters);

    useEffect(
        () => setSelectedCashier(cashierFromFilters),
        [cashierFromFilters]
    );
    useEffect(
        () => setSelectedCustomer(customerFromFilters),
        [customerFromFilters]
    );
    useEffect(() => {
        setFilterData({
            ...defaultFilterState,
            start_date: castFilterString(filters?.start_date),
            end_date: castFilterString(filters?.end_date),
            invoice: castFilterString(filters?.invoice),
            cashier_id: castFilterString(filters?.cashier_id),
            customer_id: castFilterString(filters?.customer_id),
        });
    }, [filters]);

    const handleChange = (field, value) =>
        setFilterData((prev) => ({ ...prev, [field]: value }));
    const handleSelectCashier = (value) => {
        setSelectedCashier(value);
        handleChange("cashier_id", value ? String(value.id) : "");
    };
    const handleSelectCustomer = (value) => {
        setSelectedCustomer(value);
        handleChange("customer_id", value ? String(value.id) : "");
    };

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route("reports.sales.index"), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilterData(defaultFilterState);
        setSelectedCashier(null);
        setSelectedCustomer(null);
        router.get(route("reports.sales.index"), defaultFilterState, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const rows = transactions?.data ?? [];
    const paginationLinks = transactions?.links ?? [];
    const currentPage = transactions?.current_page ?? 1;
    const perPage = transactions?.per_page
        ? Number(transactions?.per_page)
        : rows.length || 1;

    const hasActiveFilters =
        filterData.invoice ||
        filterData.start_date ||
        filterData.end_date ||
        filterData.cashier_id ||
        filterData.customer_id;

    const safeSummary = {
        orders_count: summary?.orders_count ?? 0,
        revenue_total: summary?.revenue_total ?? 0,
        discount_total: summary?.discount_total ?? 0,
        items_sold: summary?.items_sold ?? 0,
        profit_total: summary?.profit_total ?? 0,
        average_order: summary?.average_order ?? 0,
    };

    const summaryCards = [
        {
            title: "Pendapatan Bersih",
            value: formatCurrency(safeSummary.revenue_total),
            description: "Total setelah diskon",
            icon: <IconReceipt2 />,
            gradient: "from-primary-500 to-primary-700",
        },
        {
            title: "Total Profit",
            value: formatCurrency(safeSummary.profit_total),
            description: `Rata-rata ${formatCurrency(
                safeSummary.average_order
            )}`,
            icon: <IconCoin />,
            gradient: "from-success-500 to-success-700",
        },
        {
            title: "Item Terjual",
            value: safeSummary.items_sold.toLocaleString("id-ID"),
            description: `${safeSummary.orders_count} transaksi`,
            icon: <IconShoppingBag />,
            gradient: "from-accent-500 to-accent-700",
        },
        {
            title: "Diskon Diberikan",
            value: formatCurrency(safeSummary.discount_total),
            description: "Akumulasi promo",
            icon: <IconDiscount2 />,
            gradient: "from-warning-500 to-warning-600",
        },
    ];

    return (
        <>
            <Head title="Laporan Penjualan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <IconTrendingUp
                                size={28}
                                className="text-primary-500"
                            />
                            Laporan Penjualan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Analisis dan ringkasan penjualan
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                            showFilters || hasActiveFilters
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

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <SummaryCard key={card.title} {...card} />
                    ))}
                </div>

                {/* Filters Panel */}
               {showFilters && (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-slide-up">
        <form onSubmit={applyFilters}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Tanggal Mulai
                    </label>
                    <input
                        type="date"
                        value={filterData.start_date}
                        onChange={(e) =>
                            handleChange(
                                "start_date",
                                e.target.value
                            )
                        }
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Tanggal Akhir
                    </label>
                    <input
                        type="date"
                        value={filterData.end_date}
                        onChange={(e) =>
                            handleChange(
                                "end_date",
                                e.target.value
                            )
                        }
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Invoice
                    </label>
                    <input
                        type="text"
                        placeholder="TRX-..."
                        value={filterData.invoice}
                        onChange={(e) =>
                            handleChange(
                                "invoice",
                                e.target.value
                            )
                        }
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>
                {/* Tambahkan relative positioning pada wrapper */}
                <div className="relative">
                    <InputSelect
                        label="Kasir"
                        data={cashiers}
                        selected={selectedCashier}
                        setSelected={handleSelectCashier}
                        placeholder="Semua kasir"
                        searchable
                    />
                </div>
                <div className="relative">
                    <InputSelect
                        label="Pelanggan"
                        data={customers}
                        selected={selectedCustomer}
                        setSelected={handleSelectCustomer}
                        placeholder="Semua pelanggan"
                        searchable
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                )}
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors"
                >
                    <IconSearch size={18} />
                    Terapkan
                </button>
            </div>
        </form>
    </div>
)}

                {/* Content Section */}
{rows.length > 0 ? (
    <>
        {/* Mobile & Tablet View (Card Layout) - Visible on small to medium screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {rows.map((trx, i) => (
                <div 
                    key={trx.id} 
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Invoice
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {trx.invoice}
                            </h4>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                            {trx.total_items ?? 0} Items
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 border-y border-slate-50 dark:border-slate-800 py-4">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                Tanggal
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                                {trx.created_at}
                            </p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                Kasir
                            </span>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {trx.cashier?.name ?? "-"}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                Pelanggan
                            </span>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {trx.customer?.name ?? "Umum / Guest"}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-success-500 block mb-0.5">
                                Profit
                            </span>
                            <p className="text-sm font-bold text-success-600 dark:text-success-400">
                                {formatCurrency(trx.total_profit ?? 0)}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                                Total Transaksi
                            </span>
                            <p className="text-lg font-black text-primary-600 dark:text-primary-400">
                                {formatCurrency(trx.grand_total ?? 0)}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Desktop View (Table Layout) - Hidden on mobile/tablet */}
        <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">No</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Invoice</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tanggal</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pelanggan</th>
                            <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Kasir</th>
                            <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Item</th>
                            <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total</th>
                            <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Profit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {rows.map((trx, i) => (
                            <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-4 py-4 text-sm text-slate-500">
                                    {i + 1 + (currentPage - 1) * perPage}
                                </td>
                                <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                    {trx.invoice}
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 italic">
                                    {trx.created_at}
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                    {trx.customer?.name ?? "-"}
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {trx.cashier?.name ?? "-"}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                                        {trx.total_items ?? 0}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right text-sm font-black text-slate-900 dark:text-white">
                                    {formatCurrency(trx.grand_total ?? 0)}
                                </td>
                                <td className="px-4 py-4 text-right text-sm font-bold text-success-600 dark:text-success-400">
                                    {formatCurrency(trx.total_profit ?? 0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
) : (
    /* Empty State */
    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
            <IconDatabaseOff size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">Tidak Ada Data</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Tidak ada transaksi ditemukan sesuai filter.</p>
    </div>
)}

                {paginationLinks.length > 3 && (
                    <Pagination links={paginationLinks} />
                )}
            </div>
        </>
    );
};

Sales.layout = (page) => <DashboardLayout children={page} />;

export default Sales;
