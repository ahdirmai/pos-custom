import React from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import {
    IconBoxSeam,
    IconDatabaseOff,
    IconClockExclamation,
    IconAlertTriangle,
    IconEye,
    IconReportAnalytics,
    IconStack2,
} from "@tabler/icons-react";

export default function StockIndex({ products }) {
    const rows = products.data || [];

    return (
        <>
            <Head title="Manajemen Stok" />

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Manajemen Stok
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Pencatatan batch (FIFO) dan antisipasi kadaluarsa.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={route("stocks.bulk")}
                        className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-colors"
                    >
                        <IconStack2 size={18} />
                        Barang Masuk Massal
                    </Link>
                    <Link
                        href={route("stocks.expiry")}
                        className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow-lg shadow-amber-500/30 transition-colors"
                    >
                        <IconReportAnalytics size={18} />
                        Laporan Kadaluarsa
                    </Link>
                </div>
            </div>

            <div className="mb-4 w-full sm:w-80">
                <Search
                    url={route("stocks.index")}
                    placeholder="Cari nama, barcode, SKU..."
                />
            </div>

            {rows.length > 0 ? (
                <Table.Card title="Stok Produk">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>Produk</Table.Th>
                                <Table.Th>Total Stok</Table.Th>
                                <Table.Th>Batch Aktif</Table.Th>
                                <Table.Th>Status Kadaluarsa</Table.Th>
                                <Table.Th></Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows.map((p) => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <Table.Td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                                                <IconBoxSeam size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {p.title}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {p.barcode} · {p.category || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <span
                                            className={`text-sm font-semibold ${
                                                p.stock <= 0
                                                    ? "text-rose-500"
                                                    : p.stock < 10
                                                    ? "text-amber-500"
                                                    : "text-slate-700 dark:text-slate-300"
                                            }`}
                                        >
                                            {p.stock}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            {p.active_batches_count}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex flex-wrap gap-1">
                                            {p.expired_count > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                                                    <IconAlertTriangle size={12} />
                                                    {p.expired_count} expired
                                                </span>
                                            )}
                                            {p.near_expiry_count > 0 && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                                                    <IconClockExclamation size={12} />
                                                    {p.near_expiry_count} dekat
                                                </span>
                                            )}
                                            {p.expired_count === 0 &&
                                                p.near_expiry_count === 0 && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                                                        Aman
                                                    </span>
                                                )}
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex justify-end">
                                            <Link
                                                href={route("stocks.show", p.id)}
                                                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/40 dark:text-primary-400 text-sm font-medium transition-colors"
                                            >
                                                <IconEye size={16} />
                                                Kartu Stok
                                            </Link>
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff size={32} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Produk
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Tambahkan produk terlebih dahulu untuk mengelola stok.
                    </p>
                </div>
            )}

            <Pagination links={products.links} />
        </>
    );
}

StockIndex.layout = (page) => <DashboardLayout children={page} />;
