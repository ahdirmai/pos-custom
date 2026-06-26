import React, { useEffect, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import toast from "react-hot-toast";
import {
    IconArrowLeft,
    IconCirclePlus,
    IconTrash,
    IconDeviceFloppy,
    IconFileSpreadsheet,
    IconDownload,
    IconUpload,
} from "@tabler/icons-react";

const today = () => new Date().toISOString().slice(0, 10);

const emptyRow = () => ({
    product_id: "",
    qty: "",
    buy_price: "",
    received_date: today(),
    expired_date: "",
    note: "",
});

export default function BulkIn({ products = [] }) {
    const { flash, errors: pageErrors } = usePage().props;
    const [tab, setTab] = useState("manual");

    const { data, setData, post, processing, reset } = useForm({
        rows: [emptyRow()],
    });

    const importForm = useForm({ file: null });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            reset();
            setData("rows", [emptyRow()]);
            importForm.reset();
        }
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        if (pageErrors?.file) toast.error(pageErrors.file);
    }, [pageErrors]);

    const updateRow = (index, key, value) => {
        const rows = [...data.rows];
        rows[index] = { ...rows[index], [key]: value };
        // auto-fill buy_price from selected product
        if (key === "product_id") {
            const p = products.find((x) => String(x.id) === String(value));
            if (p && !rows[index].buy_price) rows[index].buy_price = p.buy_price;
        }
        setData("rows", rows);
    };

    const addRow = () => setData("rows", [...data.rows, emptyRow()]);
    const removeRow = (index) =>
        setData("rows", data.rows.filter((_, i) => i !== index));

    const submitManual = (e) => {
        e.preventDefault();
        post(route("stocks.bulk.store"), { preserveScroll: true });
    };

    const submitImport = (e) => {
        e.preventDefault();
        importForm.post(route("stocks.import"), { preserveScroll: true, forceFormData: true });
    };

    return (
        <>
            <Head title="Barang Masuk Massal" />

            <div className="mb-6 flex items-center gap-3">
                <Link
                    href={route("stocks.index")}
                    className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    <IconArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Barang Masuk Massal
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Catat banyak batch sekaligus lewat form atau import file.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-5 flex gap-2 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setTab("manual")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        tab === "manual"
                            ? "border-primary-500 text-primary-600 dark:text-primary-400"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Form Multi-Baris
                </button>
                <button
                    onClick={() => setTab("import")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        tab === "import"
                            ? "border-primary-500 text-primary-600 dark:text-primary-400"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Import File
                </button>
            </div>

            {tab === "manual" ? (
                <form onSubmit={submitManual}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                                <tr>
                                    <th className="px-3 py-3 text-left font-medium min-w-[220px]">Produk</th>
                                    <th className="px-3 py-3 text-left font-medium w-24">Qty</th>
                                    <th className="px-3 py-3 text-left font-medium w-32">Harga Beli</th>
                                    <th className="px-3 py-3 text-left font-medium w-40">Tgl Masuk</th>
                                    <th className="px-3 py-3 text-left font-medium w-40">Kadaluarsa</th>
                                    <th className="px-3 py-3 text-left font-medium min-w-[140px]">Catatan</th>
                                    <th className="px-3 py-3 w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.rows.map((row, index) => (
                                    <tr key={index} className="border-t border-slate-100 dark:border-slate-800">
                                        <td className="px-3 py-2">
                                            <select
                                                className="input"
                                                value={row.product_id}
                                                onChange={(e) => updateRow(index, "product_id", e.target.value)}
                                                required
                                            >
                                                <option value="">Pilih produk...</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.title} ({p.barcode})
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                min="1"
                                                className="input"
                                                value={row.qty}
                                                onChange={(e) => updateRow(index, "qty", e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="number"
                                                min="0"
                                                className="input"
                                                value={row.buy_price}
                                                onChange={(e) => updateRow(index, "buy_price", e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="date"
                                                className="input"
                                                value={row.received_date}
                                                onChange={(e) => updateRow(index, "received_date", e.target.value)}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                type="date"
                                                className="input"
                                                value={row.expired_date}
                                                onChange={(e) => updateRow(index, "expired_date", e.target.value)}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                className="input"
                                                value={row.note}
                                                onChange={(e) => updateRow(index, "note", e.target.value)}
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                disabled={data.rows.length === 1}
                                                className="text-rose-500 hover:text-rose-700 disabled:opacity-30"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-between">
                        <button
                            type="button"
                            onClick={addRow}
                            className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:border-primary-400"
                        >
                            <IconCirclePlus size={18} />
                            Tambah Baris
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/20 disabled:opacity-70"
                        >
                            <IconDeviceFloppy size={18} />
                            {processing ? "Menyimpan..." : "Simpan Semua"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="max-w-xl">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                            <IconFileSpreadsheet size={24} className="text-blue-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-slate-600 dark:text-slate-300">
                                <p className="font-medium mb-1">Format kolom file (.xlsx / .csv):</p>
                                <code className="text-xs">barcode, qty, buy_price, received_date, expired_date, note</code>
                                <p className="text-xs text-slate-500 mt-2">
                                    Produk dicocokkan lewat <strong>barcode</strong>. Bila ada baris error, tak ada data yang masuk.
                                </p>
                            </div>
                        </div>

                        <a
                            href={route("stocks.template")}
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 mb-5"
                        >
                            <IconDownload size={16} />
                            Download Template
                        </a>

                        <form onSubmit={submitImport} className="space-y-4">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => importForm.setData("file", e.target.files[0])}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 dark:file:bg-primary-900/40 dark:file:text-primary-400"
                                required
                            />
                            {importForm.errors.file && (
                                <p className="text-xs text-rose-500">{importForm.errors.file}</p>
                            )}
                            <button
                                type="submit"
                                disabled={importForm.processing || !importForm.data.file}
                                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/20 disabled:opacity-70"
                            >
                                <IconUpload size={18} />
                                {importForm.processing ? "Mengimpor..." : "Import Sekarang"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

BulkIn.layout = (page) => <DashboardLayout children={page} />;
