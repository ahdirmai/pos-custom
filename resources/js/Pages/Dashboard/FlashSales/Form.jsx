import React, { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import {
    IconArrowLeft,
    IconBolt,
    IconCalendarTime,
    IconCurrencyDollar,
    IconDeviceFloppy,
    IconInfoCircle,
    IconPlus,
    IconTrash,
} from "@tabler/icons-react";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(value || 0));

export default function FlashSaleForm({
    title,
    subtitle,
    submitLabel,
    products,
    data,
    setData,
    errors,
    processing,
    onSubmit,
    backHref,
}) {
    const [selectedProductId, setSelectedProductId] = useState("");

    const selectedItems = data.products || [];

    const availableProducts = useMemo(() => {
        const selectedIds = new Set(selectedItems.map((item) => Number(item.product_id)));

        return products.filter((product) => !selectedIds.has(product.id));
    }, [products, selectedItems]);

    const selectedProducts = useMemo(() => {
        const productMap = new Map(products.map((product) => [product.id, product]));

        return selectedItems.map((item, index) => {
            const product = productMap.get(Number(item.product_id));
            const normalPrice = Number(product?.sell_price || 0);
            const flashPrice = Number(item.discount_price || 0);

            return {
                index,
                product,
                product_id: Number(item.product_id),
                discount_price: item.discount_price,
                normalPrice,
                savings: Math.max(0, normalPrice - flashPrice),
            };
        });
    }, [products, selectedItems]);

    const addProduct = () => {
        if (!selectedProductId) return;

        const product = products.find((item) => item.id === Number(selectedProductId));

        if (!product) return;

        setData("products", [
            ...selectedItems,
            {
                product_id: product.id,
                discount_price: Math.max(0, Number(product.sell_price) - 1000),
            },
        ]);
        setSelectedProductId("");
    };

    const updateProduct = (index, key, value) => {
        const nextItems = [...selectedItems];
        nextItems[index] = {
            ...nextItems[index],
            [key]: value,
        };

        setData("products", nextItems);
    };

    const removeProduct = (index) => {
        setData(
            "products",
            selectedItems.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 uppercase tracking-wider mb-2 transition-colors"
                    >
                        <IconArrowLeft size={14} />
                        Kembali ke Flash Sale
                    </Link>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-rose-500/10 rounded-lg">
                            <IconBolt size={24} className="text-rose-500" />
                        </div>
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <form onSubmit={onSubmit} className="pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-5">
                            <div className="flex gap-3">
                                <IconInfoCircle size={20} className="text-rose-500 shrink-0" />
                                <div className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed space-y-2">
                                    <p>
                                        Hanya satu sesi flash sale yang bisa aktif pada satu waktu.
                                    </p>
                                    <p>
                                        Jika sesi ini diaktifkan, sesi aktif lain akan otomatis dinonaktifkan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                    Status Sesi
                                </h3>
                            </div>

                            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:border-rose-200 dark:hover:border-rose-800 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData("is_active", e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                                />
                                <div>
                                    <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                                        Aktifkan flash sale ini
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        Gunakan untuk sesi yang sedang berjalan atau siap ditayangkan.
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                    Informasi Sesi
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <Input
                                        type="text"
                                        label="Nama Flash Sale"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        errors={errors.name}
                                        placeholder="Contoh: Flash Sale Gajian"
                                    />
                                </div>

                                <Input
                                    type="datetime-local"
                                    label="Mulai"
                                    value={data.start_at}
                                    onChange={(e) => setData("start_at", e.target.value)}
                                    errors={errors.start_at}
                                    icon={<IconCalendarTime size={16} />}
                                />

                                <Input
                                    type="datetime-local"
                                    label="Berakhir"
                                    value={data.end_at}
                                    onChange={(e) => setData("end_at", e.target.value)}
                                    errors={errors.end_at}
                                    icon={<IconCalendarTime size={16} />}
                                />

                                <div className="md:col-span-2">
                                    <Textarea
                                        label="Deskripsi Sesi"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        errors={errors.description}
                                        placeholder="Tambahkan copy pendek untuk sesi promo ini..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                        Produk Flash Sale
                                    </h3>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="w-full sm:min-w-[260px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    >
                                        <option value="">Pilih produk...</option>
                                        {availableProducts.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.title} - {formatCurrency(product.sell_price)}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={addProduct}
                                        disabled={!selectedProductId}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
                                    >
                                        <IconPlus size={18} />
                                        Tambah
                                    </button>
                                </div>
                            </div>

                            {errors.products && (
                                <div className="mb-4 text-sm text-danger-500">{errors.products}</div>
                            )}

                            {selectedProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedProducts.map((item) => (
                                        <div
                                            key={`${item.product_id}-${item.index}`}
                                            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 p-4"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <p className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                                                                {item.product?.title || "Produk tidak ditemukan"}
                                                            </p>
                                                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                                <span className="px-2 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                                    Harga normal: {formatCurrency(item.normalPrice)}
                                                                </span>
                                                                <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                                                                    Hemat: {formatCurrency(item.savings)}
                                                                </span>
                                                                <span className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                                                                    Stok: {item.product?.stock ?? 0}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeProduct(item.index)}
                                                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 transition-colors"
                                                        >
                                                            <IconTrash size={18} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="w-full lg:w-64">
                                                    <Input
                                                        type="number"
                                                        label="Harga Flash Sale"
                                                        value={item.discount_price}
                                                        onChange={(e) =>
                                                            updateProduct(item.index, "discount_price", e.target.value)
                                                        }
                                                        errors={errors[`products.${item.index}.discount_price`]}
                                                        icon={<IconCurrencyDollar size={16} />}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Belum ada produk yang masuk ke sesi flash sale ini.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Link
                                href={backHref}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <IconDeviceFloppy size={20} />
                                {processing ? "Menyimpan..." : submitLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
