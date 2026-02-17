import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, Link, useForm } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconEye,
    IconSearch,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import Modal from "@/Components/Modal";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Index({ posts }) {
    const { flash } = usePage().props;
    
    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    // Separate form for deletion handling
    const { delete: destroy, processing: deleting } = useForm();

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            closeDeleteModal();
        }
        if (flash?.error) {
            toast.error(flash.error);
            closeDeleteModal(); 
        }
    }, [flash]);

    // Delete handlers
    const openDeleteModal = (post) => {
        setPostToDelete(post);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPostToDelete(null);
    };

    const handleDelete = () => {
        if (postToDelete) {
            destroy(route("apps.blog-posts.destroy", postToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: () => {
                    closeDeleteModal();
                    toast.error("Gagal menghapus data.");
                },
                onFinish: () => closeDeleteModal(),
            });
        }
    };

    return (
        <>
            <Head title="Artikel" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Artikel Blog
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {posts.total || posts.data?.length || 0}{" "}
                            artikel diterbitkan
                        </p>
                    </div>
                    <Link href={route('apps.blog-posts.create')}>
                        <Button
                            type={"button"}
                            icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                            }
                            label={"Tulis Artikel Baru"}
                        />
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("apps.blog-posts.index")}
                        placeholder="Cari artikel..."
                    />
                </div>
            </div>

            {/* Content */}
            {posts.data.length > 0 ? (
                <Table.Card title={"Data Artikel"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className="w-10">No</Table.Th>
                                <Table.Th>Judul</Table.Th>
                                <Table.Th>Kategori</Table.Th>
                                <Table.Th>Penulis</Table.Th>
                                <Table.Th>Views</Table.Th>
                                <Table.Th></Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {posts.data.map((post, i) => (
                                <tr
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    key={post.id}
                                >
                                    <Table.Td className="text-center">
                                        {++i +
                                            (posts.current_page - 1) *
                                                posts.per_page}
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                                {post.image ? (
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                                                        <span className="text-xs text-slate-500">No Img</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                                                    {post.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                                                        post.is_active 
                                                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}>
                                                        {post.is_active ? 'Published' : 'Draft'}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(post.created_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <span className="text-sm text-slate-600 dark:text-slate-300">
                                            {post.category?.name || '-'}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                {post.user?.name?.charAt(0) || 'A'}
                                            </div>
                                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                                {post.user?.name || 'Admin'}
                                            </span>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm">
                                            <IconEye size={14} />
                                            <span>{post.views_count}</span>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex gap-2">
                                            <Link href={route('apps.blog-posts.edit', post.id)}>
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
                                                />
                                            </Link>
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
                                                onClick={() => openDeleteModal(post)}
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
                        Belum Ada Artikel
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Mulai menulis artikel pertama Anda.
                    </p>
                    <Link href={route('apps.blog-posts.create')}>
                        <Button
                            type={"button"}
                            icon={<IconCirclePlus size={18} />}
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white"
                            }
                            label={"Tulis Artikel Baru"}
                        />
                    </Link>
                </div>
            )}

            {posts.last_page !== 1 && (
                <Pagination links={posts.links} />
            )}

            {/* Modal for Delete Confirmation */}
            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} maxWidth="md">
                <div className="flex flex-col items-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                        <IconAlertTriangle size={36} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Hapus Artikel?
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                        Anda akan menghapus artikel <span className="text-slate-800 dark:text-slate-200 font-bold">"{postToDelete?.title}"</span>. Data yang dihapus tidak dapat dikembalikan.
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
