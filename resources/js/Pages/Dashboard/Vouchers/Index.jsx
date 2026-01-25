import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconCirclePlus,
    IconPencilCog,
    IconTrash,
    IconTicket,
    IconDatabaseOff,
    IconAlertTriangle,
} from "@tabler/icons-react";
import Search from "@/Components/Dashboard/Search";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import Modal from "@/Components/Modal";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Index({ vouchers, filters, summary }) {
    const { flash } = usePage().props;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState(null);
    const { delete: destroy, processing: deleting } = useForm();

    React.useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openDeleteModal = (voucher) => {
        setVoucherToDelete(voucher);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setVoucherToDelete(null);
    };

    const handleDelete = () => {
        if (voucherToDelete) {
            destroy(route("vouchers.destroy", voucherToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: () => {
                    closeDeleteModal();
                    toast.error("Gagal menghapus data.");
                },
            });
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            <Head title="Vouchers" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Vouchers
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {vouchers.total} voucher terdaftar
                        </p>
                    </div>
                    <Link href={route("vouchers.create")}>
                        <Button
                            type={"button"}
                            icon={
                                <IconCirclePlus size={18} strokeWidth={1.5} />
                            }
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                            }
                            label={"Buat Voucher"}
                        />
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            {filters?.search == null && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Voucher</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{summary?.total_vouchers || 0}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                            <IconTicket size={24} />
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Voucher Aktif</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{summary?.active_vouchers || 0}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center">
                             <IconTicket size={24} />
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Terpakai</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{summary?.total_used || 0}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                             <IconTicket size={24} />
                        </div>
                    </div>
                     <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Diskon</p>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1">{formatCurrency(summary?.total_discount_given || 0)}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center">
                             <IconTicket size={24} />
                        </div>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="mb-4 w-full sm:w-80">
                <Search
                    url={route("vouchers.index")}
                    placeholder="Cari kode atau nama voucher..."
                />
            </div>

            {/* Content */}
            {vouchers.data.length > 0 ? (
                <Table.Card title={"Data Voucher"}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className="w-10">No</Table.Th>
                                <Table.Th>Kode & Nama</Table.Th>
                                <Table.Th>Tipe & Nominal</Table.Th>
                                <Table.Th>Kuota</Table.Th>
                                <Table.Th>Periode</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th></Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {vouchers.data.map((voucher, i) => (
                                <tr
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    key={voucher.id}
                                >
                                    <Table.Td className="text-center">
                                        {++i +
                                            (vouchers.current_page - 1) *
                                                vouchers.per_page}
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
                                                <IconTicket size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {voucher.code}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {voucher.name}
                                                </p>
                                            </div>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="text-sm">
                                            <span className="capitalize">
                                                {voucher.discount_type}
                                            </span>{" "}
                                            on{" "}
                                            <span className="capitalize text-slate-500">
                                                {voucher.discount_target}
                                            </span>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                {voucher.discount_type ===
                                                "fixed"
                                                    ? formatCurrency(
                                                          voucher.amount,
                                                      )
                                                    : `${parseFloat(voucher.amount)}%`}
                                            </p>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="text-sm">
                                            <p>Used: {voucher.used_count}</p>
                                            <p className="text-slate-500">
                                                Total: {voucher.quota}
                                            </p>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            <p>
                                                {formatDate(voucher.start_date)}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                s/d
                                            </p>
                                            <p>
                                                {formatDate(voucher.end_date)}
                                            </p>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                voucher.is_active
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                            }`}
                                        >
                                            {voucher.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex gap-2">
                                            <Link href={route("vouchers.show", voucher.id)}>
                                                <Button
                                                    type={"button"}
                                                    icon={<IconTicket size={16} />}
                                                    className={
                                                        "border bg-blue-100 border-blue-200 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-400"
                                                    }
                                                />
                                            </Link>
                                            <Link
                                                href={route(
                                                    "vouchers.edit",
                                                    voucher.id,
                                                )}
                                            >
                                                <Button
                                                    type={"button"}
                                                    icon={
                                                        <IconPencilCog
                                                            size={16}
                                                        />
                                                    }
                                                    className={
                                                        "border bg-warning-100 border-warning-200 text-warning-600 hover:bg-warning-200 dark:bg-warning-900/50 dark:border-warning-800 dark:text-warning-400"
                                                    }
                                                />
                                            </Link>
                                            <Button
                                                type={"button"}
                                                icon={<IconTrash size={16} />}
                                                className={
                                                    "border bg-danger-100 border-danger-200 text-danger-600 hover:bg-danger-200 dark:bg-danger-900/50 dark:border-danger-800 dark:text-danger-400"
                                                }
                                                onClick={() =>
                                                    openDeleteModal(voucher)
                                                }
                                            />
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconDatabaseOff
                            size={32}
                            className="text-slate-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Voucher
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Buat voucher pertama Anda untuk mulai promosi.
                    </p>
                    <Link href={route("vouchers.create")}>
                        <Button
                            type={"button"}
                            icon={<IconCirclePlus size={18} />}
                            className={
                                "bg-primary-500 hover:bg-primary-600 text-white"
                            }
                            label={"Buat Voucher"}
                        />
                    </Link>
                </div>
            )}

            {vouchers.last_page !== 1 && <Pagination links={vouchers.links} />}

            {/* Modal for Delete Confirmation */}
            <Modal
                show={isDeleteModalOpen}
                onClose={closeDeleteModal}
                maxWidth="md"
            >
                <div className="flex flex-col items-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                        <IconAlertTriangle size={36} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                        Hapus Voucher?
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                        Anda akan menghapus voucher{" "}
                        <span className="text-slate-800 dark:text-slate-200 font-bold">
                            "{voucherToDelete?.code}"
                        </span>
                        . Data yang dihapus tidak dapat dikembalikan.
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
