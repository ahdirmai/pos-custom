import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import InputSelect from "@/Components/Dashboard/InputSelect";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone";
import toast from "react-hot-toast";
import {
    IconPackage,
    IconDeviceFloppy,
    IconArrowLeft,
    IconCurrencyDollar,
    IconTrendingUp,
    IconInfoCircle,
    IconBarcode,
} from "@tabler/icons-react";

export default function Create({ categories }) {
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        image: "",
        barcode: "",
        sku: "",
        title: "",
        category_id: "",
        description: "",
        buy_price: "",
        sell_price: "",
        stock: "",
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const setSelectedCategoryHandler = (value) => {
        setSelectedCategory(value);
        setData("category_id", value?.id || "");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Logika Generate Barcode Berdasarkan SKU
    const handleGenerateBarcode = () => {
        if (!data.sku) {
            toast.error("Wajib isi SKU dulu sebelum generate barcode!");
            return;
        }
        
        // Membuat barcode unik gabungan SKU + Random Number
        const randomDigits = Math.floor(10000 + Math.random() * 90000);
const autoBarcode = `${data.sku.toUpperCase()}-${randomDigits}`;
        
        setData("barcode", autoBarcode);
        toast.success("Barcode berhasil di-generate dari SKU");
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            onSuccess: () => toast.success("Produk berhasil ditambahkan"),
            onError: () => toast.error("Gagal menyimpan produk"),
        });
    };

    return (
        <>
            <Head title="Tambah Produk Baru" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Link
                        href={route("products.index")}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 uppercase tracking-wider mb-2 transition-colors"
                    >
                        <IconArrowLeft size={14} />
                        Kembali ke Daftar Produk
                    </Link>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-primary-500/10 rounded-lg">
                            <IconPackage size={24} className="text-primary-500" />
                        </div>
                        Tambah Produk Baru
                    </h1>
                </div>
            </div>

            <form onSubmit={submit} className="pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sisi Kiri: Media (Col 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <ImageUploadZone 
                            title="Foto Produk"
                            icon={IconPackage}
                            imagePreview={imagePreview}
                            onImageChange={handleImageChange}
                            onImageRemove={() => {
                                setImagePreview(null);
                                setData('image', null);
                            }}
                            error={errors.image}
                        />

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5">
                            <div className="flex gap-3">
                                <IconInfoCircle size={20} className="text-blue-500 shrink-0" />
                                <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
                                    <strong>Tips:</strong> Gunakan SKU yang konsisten untuk memudahkan sistem men-generate Barcode secara otomatis.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan: Detail & Harga (Col 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Detail Utama */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">Informasi Dasar</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <Input
                                        type="text"
                                        label="Nama Produk"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        errors={errors.title}
                                        placeholder="Ketik nama produk..."
                                    />
                                </div>
                                
                                <InputSelect
                                    label="Kategori"
                                    data={categories}
                                    selected={selectedCategory}
                                    setSelected={setSelectedCategoryHandler}
                                    placeholder="Pilih kategori"
                                    errors={errors.category_id}
                                    searchable={true}
                                    displayKey="name"
                                />

                                <Input
                                    type="text"
                                    label={<span>SKU <small className="text-slate-400 font-normal italic">(Stock Keeping Unit)</small></span>}
                                    value={data.sku}
                                    onChange={(e) => setData("sku", e.target.value)}
                                    errors={errors.sku}
                                    placeholder="Wajib diisi untuk barcode"
                                />

                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                            <IconBarcode size={16} /> Barcode
                                        </label>
                                        <button 
                                            type="button"
                                            onClick={handleGenerateBarcode}
                                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded transition-all active:scale-95 ${
                                                !data.sku 
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                                : 'text-primary-500 bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/30'
                                            }`}
                                        >
                                            Buat Otomatis dari SKU
                                        </button>
                                    </div>
                                    <Input
                                        type="text"
                                        value={data.barcode}
                                        onChange={(e) => setData("barcode", e.target.value)}
                                        errors={errors.barcode}
                                        placeholder={!data.sku ? "Isi SKU terlebih dahulu..." : "Masukkan atau scan barcode"}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Textarea
                                        label="Deskripsi"
                                        placeholder="Tambahkan catatan atau deskripsi singkat produk..."
                                        errors={errors.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        value={data.description}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Harga & Inventori */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">Keuangan & Stok</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <Input
                                    type="number"
                                    label="Harga Beli (Modal)"
                                    value={data.buy_price}
                                    onChange={(e) => setData("buy_price", e.target.value)}
                                    errors={errors.buy_price}
                                    placeholder="0"
                                    icon={<IconCurrencyDollar size={16} />}
                                />
                                <Input
                                    type="number"
                                    label="Harga Jual"
                                    value={data.sell_price}
                                    onChange={(e) => setData("sell_price", e.target.value)}
                                    errors={errors.sell_price}
                                    placeholder="0"
                                    icon={<IconCurrencyDollar size={16} />}
                                />
                                <Input
                                    type="number"
                                    label="Stok Awal"
                                    value={data.stock}
                                    onChange={(e) => setData("stock", e.target.value)}
                                    errors={errors.stock}
                                    placeholder="0"
                                />
                            </div>

                            {/* Profit Estimation Panel */}
                            {data.buy_price > 0 && data.sell_price > 0 && (
                                <div className="mt-6 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                                            <IconTrendingUp size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-widest">Estimasi Profit</p>
                                            <p className="text-xl font-black text-emerald-600 dark:text-emerald-500">
                                                Rp {(data.sell_price - data.buy_price).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-widest">Margin</p>
                                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-500">
                                            {(((data.sell_price - data.buy_price) / data.buy_price) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Link
                                href={route("products.index")}
                                className="px-8 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all text-sm"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-10 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-xl shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <IconDeviceFloppy size={20} />
                                {processing ? "Proses..." : "Simpan Produk"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;