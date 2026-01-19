import React, { useEffect, useState, useRef } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    IconArrowLeft,
    IconCreditCard,
    IconCash,
    IconPrinter,
    IconBuildingBank,
    IconCopy,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

    const formatCurrency = (value = 0) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const formatDate = (value) => {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

export default function PayableShow({ payable, bankAccounts = [] }) {
    const { flash, storeProfile } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const printRef = useRef(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        amount: "",
        paid_at: new Date().toISOString().slice(0, 10),
        method: "cash",
        bank_account_id: "",
        note: "",
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const statusBadge = (value) => {
        const base = "px-2 py-1 text-xs font-semibold rounded-full";
        switch (value) {
            case "paid":
                return (
                    <span className={`${base} bg-success-100 text-success-700`}>
                        Lunas
                    </span>
                );
            case "partial":
                return (
                    <span className={`${base} bg-primary-100 text-primary-700`}>
                        Parsial
                    </span>
                );
            case "overdue":
                return (
                    <span className={`${base} bg-rose-100 text-rose-700`}>
                        Jatuh Tempo
                    </span>
                );
            default:
                return (
                    <span className={`${base} bg-amber-100 text-amber-700`}>
                        Belum Lunas
                    </span>
                );
        }
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route("payables.pay", payable.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title={`Hutang ${payable.document_number}`} />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("payables.index")}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                        <IconArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        Detail Hutang
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">
                                    Nomor Dokumen
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                    {payable.document_number}
                                </h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={route("pdf.payables.show", payable.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
                                >
                                    <IconPrinter size={18} />
                                    <span className="hidden md:inline">Cetak PDF</span>
                                </a>
                                {statusBadge(payable.status)}
                            </div>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                                    Informasi Supplier
                                </h3>
                                <div className="font-semibold text-slate-900 dark:text-white text-lg">
                                    {payable.supplier?.name || "-"}
                                </div>
                                <div className="text-slate-500 text-sm mt-1">
                                    {payable.supplier?.address || "Alamat tidak tersedia"}
                                </div>
                                {payable.supplier?.phone && (
                                    <div className="text-slate-500 text-sm mt-1">
                                        {payable.supplier.phone}
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">
                                        Jatuh Tempo
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {formatDate(payable.due_date)}
                                    </span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">
                                        Total Tagihan
                                    </span>
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">
                                        {formatCurrency(payable.total)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">
                                        Sudah Dibayar
                                    </span>
                                    <span className="font-semibold text-success-600">
                                        {formatCurrency(payable.paid)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        Sisa Tagihan
                                    </span>
                                    <span className="font-bold text-xl text-primary-600">
                                        {formatCurrency(payable.remaining)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800">
                            <div className="bg-slate-50/50 dark:bg-slate-800/20 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Riwayat Pembayaran
                                </h3>
                            </div>
                            {payable.payments?.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {payable.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    {payment.method === "bank_transfer" ? (
                                                        <IconCreditCard size={18} />
                                                    ) : (
                                                        <IconCash size={18} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {formatCurrency(payment.amount)}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {formatDate(payment.paid_at)} •{" "}
                                                        {payment.user?.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                                    {payment.method.replace("_", " ")}
                                                </div>
                                                {payment.note && (
                                                    <div className="text-xs text-slate-400 max-w-xs">
                                                        {payment.note}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    Belum ada riwayat pembayaran
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {payable.status !== "paid" && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Catat Pembayaran Baru
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        Masukan detail pembayaran untuk tagihan ini
                                    </p>
                                </div>

                                <form onSubmit={submitPayment} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                            Nominal Pembayaran
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.amount}
                                            onChange={(e) =>
                                                setData("amount", e.target.value)
                                            }
                                            className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                            placeholder="0"
                                            required
                                        />
                                        {errors.amount && (
                                            <p className="text-xs text-danger-500 mt-1">
                                                {errors.amount}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                            Tanggal Bayar
                                        </label>
                                        <input
                                            type="date"
                                            value={data.paid_at}
                                            onChange={(e) =>
                                                setData("paid_at", e.target.value)
                                            }
                                            className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                                            Metode Pembayaran
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setData("method", "cash")}
                                                className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                                                    data.method === "cash"
                                                        ? "border-primary-500 bg-primary-50 text-primary-700"
                                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                                }`}
                                            >
                                                <IconCash size={16} />
                                                <span>Tunai</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData("method", "bank_transfer")
                                                }
                                                className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                                                    data.method === "bank_transfer"
                                                        ? "border-primary-500 bg-primary-50 text-primary-700"
                                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                                }`}
                                            >
                                                <IconCreditCard size={16} />
                                                <span>Transfer Bank</span>
                                            </button>
                                        </div>
                                    </div>

                                    {data.method === "bank_transfer" &&
                                        payable.supplier?.bank_name && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-start gap-4">
                                                <div className="shrink-0 p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-200">
                                                    <IconBuildingBank size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 text-sm">
                                                        Rekening Tujuan (Supplier)
                                                    </h4>
                                                    <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                                        <div className="font-medium">
                                                            {payable.supplier.bank_name}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <code className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded font-mono text-base">
                                                                {
                                                                    payable.supplier
                                                                        .account_number
                                                                }
                                                            </code>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(
                                                                        payable.supplier
                                                                            .account_number
                                                                    );
                                                                    toast.success(
                                                                        "Disalin!"
                                                                    );
                                                                }}
                                                                className="p-1 hover:bg-white/20 rounded transition-colors"
                                                                title="Salin No. Rekening"
                                                            >
                                                                <IconCopy size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="truncate">
                                                            a.n{" "}
                                                            {
                                                                payable.supplier
                                                                    .account_name
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {data.method === "bank_transfer" && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                                Sumber Dana (Rekening Kita)
                                            </label>
                                            <select
                                                value={data.bank_account_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "bank_account_id",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                            >
                                                <option value="">
                                                    Pilih rekening pengirim
                                                </option>
                                                {bankAccounts.map((bank) => (
                                                    <option
                                                        key={bank.id}
                                                        value={bank.id}
                                                    >
                                                        {bank.bank_name} -{" "}
                                                        {bank.account_number}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                            Catatan (Opsional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={data.note}
                                            onChange={(e) =>
                                                setData("note", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                            placeholder="Catatan pembayaran..."
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full h-11 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            <IconCash size={18} />
                                            Simpan Pembayaran
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

PayableShow.layout = (page) => <DashboardLayout children={page} />;
