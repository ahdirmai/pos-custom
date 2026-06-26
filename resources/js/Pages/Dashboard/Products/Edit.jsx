import React, { useEffect, useState } from "react";
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
    IconPhoto,
    IconBarcode,
    IconCurrencyDollar,
    IconTrendingUp,
    IconInfoCircle,
    IconRuler,
    IconWeight,
} from "@tabler/icons-react";
import { getProductImageUrl } from "@/Utils/imageUrl";

export default function Edit({ categories, product }) {
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        image: "",
        barcode: product.barcode || "",
        sku: product.sku || "",
        title: product.title || "",
        category_id: product.category_id || "",
        description: product.description || "",
        buy_price: product.buy_price || 0,
        sell_price: product.sell_price || 0,
        stock: product.stock || 0,
        is_pph23: product.is_pph23 || false,
        weight: product.product_detail?.weight || "",
        length: product.product_detail?.length || "10",
        width: product.product_detail?.width || "10",
        height: product.product_detail?.height || "10",
        _method: "PUT",
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        product.image ? getProductImageUrl(product.image) : null
    );

    useEffect(() => {
        if (product.category_id) {
            setSelectedCategory(
                categories.find((cat) => cat.id === product.category_id)
            );
        }
    }, [product.category_id, categories]);

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

    // Logika Generate Barcode: Wajib SKU + 5 Digit Random
    const handleGenerateBarcode = () => {
        if (!data.sku) {
            toast.error("Harap isi SKU terlebih dahulu!");
            return;
        }

        // Generate 5 digit angka random (10000 - 99999)
        const randomDigits = Math.floor(10000 + Math.random() * 90000);
        const autoBarcode = `${data.sku.toUpperCase()}-${randomDigits}`;

        setData("barcode", autoBarcode);
        toast.success("Barcode berhasil dibuat berdasarkan SKU");
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("products.update", product.id), {
            onSuccess: () => toast.success("Produk berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui produk"),
        });
    };

    return (
        <>
            <Head title={`Edit - ${product.title}`} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Link
                        href={route("products.index")}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 uppercase tracking-wider mb-2 transition-colors"
                    >
                        <IconArrowLeft size={14} />
                        Kembali ke Produk
                    </Link>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-primary-500/10 rounded-lg">
                            <IconPackage size={24} className="text-primary-500" />
                        </div>
                        Edit Produk
                    </h1>
                </div>
                <div className="hidden md:block">
                    <p className="text-xs text-slate-400 text-right">Terakhir diperbarui:</p>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">
                        {new Date(product.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sisi Kiri: Media & Ringkasan (Col 4) */}
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
                            <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2">
                                <IconInfoCircle size={18} />
                                Tips Visual
                            </h4>
                            <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
                                Gunakan foto produk dengan latar belakang polos dan pencahayaan yang terang untuk menarik minat pelanggan. Ukuran ideal 1000x1000 pixel.
                            </p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Detail & Harga (Col 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Detail Utama */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">Informasi Produk</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <Input
                                        type="text"
                                        label="Nama Produk"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        errors={errors.title}
                                        placeholder="Contoh: Kopi Susu Gula Aren"
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
                                    valueKey="id"
                                />

                                <Input
                                    type="text"
                                    label={<span>SKU <small className="text-slate-400 font-normal italic">(Stock Keeping Unit)</small></span>}
                                    value={data.sku}
                                    onChange={(e) => setData("sku", e.target.value)}
                                    errors={errors.sku}
                                    placeholder="KSG-001"
                                />

                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                            <IconBarcode size={16} /> Barcode
                                        </label>
                                        <button 
                                            type="button"
                                            onClick={handleGenerateBarcode}
                                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded transition-all active:scale-95 ${
                                                !data.sku 
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                                : 'text-primary-500 bg-primary-50 hover:text-primary-600 dark:bg-primary-950/30'
                                            }`}
                                        >
                                            Generate
                                        </button>
                                    </div>
                                    <Input
                                        type="text"
                                        value={data.barcode}
                                        onChange={(e) => setData("barcode", e.target.value)}
                                        errors={errors.barcode}
                                        placeholder={!data.sku ? "Isi SKU untuk generate otomatis" : "Input atau scan barcode"}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Textarea
                                        label="Deskripsi Produk"
                                        placeholder="Jelaskan detail produk, rasa, ukuran, atau spesifikasi lainnya..."
                                        errors={errors.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        value={data.description}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Inventori & Harga */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="w-1.5 h-6 bg-success-500 rounded-full"></div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">Manajemen Harga & Stok</h3>
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                        Jumlah Stok
                                    </label>
                                    <div className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-sm flex items-center justify-between">
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                            {product.stock}
                                        </span>
                                        <a
                                            href={route("stocks.show", product.id)}
                                            className="text-xs font-medium text-primary-600 hover:underline"
                                        >
                                            Kelola Stok &rarr;
                                        </a>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Stok dikelola lewat Barang Masuk / Opname (FIFO).
                                    </p>
                                </div>
                                <div className="md:col-span-3 pt-2">
                                    <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={data.is_pph23}
                                            onChange={(e) => setData("is_pph23", e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                                        />
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                                                Kenakan PPh 23 
                                            </span>
                                            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Aktifkan opsi ini jika produk adalah yang dikenakan pemotongan PPh 23 (2%).
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Profit Estimation Panel */}
                            {data.buy_price > 0 && data.sell_price > 0 && (
                                <div className="mt-6 overflow-hidden rounded-2xl border border-success-200 dark:border-success-900/50 bg-success-50/50 dark:bg-success-950/20">
                                    <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-success-200 dark:divide-success-900/50">
                                        <div className="flex-1 p-4 flex items-center gap-4">
                                            <div className="p-3 bg-success-500 text-white rounded-xl shadow-lg shadow-success-500/20">
                                                <IconTrendingUp size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-success-700 dark:text-success-400 tracking-widest">Laba per Produk</p>
                                                <p className="text-xl font-black text-success-600 dark:text-success-500">
                                                    Rp {(data.sell_price - data.buy_price).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col justify-center">
                                            <p className="text-[10px] uppercase font-bold text-success-700 dark:text-success-400 tracking-widest">Margin Profit</p>
                                            <p className="text-xl font-black text-success-600 dark:text-success-500">
                                                {(((data.sell_price - data.buy_price) / data.buy_price) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Berat & Dimensi */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">Berat & Dimensi (Pengiriman)</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                <div className="md:col-span-1">
                                    <Input
                                        type="number"
                                        label="Berat (Gram)"
                                        value={data.weight}
                                        onChange={(e) => setData("weight", e.target.value)}
                                        errors={errors.weight}
                                        placeholder="Min. 1"
                                        icon={<IconWeight size={16} />}
                                    />
                                </div>
                                <div className="md:col-span-3 grid grid-cols-3 gap-3">
                                    <Input
                                        type="number"
                                        label="Panjang (cm)"
                                        value={data.length}
                                        onChange={(e) => setData("length", e.target.value)}
                                        errors={errors.length}
                                        placeholder="10"
                                        icon={<IconRuler size={16} />}
                                    />
                                    <Input
                                        type="number"
                                        label="Lebar (cm)"
                                        value={data.width}
                                        onChange={(e) => setData("width", e.target.value)}
                                        errors={errors.width}
                                        placeholder="10"
                                        icon={<IconRuler size={16} />}
                                    />
                                    <Input
                                        type="number"
                                        label="Tinggi (cm)"
                                        value={data.height}
                                        onChange={(e) => setData("height", e.target.value)}
                                        errors={errors.height}
                                        placeholder="10"
                                        icon={<IconRuler size={16} />}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="hidden sm:block text-xs text-slate-400 flex-1">Periksa kembali SKU dan Harga sebelum menyimpan perubahan.</p>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Link
                                    href={route("products.index")}
                                    className="flex-1 sm:flex-none px-6 py-2 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all text-center text-sm"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-10 py-2 sm:py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-xl shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <IconDeviceFloppy size={20} />
                                    {processing ? "Menyimpan..." : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;