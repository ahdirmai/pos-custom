import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import {
    IconArrowLeft,
    IconTicket,
    IconCalendar,
    IconReceipt2,
    IconUser,
    IconDatabaseOff,
} from "@tabler/icons-react";

export default function Show({ voucher, usages }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString, withTime = false) => {
        const options = {
            day: "numeric",
            month: "short",
            year: "numeric",
        };
        if (withTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    return (
        <>
            <Head title={`Voucher: ${voucher.code}`} />

            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <Link href={route("vouchers.index")}>
                    <Button
                        type="button"
                        icon={<IconArrowLeft size={18} />}
                        className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                    />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Detail Voucher
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Voucher Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex flex-col items-center text-center mb-6">
                             <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center mb-3">
                                <IconTicket size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{voucher.code}</h2>
                            <p className="text-slate-500 dark:text-slate-400">{voucher.name}</p>
                            <span
                                className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                    voucher.is_active
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                }`}
                            >
                                {voucher.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Target</span>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{voucher.discount_target}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Tipe Potongan</span>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{voucher.discount_type}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Nilai</span>
                                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                    {voucher.discount_type === 'fixed' 
                                        ? formatCurrency(voucher.amount) 
                                        : `${parseFloat(voucher.amount)}%`}
                                </span>
                            </div>
                             <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Min. Belanja</span>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {voucher.min_spend > 0 ? formatCurrency(voucher.min_spend) : '-'}
                                </span>
                            </div>
                             <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Max Konversi</span>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {voucher.max_discount > 0 ? formatCurrency(voucher.max_discount) : '-'}
                                </span>
                            </div>
                             <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-3 relative">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Kuota Terpakai</span>
                                <div className="text-right">
                                     <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{voucher.used_count}</span>
                                     <span className="text-xs text-slate-400"> / {voucher.quota}</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                                    <div 
                                        className="h-full bg-primary-500" 
                                        style={{ width: `${Math.min((voucher.used_count / voucher.quota) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-start gap-3">
                                <IconCalendar size={20} className="text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Masa Berlaku</p>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">
                                        {formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage History Table */}
                <div className="lg:col-span-2">
                    <Table.Card title={`Riwayat Penggunaan (${usages.total})`}>
                        {usages.data.length > 0 ? (
                            <>
                                <Table>
                                    <Table.Thead>
                                        <tr>
                                            <Table.Th>Tanggal</Table.Th>
                                            <Table.Th>Invoice</Table.Th>
                                            <Table.Th>Customer</Table.Th>
                                            <Table.Th>Diskon Diberikan</Table.Th>
                                        </tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {usages.data.map((usage) => (
                                            <tr key={usage.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <Table.Td>
                                                    <div className="text-sm text-slate-600 dark:text-slate-300">
                                                        {formatDate(usage.used_at, true)}
                                                    </div>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Link 
                                                        href={route('transactions.print', usage.transaction?.invoice)} // Or a detail route if available
                                                        className="flex items-center gap-2 text-primary-600 hover:underline font-medium"
                                                        target="_blank"
                                                    >
                                                        <IconReceipt2 size={16} />
                                                        {usage.transaction?.invoice || 'N/A'}
                                                    </Link>
                                                </Table.Td>
                                                <Table.Td>
                                                    <div className="flex items-center gap-2">
                                                        <IconUser size={16} className="text-slate-400" />
                                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                                            {usage.customer?.name || 'Umum / Guest'}
                                                        </span>
                                                    </div>
                                                </Table.Td>
                                                <Table.Td>
                                                     <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                                                        -{formatCurrency(usage.discount_amount)}
                                                    </span>
                                                </Table.Td>
                                            </tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                                {usages.last_page !== 1 && (
                                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                                         <Pagination links={usages.links} />
                                    </div>
                                )}
                            </>
                        ) : (
                             <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                    <IconDatabaseOff size={24} className="text-slate-400" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Belum ada penggunaan voucher ini.</p>
                            </div>
                        )}
                    </Table.Card>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <DashboardLayout children={page} />;
