import React, { useState, useEffect } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, Link, useForm } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconLayoutGrid,
    IconList,
    IconCategory,
    IconPhoto,
    IconDeviceFloppy,
    IconAlertTriangle,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import Modal from "@/Components/Modal";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone";
import toast from "react-hot-toast";

// Category Card for Grid View
function CategoryCard({ category, onEdit, onDelete }) {
    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
            {/* Category Image */}
            <div className="relative aspect-[3/2] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <IconCategory
                            size={48}
                            className="text-slate-300 dark:text-slate-600"
                            strokeWidth={1}
                        />
                    </div>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="p-2.5 rounded-xl bg-white text-warning-600 hover:bg-warning-50 shadow-lg transition-colors"
                        icon={<IconPencilCog size={18} />}
                    />
                    <Button
                        type="button"
                        onClick={() => onDelete(category)}
                        icon={<IconTrash size={18} />}
                        className={
                            "p-2.5 rounded-xl bg-white text-danger-600 hover:bg-danger-50 shadow-lg"
                        }
                    />
                </div>
            </div>

            {/* Category Info */}
            <div className="p-4">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    {category.name}
                </h3>
                {category.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {category.description}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function Index({ categories }) {
    const { flash } = usePage().props;
    const [viewMode, setViewMode] = useState("grid");
    
    // Create/Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        description: "",
        image: null,
        _method: "POST",
    });

    // Separate form for deletion handling
    const { delete: destroy, processing: deleting } = useForm();

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            closeModal();
            closeDeleteModal();
        }
        if (flash?.error) {
            toast.error(flash.error);
            // If delete failed (e.g. dependency), ensure modal closes or stays based on UX
            // User requested to handle error. Usually better to close modal and show toast if it's a server logic error.
            // But if we want to keep it open to retry? No, dependency error means we can't delete.
            closeDeleteModal(); 
        }
    }, [flash]);

    // Create/Edit handlers
    const openCreateModal = () => {
        setEditingCategory(null);
        setImagePreview(null);
        setData({
            name: "",
            description: "",
            image: null,
            _method: "POST",
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setImagePreview(category.image);
        setData({
            name: category.name,
            description: category.description || "",
            image: null, // Reset image input
            _method: "PUT",
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
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
        const url = editingCategory
            ? route("categories.update", editingCategory.id)
            : route("categories.store");
            
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

    // Delete handlers
    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const handleDelete = () => {
        if (categoryToDelete) {
            destroy(route("categories.destroy", categoryToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: () => {
                    closeDeleteModal();
                    toast.error("Gagal menghapus data.");
                },
                onFinish: () => closeDeleteModal(), // Ensure it closes
            });
        }
    };

    return (
        <>
            <Head title="Kategori" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Kategori
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {categories.total || categories.data?.length || 0}{" "}
                            kategori terdaftar
                        </p>
                    </div>
                    <Button
                        type={"button"}
                        onClick={openCreateModal}
                        icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                        }
                        label={"Tambah Kategori"}
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("categories.index")}
                        placeholder="Cari kategori..."
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

            {/* Content */}
            {categories.data.length > 0 ? (
                viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6  gap-4">
                        {categories.data.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onEdit={openEditModal}
                                onDelete={openDeleteModal}
                            />
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <Table.Card title={"Data Kategori"}>
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className="w-10">No</Table.Th>
                                    <Table.Th>Kategori</Table.Th>
                                    <Table.Th>Deskripsi</Table.Th>
                                    <Table.Th></Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {categories.data.map((category, i) => (
                                    <tr
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        key={category.id}
                                    >
                                        <Table.Td className="text-center">
                                            {++i +
                                                (categories.current_page - 1) *
                                                    categories.per_page}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                    {category.image ? (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <IconCategory
                                                                size={20}
                                                                className="text-slate-400"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {category.name}
                                                </p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {category.description || "-"}
                                            </p>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex gap-2">
                                                <Button
                                                    type={"button"}
                                                    icon={
                                                        <IconPencilCog
                                                            size={16}
                                                            strokeWidth={1.5}
                                                        />
                                                    }
                                                    className={
                                                        "border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                    }
                                                    onClick={() => openEditModal(category)}
                                                />
                                                <Button
                                                    type={"button"}
                                                    icon={
                                                        <IconTrash
                                                            size={16}
                                                            strokeWidth={1.5}
                                                        />
                                                    }
                                                    className={
                                                        "border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                    }
                                                    onClick={() => openDeleteModal(category)}
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
                        Belum Ada Kategori
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan kategori pertama Anda.
                    </p>
                    <Button
                        type={"button"}
                        icon={<IconCirclePlus size={18} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white"
                        }
                        label={"Tambah Kategori"}
                        onClick={openCreateModal}
                    />
                </div>
            )}

            {categories.last_page !== 1 && (
                <Pagination links={categories.links} />
            )}

            {/* Modal for Create/Edit */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                        </h3>
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Image Upload - Left Side / Top on Mobile */}
                            <div className="md:col-span-5 space-y-3">
                                <ImageUploadZone 
                                    title="Gambar Kategori"
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
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                    <p className="text-[10px] text-blue-600 dark:text-blue-300 leading-relaxed text-center font-medium">
                                        Gunakan rasio 1:1 atau 3:2 untuk tampilan terbaik.
                                    </p>
                                </div>
                            </div>

                            {/* Form Fields - Right Side */}
                            <div className="md:col-span-7 space-y-4">
                                <Input
                                    type="text"
                                    label="Nama Kategori"
                                    placeholder="Misal: Makanan, Minuman..."
                                    errors={errors.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    value={data.name}
                                />
                                
                                <Textarea
                                    label="Deskripsi"
                                    placeholder="Penjelasan singkat..."
                                    errors={errors.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    value={data.description}
                                    rows={4}
                                />
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

            {/* Modal for Delete Confirmation */}
            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} maxWidth="md">
                <div className="flex flex-col items-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                        <IconAlertTriangle size={36} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Hapus Kategori?
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                        Anda akan menghapus kategori <span className="text-slate-800 dark:text-slate-200 font-bold">"{categoryToDelete?.name}"</span>. Data yang dihapus tidak dapat dikembalikan.
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
