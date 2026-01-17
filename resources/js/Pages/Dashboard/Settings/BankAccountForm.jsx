import React, { useEffect, useState } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    IconArrowLeft,
    IconCheck,
    IconBuildingBank,
    IconInfoCircle,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import Input from "@/Components/Dashboard/Input";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone";

export default function BankAccountForm({ bankAccount = null }) {
    const isEdit = !!bankAccount;
    const { flash } = usePage().props;
    
    const { data, setData, post, processing, errors } = useForm({
        _method: isEdit ? "PUT" : "POST",
        bank_name: bankAccount?.bank_name || "",
        account_number: bankAccount?.account_number || "",
        account_name: bankAccount?.account_name || "",
        logo: null,
        is_active: bankAccount?.is_active ?? true,
    });

    const [imagePreview, setImagePreview] = useState(
        bankAccount?.logo ? `/storage/${bankAccount.logo}` : null
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("logo", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEdit 
            ? route("settings.bank-accounts.update", bankAccount.id) 
            : route("settings.bank-accounts.store");

        post(url, {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={isEdit ? "Edit Rekening Bank" : "Tambah Rekening Bank"} />
            
            <div className="max-w-4xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-primary-500/10 rounded-lg">
                                <IconBuildingBank size={24} className="text-primary-500" />
                            </div>
                            {isEdit ? "Edit Rekening Bank" : "Tambah Rekening Bank"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Detail rekening ini akan tampil pada pilihan metode pembayaran transfer pelanggan.
                        </p>
                    </div>
                    <Link
                        href={route("settings.bank-accounts.index")}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-sm"
                    >
                        <IconArrowLeft size={18} />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Kolom Kiri: Logo Bank (Col 4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <ImageUploadZone
                            title="Logo Bank"
                            icon={IconBuildingBank}
                            imagePreview={imagePreview}
                            onImageChange={handleImageChange}
                            onImageRemove={() => {
                                setImagePreview(null);
                                setData("logo", null);
                            }}
                            error={errors.logo}
                        />
                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex gap-3">
                            <IconInfoCircle size={20} className="text-amber-500 shrink-0" />
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                                <strong>Tips:</strong> Gunakan logo bank berformat PNG transparan agar tampilan pada struk atau invoice terlihat lebih profesional.
                            </p>
                        </div>
                    </div>

                    {/* Kolom Kanan: Detail Rekening (Col 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    label="Nama Bank"
                                    placeholder="Contoh: BCA, Mandiri, BNI..."
                                    value={data.bank_name}
                                    onChange={(e) => setData("bank_name", e.target.value)}
                                    errors={errors.bank_name}
                                />
                                <Input
                                    label="Nomor Rekening"
                                    placeholder="Masukkan digit rekening"
                                    value={data.account_number}
                                    onChange={(e) => setData("account_number", e.target.value)}
                                    errors={errors.account_number}
                                />
                            </div>

                            <Input
                                label="Atas Nama (Pemilik Rekening)"
                                placeholder="Nama sesuai yang terdaftar di bank"
                                value={data.account_name}
                                onChange={(e) => setData("account_name", e.target.value)}
                                errors={errors.account_name}
                            />

                            <div className="flex items-center gap-2 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData("is_active", e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                                    <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Status Rekening Aktif
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <IconCheck size={18} />
                                    {isEdit ? "Update Rekening" : "Simpan Rekening"}
                                </button>
                                <Link
                                    href={route("settings.bank-accounts.index")}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold transition-all"
                                >
                                    Batal
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

BankAccountForm.layout = (page) => <DashboardLayout children={page} />;