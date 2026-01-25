import React, { useState, useEffect } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconLayoutGrid,
    IconList,
    IconTruck,
    IconPhoto,
    IconDeviceFloppy,
    IconAlertTriangle,
    IconCheck,
    IconX,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import Modal from "@/Components/Dashboard/Modal";
import Input from "@/Components/Dashboard/Input";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone";
import toast from "react-hot-toast";

function CourierCard({ courier, onEdit, onDelete, onToggle }) {
    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
            <div className="relative aspect-[3/2] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {courier.image ? (
                    <img
                        src={courier.image}
                        alt={courier.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <IconTruck
                            size={48}
                            className="text-slate-300 dark:text-slate-600"
                            strokeWidth={1}
                        />
                    </div>
                )}

                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                        type="button"
                        onClick={() => onEdit(courier)}
                        className="p-2.5 rounded-xl bg-white text-warning-600 hover:bg-warning-50 shadow-lg transition-colors"
                        icon={<IconPencilCog size={18} />}
                    />
                    <Button
                        type="button"
                        onClick={() => onDelete(courier)}
                        icon={<IconTrash size={18} />}
                        className={
                            "p-2.5 rounded-xl bg-white text-danger-600 hover:bg-danger-50 shadow-lg"
                        }
                    />
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            {courier.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {courier.code}
                            </span>
                        </div>
                    </div>
                    <div>
                         {/* Toggle Switch */}
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={!!courier.is_active}
                                onChange={() => onToggle(courier)}
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Index({ couriers }) {
    const { flash } = usePage().props;
    const [viewMode, setViewMode] = useState("list");
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourier, setEditingCourier] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [courierToDelete, setCourierToDelete] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        code: "",
        name: "",
        image: null,
        is_active: true,
        _method: "POST",
    });

    const { delete: destroy, processing: deleting } = useForm();

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            closeModal();
            closeDeleteModal();
        }
        if (flash?.error) {
            toast.error(flash.error);
            closeDeleteModal(); 
        }
    }, [flash]);

    const handleToggleStatus = (courier) => {
        router.patch(route('shipping-couriers.toggle', courier.id), {}, {
            preserveScroll: true,
            onError: () => {
                toast.error("Gagal mengubah status kurir.");
            }
        });
    };

    const openCreateModal = () => {
        setEditingCourier(null);
        setImagePreview(null);
        setData({
            code: "",
            name: "",
            image: null,
            is_active: true,
            _method: "POST",
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (courier) => {
        setEditingCourier(courier);
        setImagePreview(courier.image);
        setData({
            code: courier.code,
            name: courier.name,
            image: null,
            is_active: Boolean(courier.is_active),
            _method: "PUT",
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourier(null);
        setImagePreview(null);
        reset();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editingCourier
            ? route("shipping-couriers.update", editingCourier.id)
            : route("shipping-couriers.store");
            
        post(url, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {
                toast.error("Gagal menyimpan data.");
            }
        });
    };

    const openDeleteModal = (courier) => {
        setCourierToDelete(courier);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCourierToDelete(null);
    };

    const handleDelete = () => {
        if (courierToDelete) {
            destroy(route("shipping-couriers.destroy", courierToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: () => {
                    closeDeleteModal();
                    toast.error("Gagal menghapus data.");
                },
            });
        }
    };

    return (
        <>
            <Head title="Kurir Pengiriman" />

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Kurir Pengiriman
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {couriers.total || couriers.data?.length || 0}{" "}
                            kurir terdaftar
                        </p>
                    </div>
                    <Button
                        type={"button"}
                        onClick={openCreateModal}
                        icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                        }
                        label={"Tambah Kurir"}
                    />
                </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("shipping-couriers.index")}
                        placeholder="Cari kurir..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "grid"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Grid View"
                    >
                        <IconLayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-colors ${
                            viewMode === "list"
                                ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="List View"
                    >
                        <IconList size={20} />
                    </button>
                </div>
            </div>

            {couriers.data.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6  gap-4">
                        {couriers.data.map((courier) => (
                            <CourierCard
                                key={courier.id}
                                courier={courier}
                                onEdit={openEditModal}
                                onDelete={openDeleteModal}
                                onToggle={handleToggleStatus}
                            />
                        ))}
                    </div>
                ) : (
                    <Table.Card title={"Data Kurir"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className="w-10">No</Table.Th>
                                    <Table.Th>Kurir</Table.Th>
                                    <Table.Th>Kode</Table.Th>
                                    <Table.Th>Status Aktif</Table.Th>
                                    <Table.Th></Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {couriers.data.map((courier, i) => (
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        key={courier.id}
                                    >
                                        <Table.Td className="text-center">
                                            {++i + (couriers.current_page - 1) * couriers.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                    {courier.image ? (
                                                        <img
                                                            src={courier.image}
                                                            alt={courier.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <IconTruck
                                                                size={20}
                                                                className="text-slate-400"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {courier.name}
                                                </p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                {courier.code}
                                            </span>
                                        </Table.Td>
                                        <Table.Td>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    checked={!!courier.is_active}
                                                    onChange={() => handleToggleStatus(courier)}
                                                />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                            </label>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    type={"button"}
                                                    icon={<IconPencilCog size={16} strokeWidth={1.5} />}
                                                    className={
                                                        "border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                    }
                                                    onClick={() => openEditModal(courier)}
                                                />
                                                <Button
                                                    type={"button"}
                                                    icon={<IconTrash size={16} strokeWidth={1.5} />}
                                                    className={
                                                        "border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                    }
                                                    onClick={() => openDeleteModal(courier)}
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
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff size={32} className="text-slate-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Kurir
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan kurir pengiriman pertama Anda.
                    </p>
                    <Button
                        type={"button"}
                        icon={<IconCirclePlus size={18} />}
                        className={"bg-primary-500 hover:bg-primary-600 text-white"}
                        label={"Tambah Kurir"}
                        onClick={openCreateModal}
                    />
                </div>
            )}

            {couriers.last_page !== 1 && (
                <Pagination links={couriers.links} />
            )}

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            {editingCourier ? "Edit Kurir" : "Tambah Kurir Baru"}
                        </h3>
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-5 space-y-3">
                                <ImageUploadZone 
                                    title="Logo Kurir"
                                    icon={IconPhoto}
                                    imagePreview={imagePreview}
                                    onImageChange={handleImageChange}
                                    onImageRemove={() => {
                                        setImagePreview(null);
                                        setData('image', null);
                                    }}
                                    error={errors.image}
                                    className="h-48"
                                />
                            </div>

                            <div className="md:col-span-7 space-y-4">
                                <Input
                                    type="text"
                                    label="Nama Kurir"
                                    placeholder="JNE, J&T, SiCepat..."
                                    errors={errors.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    value={data.name}
                                />
                                
                                <Input
                                    type="text"
                                    label="Kode Kurir (Biteship Code)"
                                    placeholder="jne, jnt, sicepat..."
                                    errors={errors.code}
                                    onChange={(e) => setData("code", e.target.value)}
                                    value={data.code}
                                />

                                <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Status Aktif</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Kurir aktif akan muncul saat checkout
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={data.is_active}
                                            onChange={(e) => setData("is_active", e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 font-semibold text-sm transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <IconDeviceFloppy size={18} />
                            {processing ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} maxWidth="md">
                <div className="flex flex-col items-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                        <IconAlertTriangle size={36} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Hapus Kurir?
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                        Anda akan menghapus kurir <span className="text-slate-800 dark:text-slate-200 font-bold">"{courierToDelete?.name}"</span>.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            disabled={deleting}
                            className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {deleting ? (
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
            </Modal>
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
