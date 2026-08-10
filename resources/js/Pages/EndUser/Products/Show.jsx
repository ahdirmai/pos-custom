import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import CarCard from "@/Components/CarLanding/CarCard";
import toast from "react-hot-toast";
import {
    IconBrandWhatsapp,
    IconShoppingCart,
    IconBolt,
    IconUsers,
    IconRoute,
    IconChevronLeft,
    IconChevronRight,
    IconStar,
    IconShieldCheck,
    IconTruck,
    IconCalendarEvent,
    IconBatteryCharging,
    IconBriefcase,
    IconEngine,
    IconLeaf,
    IconGauge,
    IconDimensions,
    IconSettings,
    IconCheck,
} from "@tabler/icons-react";

const formatRp = (val) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(val ?? 0);

const galleryUrl = (filename) => `/storage/products/${filename}`;

const HIGHLIGHT_ICONS = {
    route: IconRoute,
    users: IconUsers,
    bolt: IconBolt,
    battery: IconBatteryCharging,
    briefcase: IconBriefcase,
    engine: IconEngine,
    leaf: IconLeaf,
    gauge: IconGauge,
};

// ── Map spec groups (from DB keys) → configurator sidebar tabs ──
const SPEC_GROUPS = [
    { key: "performa", label: "Performa", icon: IconGauge },
    { key: "dimensi", label: "Dimensi", icon: IconDimensions },
    { key: "baterai_charging", label: "Baterai & Charging", icon: IconBatteryCharging },
    { key: "fitur", label: "Fitur", icon: IconSettings },
];

const COLORS = [
    { name: "Putih", hex: "#f5f5f0" },
    { name: "Abu-abu", hex: "#9ca3af" },
    { name: "Hitam", hex: "#1f2937" },
    { name: "Biru", hex: "#1d4ed8" },
    { name: "Merah", hex: "#b91c1c" },
];

const TRUST_POINTS = [
    { icon: IconShieldCheck, label: "Garansi Resmi VinFast" },
    { icon: IconTruck, label: "Pengiriman ke Seluruh Indonesia" },
    { icon: IconCalendarEvent, label: "Test Drive & Konsultasi Gratis" },
];

export default function ProductShow({ product, reviews, relatedProducts, vouchers = [] }) {
    const { whatsappNumber } = usePage().props;
    const [quantity, setQuantity] = useState(1);
    const [activeGroup, setActiveGroup] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const car = product.car ?? {};
    const gallery = car.gallery ?? [];
    const highlightSpecs = car.highlight_specs ?? [];
    const specs = car.specs ?? {};
    const isCar = !!product.car;

    const hasStock = product.stock > 0;
    const lowStock = product.stock > 0 && product.stock <= 5;

    // Available spec groups (intersect with data)
    const availableGroups = SPEC_GROUPS.filter(
        (g) => specs[g.key] && Object.keys(specs[g.key]).length > 0,
    );
    const activeGroupKey = activeGroup ?? availableGroups[0]?.key ?? null;
    const activeGroupData = activeGroupKey ? specs[activeGroupKey] : {};

    const handleAddToCart = () => {
        router.post(
            route("user.cart.store"),
            { product_id: product.id, qty: quantity },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`${product.title} ditambahkan ke keranjang`),
                onError: () => toast.error("Gagal menambahkan ke keranjang"),
            },
        );
    };

    const handleBuyNow = () => {
        router.post(
            route("user.cart.store"),
            { product_id: product.id, qty: quantity, is_buy_now: true },
            { onError: () => toast.error("Gagal memproses pesanan") },
        );
    };

    const waMessage = encodeURIComponent(
        car.cta_whatsapp_message ??
            `Halo, saya tertarik dengan ${product.title}, mohon info lebih lanjut.`,
    );
    const waUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${waMessage}`
        : "#";

    const allImages = [product.image, ...gallery.map((g) => galleryUrl(g))].filter(Boolean);
    const activeImg = allImages[activeImage] || "/images/placeholder.png";

    const renderStars = (rating) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <IconStar
                    key={star}
                    size={15}
                    className={`${(rating || 0) >= star ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                />
            ))}
        </div>
    );

    return (
        <UserLayout headerVariant="light" hideMobileNav={true}>
            <Head title={product.title} />

            {/* ── Breadcrumb ── */}
            <div className="bg-white border-b border-gray-100 pt-[68px]">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-2 text-[13px] text-gray-500">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <IconChevronLeft size={15} />
                        Kembali
                    </button>
                    <span className="text-gray-300">/</span>
                    <Link href="/" className="hover:text-gray-900 font-medium">
                        Beranda
                    </Link>
                    <span className="text-gray-300">/</span>
                    <Link href={route("user.products")} className="hover:text-gray-900 font-medium">
                        Katalog
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-semibold truncate max-w-[160px] sm:max-w-xs">
                        {product.category?.name || "Umum"}
                    </span>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                CONFIGURATOR — sidebar + image + key specs
            ═══════════════════════════════════════════ */}
            <div className="bg-white">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* ── Left: vertical feature tabs ── */}
                        {isCar && availableGroups.length > 0 && (
                            <aside className="lg:col-span-2 order-2 lg:order-1">
                                <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                                    {availableGroups.map((g) => {
                                        const Icon = g.icon;
                                        const active = activeGroupKey === g.key;
                                        return (
                                            <button
                                                key={g.key}
                                                onClick={() => setActiveGroup(g.key)}
                                                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[12.5px] font-bold whitespace-nowrap transition-colors ${
                                                    active
                                                        ? "bg-gray-900 text-white"
                                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                }`}
                                            >
                                                <Icon size={16} />
                                                <span className="hidden lg:inline">{g.label}</span>
                                                <span className="lg:hidden">{g.label}</span>
                                            </button>
                                        );
                                    })}
                                </nav>

                                {/* Color picker (desktop) */}
                                <div className="hidden lg:block mt-10">
                                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">
                                        Warna Eksterior
                                    </p>
                                    <div className="flex gap-2.5">
                                        {COLORS.map((c, i) => (
                                            <button
                                                key={c.name}
                                                title={c.name}
                                                onClick={() => setSelectedColor(i)}
                                                className={`w-7 h-7 rounded-full border-2 transition-all ${
                                                    selectedColor === i
                                                        ? "border-gray-900 scale-110"
                                                        : "border-gray-200 hover:border-gray-400"
                                                }`}
                                                style={{ background: c.hex }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-2">
                                        {COLORS[selectedColor].name}
                                    </p>
                                </div>

                                {/* Deskripsi */}
                                <div className="mt-10">
                                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">
                                        Deskripsi
                                    </p>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-500 leading-relaxed text-[13px]"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                product.description ||
                                                "<p>Tidak ada detail deskripsi.</p>",
                                        }}
                                    />
                                </div>
                            </aside>
                        )}

                        {/* ── Center: hero image ── */}
                        <div className="lg:col-span-7 order-1 lg:order-2">
                            <div className="relative aspect-[16/10] bg-[#f7f7f7] rounded-xl overflow-hidden border border-gray-100">
                                <img
                                    src={activeImg}
                                    alt={product.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                {car.is_featured && (
                                    <span className="absolute top-4 right-4 px-2.5 py-1 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded">
                                        Unggulan
                                    </span>
                                )}
                                {!hasStock && (
                                    <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                                        <span className="px-5 py-2 bg-gray-900 text-white text-[13px] font-bold tracking-widest uppercase rounded-lg">
                                            Sold Out
                                        </span>
                                    </div>
                                )}
                                {hasStock && (
                                    <button
                                        onClick={() => setLightboxOpen(true)}
                                        className="absolute bottom-4 right-4 w-10 h-10 bg-white/95 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition-colors shadow-sm"
                                        title="Perbesar"
                                    >
                                        <IconChevronRight size={18} className="rotate-45" />
                                    </button>
                                )}
                            </div>

                            {/* Gallery thumbs */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                                    {allImages.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={`relative w-[88px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden border-2 bg-white transition-colors ${
                                                activeImage === i
                                                    ? "border-gray-900"
                                                    : "border-gray-200 opacity-70 hover:opacity-100"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Right: title + key specs ── */}
                        <div className="lg:col-span-3 order-3">
                            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
                                {product.category?.name || "Kendaraan Listrik"}
                            </p>
                            <h1 className="font-serif text-[26px] md:text-[30px] text-gray-900 leading-tight mb-1">
                                {product.title}
                            </h1>
                            {car.subtitle && (
                                <p className="text-[13px] text-gray-500 mb-4">{car.subtitle}</p>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-6">
                                {renderStars(product.average_rating)}
                                <span className="font-bold text-gray-900">
                                    {product.average_rating
                                        ? Number(product.average_rating).toFixed(1)
                                        : "Baru"}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span>{product.sold_count || 0} terjual</span>
                            </div>

                            {/* Price */}
                            <div className="pb-5 mb-5 border-b border-gray-100">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                                    Harga OTR mulai dari
                                </p>
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">
                                        {formatRp(product.current_price || product.sell_price)}
                                    </span>
                                    {car.price_max && (
                                        <span className="text-[15px] text-gray-400 font-semibold">
                                            – {formatRp(car.price_max)}
                                        </span>
                                    )}
                                </div>
                                {car.price_note && (
                                    <p className="text-[11px] text-gray-400 mt-1.5">
                                        {car.price_note}
                                    </p>
                                )}
                            </div>

                            {/* Active spec group rows */}
                            {activeGroupKey && (
                                <div className="mb-6">
                                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">
                                        {
                                            availableGroups.find((g) => g.key === activeGroupKey)
                                                ?.label
                                        }
                                    </p>
                                    <dl className="divide-y divide-gray-100 border-y border-gray-100">
                                        {Object.entries(activeGroupData)
                                            .slice(0, 4)
                                            .map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="py-2.5 flex items-start justify-between gap-3"
                                                >
                                                    <dt className="text-[12px] text-gray-500 flex-shrink-0">
                                                        {key}
                                                    </dt>
                                                    <dd className="text-[12.5px] font-semibold text-gray-900 text-right">
                                                        {value}
                                                    </dd>
                                                </div>
                                            ))}
                                    </dl>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="flex flex-col gap-2">
                                {hasStock ? (
                                    <>
                                        <button
                                            onClick={handleBuyNow}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-700 text-white font-bold text-[13.5px] rounded-lg transition-colors"
                                        >
                                            <IconShoppingCart size={16} />
                                            Beli Sekarang
                                        </button>
                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-800 hover:bg-gray-50 font-bold text-[13.5px] rounded-lg transition-colors"
                                        >
                                            <IconShoppingCart size={16} />
                                            Tambah ke Keranjang
                                        </button>
                                    </>
                                ) : (
                                    <span className="w-full flex items-center justify-center py-3 bg-gray-100 text-gray-400 font-bold text-[13.5px] rounded-lg">
                                        Unit Habis — Indent Tersedia
                                    </span>
                                )}
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-1.5 py-3 border border-[#25D366]/40 text-[#1da851] hover:bg-[#25D366]/5 font-semibold text-[13px] rounded-lg transition-colors"
                                >
                                    <IconBrandWhatsapp size={15} />
                                    Tanya Sales
                                </a>
                            </div>

                            {/* Color picker (mobile) */}
                            <div className="lg:hidden mt-6">
                                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">
                                    Warna Eksterior
                                </p>
                                <div className="flex gap-2.5">
                                    {COLORS.map((c, i) => (
                                        <button
                                            key={c.name}
                                            title={c.name}
                                            onClick={() => setSelectedColor(i)}
                                            className={`w-7 h-7 rounded-full border-2 transition-all ${
                                                selectedColor === i
                                                    ? "border-gray-900 scale-110"
                                                    : "border-gray-200 hover:border-gray-400"
                                            }`}
                                            style={{ background: c.hex }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                FEATURE HIGHLIGHTS — horizontal strip
            ═══════════════════════════════════════════ */}
            {isCar && highlightSpecs.length > 0 && (
                <div className="bg-[#f7f7f7] border-y border-gray-100">
                    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-5">
                            Feature Highlights
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {highlightSpecs.slice(0, 4).map((s, i) => {
                                const Icon = HIGHLIGHT_ICONS[s.icon] || IconBolt;
                                return (
                                    <div
                                        key={i}
                                        className="bg-white border border-gray-200 rounded-lg px-4 py-5 flex flex-col gap-2.5"
                                    >
                                        <Icon size={22} className="text-gray-800" stroke={1.5} />
                                        <div>
                                            <p className="text-[15px] font-bold text-gray-900 leading-snug">
                                                {s.value}
                                            </p>
                                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                                                {s.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════
                ULASAN
            ═══════════════════════════════════════════ */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
                        Ulasan
                    </p>
                    <h3 className="text-[22px] font-black text-gray-900 tracking-tight mb-8">
                        Ulasan Pelanggan
                    </h3>

                    <div className="max-w-3xl">
                        {product.reviews_count > 0 ? (
                            <>
                                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                                    <div className="text-center sm:border-r sm:border-gray-200 sm:pr-8">
                                        <div className="text-4xl font-black text-gray-900 mb-1">
                                            {Number(product.average_rating).toFixed(1)}
                                            <span className="text-lg text-gray-400 font-medium">
                                                /5
                                            </span>
                                        </div>
                                        <div className="flex justify-center gap-0.5 mb-1">
                                            {renderStars(product.average_rating)}
                                        </div>
                                        <p className="text-[12px] font-semibold text-gray-500">
                                            {product.reviews_count} ulasan
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {reviews?.data?.map((review) => (
                                        <div
                                            key={review.id}
                                            className="pb-6 border-b border-gray-100 last:border-0"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-[13px] font-bold text-white">
                                                        {review.user?.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "?"}
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-gray-900">
                                                            {review.user?.name || "Anonim"}
                                                        </p>
                                                        <p className="text-[12px] text-gray-400">
                                                            {new Date(
                                                                review.created_at,
                                                            ).toLocaleDateString("id-ID", {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {renderStars(review.rating)}
                                            </div>
                                            {review.comment && (
                                                <p className="text-[14px] text-gray-600 leading-relaxed">
                                                    {review.comment}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <IconStar size={40} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-900 font-bold mb-1">Belum Ada Ulasan</p>
                                <p className="text-gray-500 text-[13px]">
                                    Jadilah yang pertama memberikan ulasan untuk kendaraan ini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Trust strip ── */}
            <div className="bg-[#f7f7f7] border-t border-gray-100">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {TRUST_POINTS.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-3">
                            <Icon size={22} className="text-gray-700 flex-shrink-0" stroke={1.5} />
                            <span className="text-[13px] font-semibold text-gray-700">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Related cars ── */}
            {relatedProducts?.length > 0 && (
                <div className="bg-white border-t border-gray-100">
                    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
                                    Lineup Lainnya
                                </p>
                                <h3 className="text-[22px] font-black text-gray-900 tracking-tight">
                                    Jelajahi Model Lain
                                </h3>
                            </div>
                            <Link
                                href={route("user.products")}
                                className="flex items-center gap-1 text-[14px] font-bold text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Lihat Semua
                                <IconChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {relatedProducts.map((item) => (
                                <CarCard
                                    key={item.id}
                                    product={item}
                                    whatsappNumber={whatsappNumber}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Mobile sticky bar ── */}
            {hasStock && (
                <div className="fixed z-[100] bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
                    <div className="px-4 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-black text-gray-900 leading-tight truncate">
                                {formatRp(product.current_price || product.sell_price)}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{product.title}</p>
                        </div>
                        <button
                            onClick={handleBuyNow}
                            className="px-5 py-3 bg-gray-900 hover:bg-gray-700 text-white font-bold text-[13px] rounded-lg transition-colors whitespace-nowrap"
                        >
                            Beli Sekarang
                        </button>
                    </div>
                </div>
            )}

            {/* ── Lightbox ── */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xl transition-colors"
                    >
                        ×
                    </button>
                    <img
                        src={activeImg}
                        alt={product.title}
                        className="max-h-[85vh] max-w-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImage((i) => (i > 0 ? i - 1 : allImages.length - 1));
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                            >
                                <IconChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveImage((i) => (i < allImages.length - 1 ? i + 1 : 0));
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                            >
                                <IconChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Spacer for mobile sticky bar */}
            {hasStock && <div className="h-[76px] md:hidden" />}
        </UserLayout>
    );
}
