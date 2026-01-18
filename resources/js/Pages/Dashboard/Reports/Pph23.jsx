import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Pagination from "@/Components/Dashboard/Pagination";
import InputSelect from "@/Components/Dashboard/InputSelect";
import {
    IconFileCertificate,
    IconDatabaseOff,
    IconFilter,
    IconX,
    IconSearch,
    IconChevronDown,
    IconChevronUp,
    IconFileTypePdf,
    IconFileTypeXls,
    IconTrendingUp,
    IconReceipt,
    IconCalculator,
} from "@tabler/icons-react";

// Helper for currency formatting
const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const defaultFilters = {
    start_date: "",
    end_date: "",
    invoice: "",
    customer_id: "",
};

// Summary Card with gradient (matches Profit.jsx style)
const SummaryCard = ({ title, value, description, icon, gradient }) => (
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
            {description && <p className="text-sm opacity-80 mt-1">{description}</p>}
        </div>
    </div>
);

const Pph23Report = ({ reports, filters, customers, summary }) => {
    const [showFilters, setShowFilters] = useState(true);
    const [filterData, setFilterData] = useState({
        ...defaultFilters,
        ...filters,
    });
    const [expandedRows, setExpandedRows] = useState({});

    // Toggle row expansion (transaction id)
    const toggleRow = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    useEffect(() => {
        setFilterData({ ...defaultFilters, ...filters });
    }, [filters]);

    const handleChange = (field, value) =>
        setFilterData((prev) => ({ ...prev, [field]: value }));

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route("reports.pph23.index"), filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        setFilterData(defaultFilters);
        router.get(route("reports.pph23.index"), defaultFilters, {
            replace: true,
            preserveScroll: true,
        });
    };

    const handleExport = (type) => {
        const url = route(`reports.pph23.export.${type}`, filterData);
        window.open(url, "_blank");
    };

    const rows = reports?.data ?? [];
    const links = reports?.links ?? [];
    const currentPage = reports?.current_page ?? 1;
    const perPage = reports?.per_page ? Number(reports?.per_page) : rows.length || 1;

    const hasActiveFilters =
        filterData.start_date ||
        filterData.end_date ||
        filterData.invoice ||
        filterData.customer_id;

    return (
        <>
            <Head title="Laporan PPh 23" />
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <IconFileCertificate size={28} className="text-primary-500" />
                            Laporan PPh 23
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Analisis PPh 23 (Jasa) per Transaksi dengan detail item.
                        </p>
                        
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                            showFilters || hasActiveFilters
                                ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-950/50 dark:border-primary-800 dark:text-primary-400"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 shadow-sm"
                        }`}
                    >
                        <IconFilter size={18} />
                        <span>Filter</span>
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                        )}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                        title="Total Transaksi"
                        value={summary.total_transactions}
                        description="Dalam periode ini"
                        icon={<IconReceipt />}
                        gradient="from-blue-500 to-blue-600"
                    />
                    <SummaryCard
                        title="Total Pendapatan"
                        value={formatCurrency(summary.total_revenue)}
                        description="Gross Revenue"
                        icon={<IconTrendingUp />}
                        gradient="from-emerald-500 to-emerald-600"
                    />
                    <SummaryCard
                        title="Total DPP Jasa"
                        value={formatCurrency(summary.total_dpp)}
                        description="Pendapatan Terkena Pajak"
                        icon={<IconFileCertificate />}
                        gradient="from-indigo-500 to-indigo-600"
                    />
                    <SummaryCard
                        title="Estimasi PPh 23"
                        value={formatCurrency(summary.total_pph)}
                        description="Total Potensi Pajak"
                        icon={<IconCalculator />}
                        gradient="from-orange-500 to-orange-600"
                    />
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => handleExport("pdf")}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30 transition-colors text-sm font-medium"
                        >
                            <IconFileTypePdf size={18} />
                            <span>PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport("excel")}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 transition-colors text-sm font-medium"
                        >
                            <IconFileTypeXls size={18} />
                            <span>Excel</span>
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm animate-slide-up">
                        <form onSubmit={applyFilters}>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                        Cari Transaksi
                                    </label>
                                    <div className="relative">
                                        <IconSearch
                                            size={18}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            placeholder="No. Invoice..."
                                            value={filterData.invoice}
                                            onChange={(e) => handleChange("invoice", e.target.value)}
                                            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                        Pelanggan
                                    </label>
                                    <InputSelect
                                        placeholder="Semua Pelanggan"
                                        data={customers}
                                        selected={customers.find(c => c.id == filterData.customer_id) || null}
                                        setSelected={(val) => handleChange("customer_id", val ? val.id : "")}
                                        searchable={true}
                                        displayKey="name"
                                        valueKey="id"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        value={filterData.start_date}
                                        onChange={(e) =>
                                            handleChange("start_date", e.target.value)
                                        }
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                        Tanggal Akhir
                                    </label>
                                    <input
                                        type="date"
                                        value={filterData.end_date}
                                        onChange={(e) =>
                                            handleChange("end_date", e.target.value)
                                        }
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-sm shadow-sm shadow-primary-500/25"
                                >
                                    Terapkan Filter
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table Section */}
                {rows.length > 0 ? (
                    <>
                        {/* Desktop Table View */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden hidden sm:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                No
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Invoice
                                            </th>
                                            <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Pelanggan
                                            </th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Diskon
                                            </th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Total Nota
                                            </th>
                                            <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Total DPP
                                            </th>
                                            <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Tarif & PPh
                                            </th>
                                            <th className="px-4 py-5 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {rows.map((row, i) => (
                                            <React.Fragment key={row.id}>
                                                <tr
                                                    className={`transition-colors cursor-pointer ${
                                                        expandedRows[row.id]
                                                            ? "bg-primary-50/30 dark:bg-primary-900/10"
                                                            : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                                                    }`}
                                                    onClick={() => toggleRow(row.id)}
                                                >
                                                    <td className="px-6 py-5 text-sm text-slate-500">
                                                        {i + 1 + (currentPage - 1) * perPage}
                                                    </td>
                                                    <td className="px-6 py-5 text-sm">
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {row.invoice_number}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {row.date}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm">
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {row.customer_name}
                                                        </div>
                                                        {/* <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                            <span className="opacity-75">NPWP:</span>
                                                            <span className="font-mono">{row.customer_npwp}</span>
                                                        </div> */}
                                                    </td>
                                                    <td className="px-6 py-5 text-right text-sm font-medium text-red-500 dark:text-red-400">
                                                        {row.discount > 0 ? `-${formatCurrency(row.discount)}` : '-'}
                                                    </td>
                                                    <td className="px-6 py-5 text-right text-sm font-semibold text-slate-900 dark:text-white">
                                                        {formatCurrency(row.grand_total)}
                                                    </td>
                                                    <td className="px-6 py-5 text-right text-sm font-medium text-slate-600 dark:text-slate-400">
                                                        {formatCurrency(row.total_dpp_jasa)}
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <span
                                                                className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                                                                    row.tax_rate === 0.01
                                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                                }`}
                                                            >
                                                                {row.tax_rate * 100}%
                                                            </span>
                                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                                {formatCurrency(row.pph23_amount)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-center text-slate-400">
                                                        <div className={`transition-transform duration-200 ${expandedRows[row.id] ? 'rotate-180 text-primary-500' : ''}`}>
                                                            <IconChevronDown size={20} />
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedRows[row.id] && (
                                                    <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                                        <td colSpan="7" className="px-6 py-4">
                                                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                                                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detail Item Transaksi</span>
                                                                    <span className="text-xs text-slate-400">Kasir: {row.cashier_name}</span>
                                                                </div>
                                                                <table className="w-full">
                                                                    <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                                                        <tr>
                                                                            <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                                                                                Item
                                                                            </th>
                                                                            <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                                                                                Qty
                                                                            </th>
                                                                            <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                                                                                Harga
                                                                            </th>
                                                                            <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                                                                                Total
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                                        {row.items.map(
                                                                            (item, idx) => (
                                                                                <tr key={idx} className={item.is_pph23 ? "bg-orange-50/50 dark:bg-orange-900/10" : ""}>
                                                                                    <td className="px-5 py-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                                                                                        {item.product_name}
                                                                                        {item.is_pph23 && (
                                                                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                                                                PPh 23
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                                                                                        {item.qty}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 text-right text-sm text-slate-600 dark:text-slate-400">
                                                                                        {formatCurrency(
                                                                                            item.price
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="px-5 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                                                                                        <div>
                                                                                            {formatCurrency(item.total_price)}
                                                                                        </div>
                                                                                        {item.is_pph23 && (
                                                                                            <div className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">
                                                                                                (PPh: {formatCurrency(item.pph23_amount)})
                                                                                            </div>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                    </tbody>
                                                                    <tfoot className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                                                        <tr>
                                                                            <td
                                                                                colSpan="3"
                                                                                className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase"
                                                                            >
                                                                                Total DPP Jasa
                                                                            </td>
                                                                            <td className="px-5 py-3 text-right text-sm font-bold text-slate-900 dark:text-white">
                                                                                {formatCurrency(
                                                                                    row.total_dpp_jasa
                                                                                )}
                                                                                {row.pph23_amount && (
                                                                                    <div className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">
                                                                                        (PPh: {formatCurrency(row.pph23_amount)})
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile List View (Separate Cards) */}
                        <div className="sm:hidden space-y-4">
                            {rows.map((row) => (
                                <div
                                    key={row.id}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
                                >
                                    <div
                                        className="p-5 space-y-4 cursor-pointer"
                                        onClick={() => toggleRow(row.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white text-base">
                                                    {row.invoice_number}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    {row.date}
                                                </div>
                                            </div>
                                            <div
                                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    row.tax_rate === 0.01
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                }`}
                                            >
                                                Tarif {row.tax_rate * 100}%
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1.5">
                                                    Pelanggan
                                                </div>
                                                <div className="font-medium text-slate-700 dark:text-slate-300 truncate">
                                                    {row.customer_name}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500 mb-1.5">
                                                    Total Nota
                                                </div>
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(row.grand_total)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1.5">
                                                    Diskon
                                                </div>
                                                <div className="font-medium text-red-500 dark:text-red-400">
                                                    {row.discount > 0 ? `-${formatCurrency(row.discount)}` : '-'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500 mb-1.5">
                                                    PPh 23
                                                </div>
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(row.pph23_amount)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center pt-1">
                                            <div className={`transition-transform duration-200 ${expandedRows[row.id] ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}>
                                                <IconChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details Mobile */}
                                    {expandedRows[row.id] && (
                                        <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-4 animate-slide-down shadow-inner">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                                <span className="w-1 h-3 bg-primary-500 rounded-full"></span>
                                                Detail Item
                                            </h4>
                                            <div className="space-y-2">
                                                {row.items.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex justify-between items-start text-sm p-2 rounded-lg ${
                                                            item.is_pph23 ? "bg-orange-100/50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30" : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                                                        }`}
                                                    >
                                                        <div className="flex-1 pr-2">
                                                            <div className="font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                                                                {item.product_name}
                                                                {item.is_pph23 && (
                                                                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 align-middle">
                                                                        PPh 23
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-slate-500 mt-1">
                                                                {item.qty} x {formatCurrency(item.price)}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                                {formatCurrency(item.total_price)}
                                                            </div>
                                                            {item.is_pph23 && (
                                                                <div className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">
                                                                    (PPh: {formatCurrency(item.pph23_amount)})
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center font-bold text-slate-900 dark:text-white text-sm mt-3">
                                                    <span>Total DPP</span>
                                                    <span>
                                                        {formatCurrency(row.total_dpp_jasa)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <IconDatabaseOff size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                            Tidak Ada Data
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm text-center">
                            Tidak ada transaksi yang cocok dengan filter yang Anda gunakan.
                            Silakan sesuaikan kembali filter Anda.
                        </p>
                    </div>
                )}
                {links.length > 3 && <Pagination links={links} />}
            </div>
        </>
    );
};

Pph23Report.layout = (page) => <DashboardLayout children={page} />;

export default Pph23Report;
