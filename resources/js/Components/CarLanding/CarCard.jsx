import React from "react";
import { Link } from "@inertiajs/react";
import { IconBrandWhatsapp, IconChevronRight } from "@tabler/icons-react";

const formatRp = (val) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(val ?? 0);

export default function CarCard({ product, whatsappNumber }) {
    const car = product?.car ?? {};
    const priceMin = product?.current_price ?? product?.sell_price ?? 0;
    const hasStock = (product?.stock ?? 0) > 0;

    const waUrl =
        car.cta_whatsapp_message && whatsappNumber
            ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(car.cta_whatsapp_message)}`
            : null;

    // First 3 highlight_specs for the inline specs row
    const specs = (car.highlight_specs ?? []).slice(0, 3);

    return (
        <article className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-md transition-shadow duration-200">
            {/* ── Car image ── */}
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                    src={product?.image || "/images/placeholder.png"}
                    alt={product?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                />

                {/* Category label */}
                {product?.category?.name && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-[10px] font-semibold uppercase tracking-wide rounded">
                        {product.category.name}
                    </span>
                )}

                {/* Featured badge */}
                {car.is_featured && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide rounded">
                        Unggulan
                    </span>
                )}

                {/* Sold-out overlay */}
                {!hasStock && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="px-3 py-1 bg-gray-800 text-white text-[11px] font-bold uppercase tracking-widest rounded">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            {/* ── Content area ── */}
            <div className="p-4">
                {/* Title */}
                <Link href={route("user.product.show", product?.slug || product?.id)}>
                    <h3 className="font-bold text-gray-900 text-[15px] leading-snug hover:underline truncate">
                        {product?.title}
                    </h3>
                </Link>

                {/* Subtitle */}
                {car.subtitle && (
                    <p className="text-gray-400 text-[12px] mt-0.5 truncate">{car.subtitle}</p>
                )}

                {/* Specs inline row */}
                {specs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pb-3 border-b border-gray-100">
                        {specs.map((s, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-1 text-[12px] text-gray-500"
                            >
                                <span className="font-semibold text-gray-700">{s.value}</span>
                                <span>{s.label}</span>
                            </span>
                        ))}
                    </div>
                )}

                {/* Price */}
                <div className="mt-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
                        Mulai dari
                    </p>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-[16px] font-black text-gray-900">
                            {formatRp(priceMin)}
                        </span>
                        {car.price_max && (
                            <span className="text-gray-400 text-[13px]">
                                – {formatRp(car.price_max)}
                            </span>
                        )}
                    </div>
                    {car.price_note && (
                        <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-1">
                            {car.price_note}
                        </p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex gap-2">
                    <Link
                        href={route("user.product.show", product?.slug || product?.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-[13px] font-semibold rounded-lg transition-colors"
                    >
                        Lihat Detail
                        <IconChevronRight size={14} />
                    </Link>
                    {waUrl && (
                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[13px] font-semibold rounded-lg transition-colors"
                        >
                            <IconBrandWhatsapp size={15} className="text-[#25D366]" />
                            Tanya
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
