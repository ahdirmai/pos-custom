import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconSearch,
    IconPencilCog,
    IconTrash,
    IconPhoto,
    IconDatabaseOff,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Index({ banners }) {
    
    // Method deleteBanner
    const deleteBanner = (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('banners.destroy', id), {
                    onSuccess: () => {
                        toast.success("Banner berhasil dihapus.");
                    },
                    onError: () => {
                        toast.error("Gagal menghapus banner.");
                    }
                });
            }
        })
    }

    return (
        <>
            <Head title="Banner" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Banner
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {banners.total || banners.data?.length || 0}{" "}
                            banner terdaftar
                        </p>
                    </div>
                    <Link href={route('banners.create')}>
                        <Button
                            type={"button"}
                            icon={<IconCirclePlus size={18} strokeWidth={1.5} />}
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                            }
                            label={"Tambah Banner"}
                        />
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("banners.index")}
                        placeholder="Cari banner..."
                    />
                </div>
            </div>

            {/* Content */}
            {banners.data.length > 0 ? (
                /* List View */
                <Table.Card title={"Data Banner"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className="w-10">No</Table.Th>
                                <Table.Th>Banner</Table.Th>
                                <Table.Th>Judul</Table.Th>
                                <Table.Th>Tipe</Table.Th>
                                <Table.Th>Urutan</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th></Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {banners.data.map((banner, i) => (
                                <tr
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    key={banner.id}
                                >
                                    <Table.Td className="text-center">
                                        {++i + (banners.current_page - 1) * banners.per_page}
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="w-32 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{banner.title || '-'}</div>
                                        <div className="text-gray-500 text-xs line-clamp-1">{banner.subtitle || '-'}</div>
                                    </Table.Td>
                                    <Table.Td>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${banner.type === 'hero' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-pink-50 text-pink-700 border-pink-100'}`}>
                                            {banner.type === 'hero' ? 'Hero Banner' : 'Promo Banner'}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        {banner.order}
                                    </Table.Td>
                                    <Table.Td>
                                        <span className={`inline-flex h-2.5 w-2.5 rounded-full ${banner.is_active ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                                        <span className={banner.is_active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                            {banner.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex gap-2">
                                            <Link href={route('banners.edit', banner.id)}>
                                                <Button
                                                    type={"button"}
                                                    icon={<IconPencilCog size={16} strokeWidth={1.5} />}
                                                    className={
                                                        "border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                    }
                                                />
                                            </Link>
                                            <Button
                                                type={"button"}
                                                icon={<IconTrash size={16} strokeWidth={1.5} />}
                                                className={
                                                    "border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                }
                                                onClick={() => deleteBanner(banner.id)}
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
                        Belum Ada Banner
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tambahkan banner pertama Anda.
                    </p>
                    <Link href={route('banners.create')}>
                         <Button
                            type={"button"}
                            icon={<IconCirclePlus size={18} />}
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white"
                            }
                            label={"Tambah Banner"}
                        />
                    </Link>
                </div>
            )}

            {banners.last_page !== 1 && (
                <Pagination links={banners.links} />
            )}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
