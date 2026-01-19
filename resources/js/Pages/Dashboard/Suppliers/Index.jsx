import React, { useEffect, useState } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Button from "@/Components/Dashboard/Button";
import { 
    IconBuildingStore, 
    IconPencilCog, 
    IconTrash, 
    IconCirclePlus, 
    IconPhone,
    IconMapPin,
    IconCreditCard,
    IconDatabaseOff,
    IconX,
    IconAlertTriangle
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";

// Simple Modal Component
const SimpleModal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 transition-all">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animation-scale-up flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <IconX size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Supplier Card for Mobile Grid View
function SupplierCard({ supplier, onEdit, onDelete }) {
    const getAvatarUrl = (name) => {
        const colors = ['4e73df', '1cc88a', '36b9cc', 'f6c23e', 'e74a3b', '5a5c69', '6f42c1'];
        const colorIndex = name.length % colors.length;
        const selectedBg = colors[colorIndex];
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${selectedBg}&color=fff&bold=true`;
    };

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col h-full">
            {/* Header: Avatar & Name */}
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={getAvatarUrl(supplier.name)}
                    alt={supplier.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {supplier.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {supplier.email || "-"}
                    </p>
                </div>
            </div>

            {/* Info Details */}
            <div className="space-y-2 mb-4 flex-1">
                {supplier.phone && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <IconPhone size={14} className="flex-shrink-0" />
                        <span className="truncate">{supplier.phone}</span>
                    </div>
                )}
                {supplier.address && (
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <IconMapPin size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{supplier.address}</span>
                    </div>
                )}
                {supplier.bank_name && (
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <IconCreditCard size={14} className="flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                {supplier.bank_name} - {supplier.account_number}
                            </span>
                            <span className="text-xs opacity-75">a.n {supplier.account_name}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col xl:flex-row gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => onEdit(supplier)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-warning-100 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:text-warning-400 text-xs sm:text-sm font-medium transition-colors"
                >
                    <IconPencilCog size={14} />
                    <span>Edit</span>
                </button>
                <button
                    onClick={() => onDelete(supplier.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-danger-100 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:text-danger-400 text-xs sm:text-sm font-medium transition-colors"
                >
                    <IconTrash size={14} />
                    <span>Hapus</span>
                </button>
            </div>
        </div>
    );
}

export default function SuppliersIndex({ suppliers, filters = {} }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        bank_name: "",
        account_number: "",
        account_name: "",
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            setIsModalOpen(false);
            reset();
            setEditingSupplier(null);
        }
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const openCreateModal = () => {
        setEditingSupplier(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (supplier) => {
        setEditingSupplier(supplier);
        setData({
            name: supplier.name || "",
            phone: supplier.phone || "",
            email: supplier.email || "",
            address: supplier.address || "",
            bank_name: supplier.bank_name || "",
            account_number: supplier.account_number || "",
            account_name: supplier.account_name || "",
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingSupplier) {
            put(route("suppliers.update", editingSupplier.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("suppliers.store"), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const openDeleteModal = (id) => {
        setSupplierToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSupplierToDelete(null);
    };

    const confirmDelete = () => {
        destroy(route("suppliers.destroy", supplierToDelete), {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
            onError: () => closeDeleteModal(),
        });
    };

    const rows = suppliers.data || [];

    const getAvatarUrl = (name) => {
        const colors = ['4e73df', '1cc88a', '36b9cc', 'f6c23e', 'e74a3b', '5a5c69', '6f42c1'];
        const colorIndex = name.length % colors.length;
        const selectedBg = colors[colorIndex];
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${selectedBg}&color=fff&bold=true`;
    };

    return (
        <>
            <Head title="Supplier" />
            
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Supplier
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Kelola data pemasok barang.
                        </p>
                    </div>
                    <Button
                        type="button" // Important: type button to avoid submit behaviour if wrapped in form
                        onClick={openCreateModal}
                        icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                        className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                        label="Tambah Supplier"
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("suppliers.index")}
                        placeholder="Cari nama, telepon..."
                    />
                </div>
            </div>

            {/* Content */}
            {rows.length > 0 ? (
                <>
                    {/* Mobile Grid View */}
                    <div className="sm:hidden grid grid-cols-1 gap-4">
                        {rows.map((sup) => (
                            <SupplierCard
                                key={sup.id}
                                supplier={sup}
                                onEdit={openEditModal}
                                onDelete={openDeleteModal}
                            />
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block">
                        <Table.Card title="Data Supplier">
                            <Table>
                                <Table.Thead>
                                    <tr>
                                        <Table.Th>Nama Supplier</Table.Th>
                                        <Table.Th>Kontak</Table.Th>
                                        <Table.Th>Alamat</Table.Th>
                                        <Table.Th>Rekening Bank</Table.Th>
                                        <Table.Th></Table.Th>
                                    </tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {rows.map((sup) => (
                                        <tr key={sup.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <Table.Td>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={getAvatarUrl(sup.name)}
                                                        alt={sup.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                            {sup.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Table.Td>
                                            <Table.Td>
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">{sup.phone || "-"}</span>
                                                    <span className="text-xs text-slate-400">{sup.email}</span>
                                                </div>
                                            </Table.Td>
                                            <Table.Td>
                                                 <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-xs" title={sup.address}>
                                                    {sup.address || "-"}
                                                </p>
                                            </Table.Td>
                                            <Table.Td>
                                                {sup.bank_name ? (
                                                    <div className="text-sm">
                                                        <p className="font-medium text-slate-700 dark:text-slate-300">{sup.bank_name}</p>
                                                        <p className="text-xs text-slate-500">{sup.account_number}</p>
                                                        <p className="text-xs text-slate-400">a.n {sup.account_name}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">-</span>
                                                )}
                                            </Table.Td>
                                            <Table.Td>
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        type="button"
                                                        onClick={() => openEditModal(sup)}
                                                        icon={<IconPencilCog size={16} strokeWidth={1.5} />}
                                                        className="border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => openDeleteModal(sup.id)}
                                                        icon={<IconTrash size={16} strokeWidth={1.5} />}
                                                        className="border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                    />
                                                </div>
                                            </Table.Td>
                                        </tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.Card>
                    </div>
                </>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff size={32} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Data Supplier
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan supplier pertama Anda.
                    </p>
                    <Button
                        type="button"
                        onClick={openCreateModal}
                        icon={<IconCirclePlus size={18} />}
                        className="bg-primary-500 hover:bg-primary-600 text-white"
                        label="Tambah Supplier"
                    />
                </div>
            )}

            <Pagination links={suppliers.links} />

            {/* Modal for Create/Edit */}
            <SimpleModal
                show={isModalOpen}
                onClose={closeModal}
                title={editingSupplier ? "Edit Supplier" : "Tambah Supplier"}
            >
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                            Nama Supplier <span className="text-rose-500">*</span>
                        </label>
                        <input
                            className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Contoh: PT. Maju Jaya"
                            required
                        />
                        {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Telepon
                            </label>
                            <input
                                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={data.phone}
                                onChange={(e) => setData("phone", e.target.value)}
                                placeholder="0812..."
                            />
                            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="email@example.com"
                            />
                            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                            Alamat
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            placeholder="Alamat lengkap..."
                        />
                        {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Informasi Rekening Bank</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                    Nama Bank
                                </label>
                                <input
                                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={data.bank_name}
                                    onChange={(e) => setData("bank_name", e.target.value)}
                                    placeholder="Contoh: BCA"
                                />
                                {errors.bank_name && <p className="text-xs text-rose-500 mt-1">{errors.bank_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                    Nomor Rekening
                                </label>
                                <input
                                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={data.account_number}
                                    onChange={(e) => setData("account_number", e.target.value)}
                                    placeholder="Contoh: 1234567890"
                                />
                                {errors.account_number && <p className="text-xs text-rose-500 mt-1">{errors.account_number}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                    Atas Nama
                                </label>
                                <input
                                    className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={data.account_name}
                                    onChange={(e) => setData("account_name", e.target.value)}
                                    placeholder="Nama pemilik rekening"
                                />
                                {errors.account_name && <p className="text-xs text-rose-500 mt-1">{errors.account_name}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-11 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/20 transition-all disabled:opacity-70"
                        >
                            {processing ? "Menyimpan..." : (editingSupplier ? "Update Supplier" : "Simpan Supplier")}
                        </button>
                    </div>
                </form>
            </SimpleModal>


            {/* Delete Confirmation Modal */}
            <SimpleModal
                show={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="Hapus Supplier"
            >
                <div className="flex flex-col items-center text-center p-2">
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                        <IconAlertTriangle size={36} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Konfirmasi Hapus
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Apakah Anda yakin ingin menghapus supplier ini? Data yang dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            disabled={processing}
                            className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={processing}
                            className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                "Menghapus..."
                            ) : (
                                <>
                                    <IconTrash size={18} />
                                    <span>Hapus</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </SimpleModal>
        </>
    );
}

SuppliersIndex.layout = (page) => <DashboardLayout children={page} />;
