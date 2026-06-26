import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Table from "@/Components/Dashboard/Table";
import {
    IconArrowLeft,
    IconClockExclamation,
    IconCircleCheck,
} from "@tabler/icons-react";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

const STATUS_BADGE = {
    mendekati_expired: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    expired: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
};

const STATUS_LABEL = {
    mendekati_expired: "Mendekati Expired",
    expired: "Expired",
};

export default function ExpiryReport({ batches, totalLoss, days }) {
    const changeDays = (e) => {
        router.get(route("stocks.expiry"), { days: e.target.value }, { preserveState: true });
    };

    return (
        <>
            <Head title="Laporan Kadaluarsa" />

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href={route("stocks.index")}
                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <IconArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Laporan Kadaluarsa
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Batch expired dan mendekati kadaluarsa dalam {days} hari.
                        </p>
                    </div>
                </div>
                <select
                    value={days}
                    onChange={changeDays}
                    className="h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                >
                    <option value={7}>7 hari</option>
                    <option value={14}>14 hari</option>
                    <option value={30}>30 hari</option>
                    <option value={60}>60 hari</option>
                    <option value={90}>90 hari</option>
                </select>
            </div>

            <div className="mb-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <IconClockExclamation size={24} />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Estimasi Nilai Kerugian</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{rupiah(totalLoss)}</p>
                </div>
            </div>

            {batches.length > 0 ? (
                <Table.Card title="Daftar Batch Bermasalah">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>Produk</Table.Th>
                                <Table.Th>Kode Batch</Table.Th>
                                <Table.Th>Sisa</Table.Th>
                                <Table.Th>Harga Beli</Table.Th>
                                <Table.Th>Nilai Rugi</Table.Th>
                                <Table.Th>Kadaluarsa</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {batches.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <Table.Td>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{b.product}</p>
                                        <p className="text-xs text-slate-400">{b.barcode}</p>
                                    </Table.Td>
                                    <Table.Td>{b.batch_code}</Table.Td>
                                    <Table.Td>{b.qty_remaining}</Table.Td>
                                    <Table.Td>{rupiah(b.buy_price)}</Table.Td>
                                    <Table.Td>
                                        <span className="font-semibold text-rose-500">{rupiah(b.loss_value)}</span>
                                    </Table.Td>
                                    <Table.Td>{b.expired_date || "-"}</Table.Td>
                                    <Table.Td>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_BADGE[b.status] || ""}`}>
                                            {STATUS_LABEL[b.status] || b.status}
                                        </span>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
                        <IconCircleCheck size={32} className="text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Tidak Ada Batch Bermasalah
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Semua stok aman dalam {days} hari ke depan.
                    </p>
                </div>
            )}
        </>
    );
}

ExpiryReport.layout = (page) => <DashboardLayout children={page} />;
