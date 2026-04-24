import React from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Button from "@/Components/Dashboard/Button";
import Pagination from "@/Components/Dashboard/Pagination";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import {
    IconBolt,
    IconCalendarTime,
    IconCirclePlus,
    IconDatabaseOff,
    IconPackage,
    IconPencilCog,
    IconTrash,
} from "@tabler/icons-react";

const formatDateTime = (value) =>
    new Date(value).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

export default function Index({ flashSales, filters, summary }) {
    const statusBadge = (flashSale) => {
        const now = new Date();
        const startAt = new Date(flashSale.start_at);
        const endAt = new Date(flashSale.end_at);

        if (flashSale.is_active && startAt <= now && endAt >= now) {
            return "Aktif";
        }

        if (startAt > now) {
            return "Terjadwal";
        }

        if (endAt < now) {
            return "Selesai";
        }

        return flashSale.is_active ? "Siap Tayang" : "Nonaktif";
    };

    const statusClassName = (status) => {
        if (status === "Aktif") {
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
        }

        if (status === "Terjadwal" || status === "Siap Tayang") {
            return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
        }

        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    };

    return (
        <>
            <Head title="Flash Sale" />

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Flash Sale
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {flashSales.total} sesi flash sale terdaftar
                        </p>
                    </div>
                    <Link href={route("flash-sales.create")}>
                        <Button
                            type="button"
                            icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                            label="Buat Flash Sale"
                        />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Total Sesi
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                            {summary.total || 0}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center">
                        <IconBolt size={22} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Sedang Aktif
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                            {summary.active || 0}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center">
                        <IconBolt size={22} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Terjadwal
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                            {summary.scheduled || 0}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center">
                        <IconCalendarTime size={22} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Produk Promo
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                            {summary.products || 0}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center">
                        <IconPackage size={22} />
                    </div>
                </div>
            </div>

            <div className="mb-4 w-full sm:w-80">
                <Search
                    url={route("flash-sales.index")}
                    placeholder="Cari nama flash sale..."
                />
            </div>

            {flashSales.data.length > 0 ? (
                <Table.Card title="Daftar Flash Sale">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className="w-10">No</Table.Th>
                                <Table.Th>Sesi</Table.Th>
                                <Table.Th>Periode</Table.Th>
                                <Table.Th>Produk</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th></Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {flashSales.data.map((flashSale, index) => {
                                const status = statusBadge(flashSale);

                                return (
                                    <tr key={flashSale.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <Table.Td className="text-center">
                                            {index + 1 + (flashSales.current_page - 1) * flashSales.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center">
                                                    <IconBolt size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-100">
                                                        {flashSale.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                                                        {flashSale.description || "Tanpa deskripsi tambahan"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="text-sm text-slate-600 dark:text-slate-300">
                                                <p>{formatDateTime(flashSale.start_at)}</p>
                                                <p className="text-xs text-slate-400">sampai</p>
                                                <p>{formatDateTime(flashSale.end_at)}</p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                                {flashSale.items_count} produk
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${statusClassName(status)}`}>
                                                {status}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2 justify-end">
                                                <Link href={route("flash-sales.edit", flashSale.id)}>
                                                    <Button
                                                        type="button"
                                                        icon={<IconPencilCog size={16} />}
                                                        className="border bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-200 dark:bg-amber-950/40 dark:border-amber-900/40 dark:text-amber-300"
                                                    />
                                                </Link>
                                                <Button
                                                    type="delete"
                                                    icon={<IconTrash size={16} />}
                                                    className="border bg-red-100 border-red-200 text-red-600 hover:bg-red-200 dark:bg-red-950/40 dark:border-red-900/40 dark:text-red-300"
                                                    url={route("flash-sales.destroy", flashSale.id)}
                                                />
                                            </div>
                                        </Table.Td>
                                    </tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
            ) : (
                <Table.Card title="Daftar Flash Sale">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
                            <IconDatabaseOff size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Belum ada flash sale
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Buat sesi pertama untuk mulai menjual produk dengan harga promo.
                        </p>
                    </div>
                </Table.Card>
            )}

            {flashSales.last_page > 1 && (
                <div className="mt-6">
                    <Pagination links={flashSales.links} align="right" />
                </div>
            )}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
