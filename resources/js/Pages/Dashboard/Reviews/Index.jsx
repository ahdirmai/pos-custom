import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    IconStar,
    IconStarFilled,
    IconEye,
    IconEyeOff,
    IconTrash,
    IconMessageCircle,
    IconArrowLeft,
} from "@tabler/icons-react";
import Pagination from "@/Components/Dashboard/Pagination";
import { getProductImageUrl } from "@/Utils/imageUrl";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

function Stars({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {rating >= star ? (
                        <IconStarFilled size={14} className="text-yellow-400" />
                    ) : (
                        <IconStar size={14} className="text-gray-300" />
                    )}
                </span>
            ))}
        </div>
    );
}

export default function Index({ product, reviews }) {
    const handleToggle = (reviewId) => {
        router.patch(route("reviews.toggle", reviewId), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (reviewId) => {
        if (confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
            router.delete(route("reviews.destroy", reviewId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title={`Ulasan - ${product.title}`} />

            {/* Header */}
            <div className="mb-6">
                <Link
                    href={route("products.index")}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 mb-3 transition-colors"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Produk
                </Link>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                        {product.image ? (
                            <img
                                src={getProductImageUrl(product.image)}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <IconMessageCircle size={20} className="text-slate-400" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Ulasan — {product.title}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {reviews.total} ulasan • {product.category?.name || "Tanpa Kategori"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {reviews.data.length > 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {reviews.data.map((review) => (
                            <div
                                key={review.id}
                                className={`p-4 flex flex-col sm:flex-row gap-4 transition-colors ${review.is_hidden
                                        ? "bg-slate-50 dark:bg-slate-800/30 opacity-60"
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800/20"
                                    }`}
                            >
                                {/* Review Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
                                            {review.user?.name?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {review.user?.name || "Anonim"}
                                        </span>
                                        <Stars rating={review.rating} />
                                        <span className="text-xs text-slate-400">
                                            {formatDate(review.created_at)}
                                        </span>
                                        {review.is_hidden && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md uppercase">
                                                Tersembunyi
                                            </span>
                                        )}
                                    </div>

                                    {review.comment ? (
                                        <p className="text-sm text-slate-600 dark:text-slate-300 ml-10">
                                            {review.comment}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic ml-10">
                                            Tidak ada komentar
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleToggle(review.id)}
                                        className={`p-2 rounded-lg border transition-colors ${review.is_hidden
                                                ? "border-success-200 bg-success-50 text-success-600 hover:bg-success-100 dark:border-success-800 dark:bg-success-900/30 dark:text-success-400"
                                                : "border-warning-200 bg-warning-50 text-warning-600 hover:bg-warning-100 dark:border-warning-800 dark:bg-warning-900/30 dark:text-warning-400"
                                            }`}
                                        title={review.is_hidden ? "Tampilkan" : "Sembunyikan"}
                                    >
                                        {review.is_hidden ? (
                                            <IconEye size={16} />
                                        ) : (
                                            <IconEyeOff size={16} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-2 rounded-lg border border-danger-200 bg-danger-50 text-danger-600 hover:bg-danger-100 dark:border-danger-800 dark:bg-danger-900/30 dark:text-danger-400 transition-colors"
                                        title="Hapus"
                                    >
                                        <IconTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconMessageCircle
                            size={32}
                            className="text-slate-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Ulasan
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Produk ini belum memiliki ulasan dari pelanggan.
                    </p>
                </div>
            )}

            {reviews.last_page !== 1 && <Pagination links={reviews.links} />}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
