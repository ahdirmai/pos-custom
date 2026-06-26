import React, { useEffect, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Table from "@/Components/Dashboard/Table";
import toast from "react-hot-toast";
import {
    IconArrowLeft,
    IconCirclePlus,
    IconAdjustments,
    IconX,
} from "@tabler/icons-react";

const SimpleModal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <IconX size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

const STATUS_BADGE = {
    aman: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    mendekati_expired: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    expired: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    habis: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const STATUS_LABEL = {
    aman: "Aman",
    mendekati_expired: "Mendekati Expired",
    expired: "Expired",
    habis: "Habis",
};

const MOVEMENT_BADGE = {
    in: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    out: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    adjustment: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
};

export default function StockShow({ product, batches, movements }) {
    const { flash } = usePage().props;
    const [isInModalOpen, setIsInModalOpen] = useState(false);
    const [adjustBatch, setAdjustBatch] = useState(null);

    const inForm = useForm({
        qty: "",
        buy_price: product.buy_price || 0,
        received_date: new Date().toISOString().slice(0, 10),
        expired_date: "",
        batch_code: "",
        note: "",
    });

    const adjustForm = useForm({
        stock_batch_id: "",
        qty_remaining: "",
        reason: "opname",
        note: "",
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const submitIn = (e) => {
        e.preventDefault();
        inForm.post(route("stocks.in", product.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsInModalOpen(false);
                inForm.reset();
                inForm.setData("received_date", new Date().toISOString().slice(0, 10));
                inForm.setData("buy_price", product.buy_price || 0);
            },
        });
    };

    const openAdjust = (batch) => {
        setAdjustBatch(batch);
        adjustForm.setData({
            stock_batch_id: batch.id,
            qty_remaining: batch.qty_remaining,
            reason: "opname",
            note: "",
        });
    };

    const submitAdjust = (e) => {
        e.preventDefault();
        adjustForm.post(route("stocks.adjust", product.id), {
            preserveScroll: true,
            onSuccess: () => setAdjustBatch(null),
        });
    };

    return (
        <>
            <Head title={`Kartu Stok - ${product.title}`} />

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
                            {product.title}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {product.barcode} · {product.category || "-"} · Stok total:{" "}
                            <span className="font-semibold">{product.stock}</span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsInModalOpen(true)}
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-colors"
                >
                    <IconCirclePlus size={18} />
                    Barang Masuk
                </button>
            </div>

            {/* Batches */}
            <Table.Card title="Daftar Batch (urut FIFO)">
                <Table>
                    <Table.Thead>
                        <tr>
                            <Table.Th>Kode Batch</Table.Th>
                            <Table.Th>Masuk</Table.Th>
                            <Table.Th>Sisa</Table.Th>
                            <Table.Th>Harga Beli</Table.Th>
                            <Table.Th>Tgl Masuk</Table.Th>
                            <Table.Th>Kadaluarsa</Table.Th>
                            <Table.Th>Status</Table.Th>
                            <Table.Th></Table.Th>
                        </tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {batches.length === 0 ? (
                            <tr>
                                <Table.Td colSpan={8}>
                                    <p className="text-center text-sm text-slate-400 py-4">
                                        Belum ada batch. Catat barang masuk untuk memulai.
                                    </p>
                                </Table.Td>
                            </tr>
                        ) : (
                            batches.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <Table.Td>
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {b.batch_code}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>{b.qty_in}</Table.Td>
                                    <Table.Td>
                                        <span className="font-semibold">{b.qty_remaining}</span>
                                    </Table.Td>
                                    <Table.Td>{rupiah(b.buy_price)}</Table.Td>
                                    <Table.Td>{b.received_date || "-"}</Table.Td>
                                    <Table.Td>{b.expired_date || "-"}</Table.Td>
                                    <Table.Td>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_BADGE[b.status]}`}>
                                            {STATUS_LABEL[b.status]}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => openAdjust(b)}
                                                className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 text-sm font-medium"
                                            >
                                                <IconAdjustments size={16} />
                                                Opname
                                            </button>
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </Table.Card>

            {/* Ledger */}
            <div className="mt-6">
                <Table.Card title="Kartu Stok (Riwayat Pergerakan)">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th>Waktu</Table.Th>
                                <Table.Th>Tipe</Table.Th>
                                <Table.Th>Referensi</Table.Th>
                                <Table.Th>Qty</Table.Th>
                                <Table.Th>Stok Akhir</Table.Th>
                                <Table.Th>Oleh</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {movements.length === 0 ? (
                                <tr>
                                    <Table.Td colSpan={6}>
                                        <p className="text-center text-sm text-slate-400 py-4">
                                            Belum ada pergerakan stok.
                                        </p>
                                    </Table.Td>
                                </tr>
                            ) : (
                                movements.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <Table.Td>
                                            <span className="text-xs text-slate-500">{m.created_at}</span>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className={`px-2 py-0.5 rounded-full text-xs uppercase ${MOVEMENT_BADGE[m.type]}`}>
                                                {m.type}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="text-xs text-slate-500">
                                                {m.reference_type}
                                                {m.reference_id ? ` #${m.reference_id}` : ""}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className={m.qty < 0 ? "text-rose-500" : "text-emerald-600"}>
                                                {m.qty > 0 ? `+${m.qty}` : m.qty}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>{m.qty_after ?? "-"}</Table.Td>
                                        <Table.Td>
                                            <span className="text-xs text-slate-500">{m.user || "Sistem"}</span>
                                        </Table.Td>
                                    </tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
            </div>

            {/* Stock-in Modal */}
            <SimpleModal show={isInModalOpen} onClose={() => setIsInModalOpen(false)} title="Catat Barang Masuk">
                <form onSubmit={submitIn} className="space-y-4">
                    <Field label="Jumlah Masuk" required error={inForm.errors.qty}>
                        <input
                            type="number"
                            min="1"
                            className="input"
                            value={inForm.data.qty}
                            onChange={(e) => inForm.setData("qty", e.target.value)}
                            required
                        />
                    </Field>
                    <Field label="Harga Beli / unit" required error={inForm.errors.buy_price}>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            value={inForm.data.buy_price}
                            onChange={(e) => inForm.setData("buy_price", e.target.value)}
                            required
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Tanggal Masuk" required error={inForm.errors.received_date}>
                            <input
                                type="date"
                                className="input"
                                value={inForm.data.received_date}
                                onChange={(e) => inForm.setData("received_date", e.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Tanggal Kadaluarsa" error={inForm.errors.expired_date}>
                            <input
                                type="date"
                                className="input"
                                value={inForm.data.expired_date}
                                onChange={(e) => inForm.setData("expired_date", e.target.value)}
                            />
                        </Field>
                    </div>
                    <Field label="Kode Batch (opsional)" error={inForm.errors.batch_code}>
                        <input
                            className="input"
                            value={inForm.data.batch_code}
                            onChange={(e) => inForm.setData("batch_code", e.target.value)}
                            placeholder="Otomatis bila kosong"
                        />
                    </Field>
                    <Field label="Catatan" error={inForm.errors.note}>
                        <textarea
                            rows={2}
                            className="input resize-none py-2"
                            value={inForm.data.note}
                            onChange={(e) => inForm.setData("note", e.target.value)}
                        />
                    </Field>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsInModalOpen(false)} className="btn-secondary">
                            Batal
                        </button>
                        <button type="submit" disabled={inForm.processing} className="btn-primary">
                            {inForm.processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </SimpleModal>

            {/* Adjust Modal */}
            <SimpleModal show={!!adjustBatch} onClose={() => setAdjustBatch(null)} title="Penyesuaian Stok (Opname)">
                <form onSubmit={submitAdjust} className="space-y-4">
                    {adjustBatch && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Batch <span className="font-semibold">{adjustBatch.batch_code}</span> — sisa saat ini:{" "}
                            <span className="font-semibold">{adjustBatch.qty_remaining}</span>
                        </p>
                    )}
                    <Field label="Sisa Stok Baru" required error={adjustForm.errors.qty_remaining}>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            value={adjustForm.data.qty_remaining}
                            onChange={(e) => adjustForm.setData("qty_remaining", e.target.value)}
                            required
                        />
                    </Field>
                    <Field label="Alasan" required error={adjustForm.errors.reason}>
                        <select
                            className="input"
                            value={adjustForm.data.reason}
                            onChange={(e) => adjustForm.setData("reason", e.target.value)}
                        >
                            <option value="opname">Stok Opname</option>
                            <option value="write_off">Write-off (rusak/hilang/expired)</option>
                        </select>
                    </Field>
                    <Field label="Catatan" error={adjustForm.errors.note}>
                        <textarea
                            rows={2}
                            className="input resize-none py-2"
                            value={adjustForm.data.note}
                            onChange={(e) => adjustForm.setData("note", e.target.value)}
                        />
                    </Field>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setAdjustBatch(null)} className="btn-secondary">
                            Batal
                        </button>
                        <button type="submit" disabled={adjustForm.processing} className="btn-primary">
                            {adjustForm.processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </SimpleModal>
        </>
    );
}

function Field({ label, required, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
    );
}

StockShow.layout = (page) => <DashboardLayout children={page} />;
