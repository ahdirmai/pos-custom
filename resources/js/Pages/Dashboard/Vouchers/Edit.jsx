import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Button from "@/Components/Dashboard/Button";
import { IconDeviceFloppy, IconArrowLeft } from "@tabler/icons-react";

export default function Edit({ voucher }) {
    const { data, setData, put, processing, errors } = useForm({
        code: voucher.code,
        name: voucher.name,
        discount_target: voucher.discount_target,
        discount_type: voucher.discount_type,
        amount: voucher.amount,
        min_spend: voucher.min_spend || "",
        max_discount: voucher.max_discount || "",
        quota: voucher.quota,
        limit_per_user: voucher.limit_per_user || "",
        start_date: voucher.start_date.substring(0, 16), // Format for datetime-local
        end_date: voucher.end_date.substring(0, 16),
        is_active: Boolean(voucher.is_active),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("vouchers.update", voucher.id));
    };

    return (
        <>
            <Head title="Edit Voucher" />
            <div className="mb-6 flex items-center gap-4">
                <Link href={route("vouchers.index")}>
                    <Button
                        type="button"
                        icon={<IconArrowLeft size={18} />}
                        className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                    />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Edit Voucher: {voucher.code}
                </h1>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-4xl">
                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                            Informasi Dasar
                        </h3>
                    </div>

                    <Input
                        label="Kode Voucher"
                        placeholder="Contoh: SALE2026"
                        value={data.code}
                        onChange={(e) => setData("code", e.target.value.toUpperCase())}
                        errors={errors.code}
                    />

                    <Input
                        label="Nama Voucher"
                        placeholder="Contoh: Diskon Lebaran"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        errors={errors.name}
                    />

                    {/* Discount Rules */}
                    <div className="md:col-span-2 space-y-4 mt-2">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                            Aturan Diskon
                        </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Target Diskon
                        </label>
                        <select
                            className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:border-primary-500 focus:ring-primary-500"
                            value={data.discount_target}
                            onChange={(e) => setData("discount_target", e.target.value)}
                        >
                            <option value="subtotal">Total Belanja (Subtotal)</option>
                            <option value="shipping">Ongkos Kirim</option>
                        </select>
                        {errors.discount_target && (
                            <div className="text-xs text-red-500">{errors.discount_target}</div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Tipe Potongan
                        </label>
                        <select
                            className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:border-primary-500 focus:ring-primary-500"
                            value={data.discount_type}
                            onChange={(e) => setData("discount_type", e.target.value)}
                        >
                            <option value="fixed">Nominal Tetap (Rp)</option>
                            <option value="percentage">Persentase (%)</option>
                        </select>
                        {errors.discount_type && (
                            <div className="text-xs text-red-500">{errors.discount_type}</div>
                        )}
                    </div>

                    <Input
                        type="number"
                        label="Besar Potongan"
                        placeholder={data.discount_type === 'percentage' ? "Contoh: 10" : "Contoh: 10000"}
                        value={data.amount}
                        onChange={(e) => setData("amount", e.target.value)}
                        errors={errors.amount}
                        description={data.discount_type === 'percentage' ? 'Dalam persen (%)' : 'Dalam Rupiah (Rp)'}
                    />

                    <Input
                        type="number"
                        label="Minimal Belanja (Opsional)"
                        placeholder="Contoh: 50000"
                        value={data.min_spend}
                        onChange={(e) => setData("min_spend", e.target.value)}
                        errors={errors.min_spend}
                    />

                    {data.discount_type === 'percentage' && (
                        <Input
                            type="number"
                            label="Maksimal Diskon (Opsional)"
                            placeholder="Contoh: 20000"
                            value={data.max_discount}
                            onChange={(e) => setData("max_discount", e.target.value)}
                            errors={errors.max_discount}
                            description="Batas maksimal potongan jika menggunakan persentase"
                        />
                    )}

                    {/* Limits & Date */}
                    <div className="md:col-span-2 space-y-4 mt-2">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                            Batasan & Waktu
                        </h3>
                    </div>

                    <Input
                        type="number"
                        label="Total Kuota Voucher"
                        placeholder="Contoh: 100"
                        value={data.quota}
                        onChange={(e) => setData("quota", e.target.value)}
                        errors={errors.quota}
                    />

                    <Input
                        type="number"
                        label="Limit per User (Opsional)"
                        placeholder="Contoh: 1"
                        value={data.limit_per_user}
                        onChange={(e) => setData("limit_per_user", e.target.value)}
                        errors={errors.limit_per_user}
                        description="Kosongkan jika tidak ada batasan per user"
                    />

                    <Input
                        type="datetime-local"
                        label="Mulai Berlaku"
                        value={data.start_date}
                        onChange={(e) => setData("start_date", e.target.value)}
                        errors={errors.start_date}
                    />

                    <Input
                        type="datetime-local"
                        label="Berakhir Pada"
                        value={data.end_date}
                        onChange={(e) => setData("end_date", e.target.value)}
                        errors={errors.end_date}
                    />

                    <div className="md:col-span-2 flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData("is_active", e.target.checked)}
                            className="rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                            id="is_active"
                        />
                        <label htmlFor="is_active" className="text-sm cursor-pointer select-none text-slate-700 dark:text-slate-300">
                            Aktifkan Voucher Ini Secara Langsung
                        </label>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <Link href={route("vouchers.index")}>
                            <button
                                type="button"
                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
                            >
                                Batal
                            </button>
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <IconDeviceFloppy size={20} />
                            {processing ? "Simpan Perubahan" : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
