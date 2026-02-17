import React, { useState, useEffect } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, useForm } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconList,
    IconTags,
    IconDeviceFloppy,
    IconAlertTriangle,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import Modal from "@/Components/Modal";
import Input from "@/Components/Dashboard/Input";
import toast from "react-hot-toast";

export default function Index({ tags }) {
    const { flash } = usePage().props;
    
    // Create/Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
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
            closeDeleteModal(); 
        }
    }, [flash]);

    // Create/Edit handlers
    const openCreateModal = () => {
        setEditingTag(null);
        setData({
            name: "",
            _method: "POST",
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (tag) => {
        setEditingTag(tag);
        setData({
            name: tag.name,
            _method: "PUT",
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTag(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editingTag
            ? route("apps.blog-tags.update", editingTag.id)
            : route("apps.blog-tags.store");
            
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
    const openDeleteModal = (tag) => {
        setTagToDelete(tag);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTagToDelete(null);
    };

    const handleDelete = () => {
        if (tagToDelete) {
            destroy(route("apps.blog-tags.destroy", tagToDelete.id), {
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
            <Head title="Tags" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Tags
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {tags.total || tags.data?.length || 0}{" "}
                            tag terdaftar
                        </p>
                    </div>
                    <Button
                        type={"button"}
                        onClick={openCreateModal}
                        icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                        }
                        label={"Tambah Tag"}
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("apps.blog-tags.index")}
                        placeholder="Cari tag..."
                    />
                </div>
            </div>

            {/* Content */}
            {tags.data.length > 0 ? (
                /* List View */
                <Table.Card title={"Data Tags"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className="w-10">No</Table.Th>
                                <Table.Th>Tag</Table.Th>
                                <Table.Th>Slug</Table.Th>
                                <Table.Th></Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {tags.data.map((tag, i) => (
                                <tr
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    key={tag.id}
                                >
                                    <Table.Td className="text-center">
                                        {++i +
                                            (tags.current_page - 1) *
                                                tags.per_page}
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                <IconTags
                                                    size={18}
                                                    className="text-slate-500"
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {tag.name}
                                            </p>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                                            {tag.slug}
                                        </code>
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
                                                onClick={() => openEditModal(tag)}
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
                                                onClick={() => openDeleteModal(tag)}
                                            />
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
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
                        Belum Ada Tag
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan tag pertama Anda.
                    </p>
                    <Button
                        type={"button"}
                        icon={<IconCirclePlus size={18} />}
                        className={
                            "bg-primary-500 hover:bg-primary-600 text-white"
                        }
                        label={"Tambah Tag"}
                        onClick={openCreateModal}
                    />
                </div>
            )}

            {tags.last_page !== 1 && (
                <Pagination links={tags.links} />
            )}

            {/* Modal for Create/Edit */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            {editingTag ? "Edit Tag" : "Tambah Tag Baru"}
                        </h3>
                    </div>
                    
                    <div className="p-6 overflow-y-auto">
                        <Input
                            type="text"
                            label="Nama Tag"
                            placeholder="Misal: Info, Promo..."
                            errors={errors.name}
                            onChange={(e) => setData("name", e.target.value)}
                            value={data.name}
                            autoFocus
                        />
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
                        Hapus Tag?
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                        Anda akan menghapus tag <span className="text-slate-800 dark:text-slate-200 font-bold">"{tagToDelete?.name}"</span>. Data yang dihapus tidak dapat dikembalikan.
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
