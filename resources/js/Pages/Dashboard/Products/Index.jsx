import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconLayoutGrid,
    IconList,
    IconPhoto,
    IconPackage,
    IconSearch,
    IconBarcode,
    IconPrinter,
    IconMessageCircle,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import { getProductImageUrl } from "@/Utils/imageUrl";
import BarcodePrintModal from "@/Components/Barcode/BarcodePrintModal";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

// Product Card for Grid View
function ProductCard({
    product,
    index,
    currentPage,
    perPage,
    isSelected,
    onToggle,
}) {
    const rowNumber = index + 1 + (currentPage - 1) * perPage;
    const lowStock = product.stock > 0 && product.stock <= 5;
    const outOfStock = product.stock === 0;

    const profit = product.sell_price - product.buy_price;

    return (
        <div
            className={`group bg-white dark:bg-slate-900 rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 ${isSelected
                ? "border-primary-500 ring-2 ring-primary-500/10"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
        >
            {/* Image Section - Radius disesuaikan */}
            <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden m-1.5 rounded-lg">
                {/* Checkbox */}
                <div className="absolute top-1 left-1 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(product)}
                        className="w-4 h-4 rounded border-2 border-white bg-white/80 text-primary-500 focus:ring-primary-500 cursor-pointer shadow-sm transition-transform active:scale-90"
                    />
                </div>

                {/* Profit Badge */}
                {profit > 0 && (
                    <div className="absolute bottom-2 left-2 z-10">
                        <span className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm backdrop-blur-md">
                            Profit: {formatCurrency(profit)}
                        </span>
                    </div>
                )}

                {product.image ? (
                    <img
                        src={getProductImageUrl(product.image)}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <IconPhoto size={40} className="text-slate-300 dark:text-slate-600" strokeWidth={1} />
                    </div>
                )}

                {/* Stock Tag */}
                <div className="absolute top-1 right-1">
                    {outOfStock ? (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-md uppercase tracking-wider">
                            Habis
                        </span>
                    ) : (
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${lowStock ? "bg-amber-500 text-white animate-pulse" : "bg-slate-900/60 text-white"
                            }`}>
                            Stok: {product.stock}
                        </span>
                    )}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <Link
                        href={route("products.reviews", product.id)}
                        className="p-2 rounded-lg bg-white text-primary-600 hover:bg-primary-50 shadow-lg transition-all active:scale-95"
                        title="Ulasan"
                    >
                        <IconMessageCircle size={18} />
                    </Link>
                    <Link
                        href={route("products.edit", product.id)}
                        className="p-2 rounded-lg bg-white text-amber-600 hover:bg-amber-50 shadow-lg transition-all active:scale-95"
                    >
                        <IconPencilCog size={18} />
                    </Link>
                    <Button
                        type={"delete"}
                        icon={<IconTrash size={18} />}
                        className="p-2 rounded-lg bg-white text-red-600 hover:bg-red-50 shadow-lg transition-all active:scale-95"
                        url={route("products.destroy", product.id)}
                    />
                </div>
            </div>

            {/* Details Section */}
            <div className="p-3 pt-0">
                <div className="mb-1">
                    <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-tight bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-md">
                        {product.category?.name || "No Category"}
                    </span>
                    {product.is_pph23 === 1 && (
                        <span className="ml-1 text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight bg-orange-50 dark:bg-orange-900/30 px-1.5 py-0.5 rounded-md border border-orange-200 dark:border-orange-800">
                            PPh 23
                        </span>
                    )}
                </div>

                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.title}
                </h3>

                <div className="space-y-2.5">
                    <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mb-1">Harga Jual</p>
                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                            {formatCurrency(product.sell_price)}
                        </p>
                    </div>

                    {product.barcode && (
                        <div className="flex items-center gap-1.5 py-1 px-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                            <IconBarcode size={14} className="text-slate-400" />
                            <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 truncate">
                                {product.barcode}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default function Index({ products }) {
    const { roles, permissions, errors } = usePage().props;
    const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const [singleProductBarcode, setSingleProductBarcode] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handlePrintSingleBarcode = (product) => {
        setSingleProductBarcode(product);
        setSelectedProducts([]);
        setShowBarcodeModal(true);
    };

    const handlePrintAllBarcodes = () => {
        setSingleProductBarcode(null);
        setSelectedProducts(products.data);
        setShowBarcodeModal(true);
    };

    const handlePrintSelected = () => {
        if (selectedProducts.length === 0) return;
        setSingleProductBarcode(null);
        setShowBarcodeModal(true);
    };

    const toggleProductSelection = (product) => {
        setSelectedProducts((prev) => {
            const isSelected = prev.some((p) => p.id === product.id);
            if (isSelected) {
                return prev.filter((p) => p.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectedProducts.length === products.data.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts([...products.data]);
        }
    };

    const isProductSelected = (productId) =>
        selectedProducts.some((p) => p.id === productId);

    return (
        <>
            <Head title="Produk" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Produk
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {products.total} produk terdaftar
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={handlePrintAllBarcodes}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto"
                        >
                            <IconBarcode size={18} />
                            Cetak All Barcode
                        </button>
                        <Button
                            type={"link"}
                            icon={
                                <IconCirclePlus size={18} strokeWidth={1.5} />
                            }
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 w-full sm:w-auto justify-center"
                            }
                            label={"Tambah Produk"}
                            href={route("products.create")}
                        />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-full sm:w-80">
                        <Search
                            url={route("products.index")}
                            placeholder="Cari produk..."
                        />
                    </div>
                    {/* Select All Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={
                                selectedProducts.length ===
                                products.data.length &&
                                products.data.length > 0
                            }
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline">
                            Pilih Semua
                        </span>
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    {/* Show selection count and print selected button */}
                    {selectedProducts.length > 0 && (
                        <button
                            onClick={handlePrintSelected}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
                        >
                            <IconPrinter size={18} />
                            Cetak Terpilih ({selectedProducts.length})
                        </button>
                    )}
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-colors ${viewMode === "grid"
                            ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        title="Grid View"
                    >
                        <IconLayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-colors ${viewMode === "list"
                            ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                            : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        title="List View"
                    >
                        <IconList size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {products.data.length > 0 ? (
                viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                        {products.data.map((product, i) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={i}
                                currentPage={products.current_page}
                                perPage={products.per_page}
                                isSelected={isProductSelected(product.id)}
                                onToggle={toggleProductSelection}
                            />
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <Table.Card title={"Data Produk"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className="w-10">No</Table.Th>
                                    <Table.Th>Produk</Table.Th>
                                    <Table.Th>Kategori</Table.Th>
                                    <Table.Th>Harga Beli</Table.Th>
                                    <Table.Th>Harga Jual</Table.Th>
                                    <Table.Th>Stok</Table.Th>
                                    <Table.Th></Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {products.data.map((product, i) => (
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        key={product.id}
                                    >
                                        <Table.Td className="text-center">
                                            {++i +
                                                (products.current_page - 1) *
                                                products.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                    {product.image ? (
                                                        <img
                                                            src={getProductImageUrl(product.image)}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <IconPackage
                                                                size={16}
                                                                className="text-slate-400"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                        {product.title}
                                                        {product.is_pph23 === 1 && (
                                                            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-800">
                                                                PPh 23
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                                                        {product.barcode && (
                                                            <p>
                                                                Barcode: {product.barcode}
                                                            </p>
                                                        )}
                                                        {product.sku && <p>SKU: {product.sku}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                                                {product.category?.name}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            {formatCurrency(product.buy_price)}
                                        </Table.Td>
                                        <Table.Td className="font-semibold text-primary-600 dark:text-primary-400">
                                            {formatCurrency(product.sell_price)}
                                        </Table.Td>
                                        <Table.Td>
                                            <span
                                                className={`px-2 py-0.5 text-xs font-medium rounded ${product.stock === 0
                                                    ? "bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-400"
                                                    : product.stock <= 5
                                                        ? "bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-400"
                                                        : "bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-400"
                                                    }`}
                                            >
                                                {product.stock}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2">
                                                <Button
                                                    type={"link"}
                                                    icon={
                                                        <IconMessageCircle
                                                            size={16}
                                                            strokeWidth={1.5}
                                                        />
                                                    }
                                                    className={
                                                        "border bg-primary-100 border-primary-200 text-primary-600 hover:bg-primary-200 dark:bg-primary-900/50 dark:border-primary-800 dark:text-primary-400"
                                                    }
                                                    href={route(
                                                        "products.reviews",
                                                        product.id
                                                    )}
                                                />
                                                <Button
                                                    type={"edit"}
                                                    icon={
                                                        <IconPencilCog
                                                            size={16}
                                                            strokeWidth={1.5}
                                                        />
                                                    }
                                                    className={
                                                        "border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                    }
                                                    href={route(
                                                        "products.edit",
                                                        product.id
                                                    )}
                                                />
                                                <Button
                                                    type={"delete"}
                                                    icon={
                                                        <IconTrash
                                                            size={16}
                                                            strokeWidth={1.5}
                                                        />
                                                    }
                                                    className={
                                                        "border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                    }
                                                    url={route(
                                                        "products.destroy",
                                                        product.id
                                                    )}
                                                />
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.Card>
                )
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff
                            size={32}
                            className="text-slate-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Produk
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan produk pertama Anda untuk memulai.
                    </p>
                    <Button
                        type={"link"}
                        icon={<IconCirclePlus size={18} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white"
                        }
                        label={"Tambah Produk"}
                        href={route("products.create")}
                    />
                </div>
            )}

            {products.last_page !== 1 && <Pagination links={products.links} />}

            {/* Barcode Print Modal */}
            <BarcodePrintModal
                isOpen={showBarcodeModal}
                onClose={() => {
                    setShowBarcodeModal(false);
                    setSingleProductBarcode(null);
                }}
                products={selectedProducts}
                singleProduct={singleProductBarcode}
            />
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
