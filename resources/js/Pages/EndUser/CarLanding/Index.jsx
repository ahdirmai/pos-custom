import React, { useState, useRef, useCallback, forwardRef } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import CarCard from "@/Components/CarLanding/CarCard";
import SpecBadge from "@/Components/CarLanding/SpecBadge";
import SpecTabs from "@/Components/CarLanding/SpecTabs";
import CreditSimulator from "@/Components/CarLanding/CreditSimulator";
import PurchaseSchemeToggle from "@/Components/CarLanding/PurchaseSchemeToggle";
import FaqAccordion from "@/Components/CarLanding/FaqAccordion";
import LeadForm from "@/Components/CarLanding/LeadForm";
import StickyWhatsAppButton from "@/Components/CarLanding/StickyWhatsAppButton";
import toast from "react-hot-toast";
import {
    IconShoppingCart,
    IconCalendarEvent,
    IconBrandWhatsapp,
    IconChevronRight,
    IconChevronLeft,
    IconShieldCheck,
    IconBolt,
    IconLeaf,
    IconBuildingStore,
    IconQuote,
    IconZoomIn,
} from "@tabler/icons-react";

// ─── helpers ──────────────────────────────────────────────────────────────────

const formatRp = (val) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(val ?? 0);

const galleryUrl = (filename) => `/storage/products/${filename}`;

// ─── Section wrapper (dark | light) ───────────────────────────────────────────

const Section = forwardRef(function Section(
    { id, dark = false, tight = false, className = "", children },
    ref,
) {
    return (
        <section
            ref={ref}
            id={id}
            className={`w-full relative scroll-mt-[68px] ${tight ? "py-10 md:py-14" : "py-16 md:py-24"} ${
                dark ? "bg-[#0a0d0c] text-white" : "bg-white text-gray-900"
            } ${className}`}
        >
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">{children}</div>
        </section>
    );
});

function SectionHeading({ eyebrow, title, subtitle, dark = false, align = "center" }) {
    const alignClass = align === "left" ? "text-left mx-0" : "text-center mx-auto";
    return (
        <div className={`mb-12 max-w-2xl ${alignClass}`}>
            {eyebrow && (
                <p
                    className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-3 ${
                        dark ? "text-white/40" : "text-gray-400"
                    }`}
                >
                    {eyebrow}
                </p>
            )}
            <h2
                className={`text-[1.9rem] md:text-[2.6rem] font-black tracking-tight leading-[1.08] ${
                    dark ? "text-white" : "text-gray-900"
                }`}
            >
                {title}
            </h2>
            {subtitle && (
                <p
                    className={`mt-4 text-[15px] md:text-[16px] leading-relaxed ${dark ? "text-white/50" : "text-gray-500"}`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}

function DividerFade({ dark = false }) {
    return (
        <div
            className={`h-px w-full ${
                dark
                    ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
            }`}
        />
    );
}

// ─── Testimonial data (static) ────────────────────────────────────────────────

const TESTIMONIALS = [
    {
        name: "Budi Santoso",
        role: "Pemilik Armada Rental · Jakarta",
        quote: "Sudah 8 bulan pakai VinFast Limo Green untuk armada airport transfer. Biaya operasional turun 60% dibanding MPV bensin. Penumpang juga senang karena kabin luas dan senyap.",
        avatar: "B",
    },
    {
        name: "Hendra Wijaya",
        role: "Hotel Shuttle Manager · Bali",
        quote: 'Kami ganti 5 unit Avanza dengan 5 unit Limo Green. Fast charging 30 menit sudah cukup untuk rotasi antar flight. Tamu terkesan dengan kenyamanan dan kesan "eco-luxury"-nya.',
        avatar: "H",
    },
    {
        name: "Rina Kusuma",
        role: "Pengemudi Taksi Online · Surabaya",
        quote: "Kredit lebih ringan dari yang saya kira. Penghasilan naik karena rating dari penumpang meningkat, dan isi listrik sehari tidak sampai Rp 25 ribu untuk 300-an km.",
        avatar: "R",
    },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Index({
    heroProduct = null,
    catalog = [],
    productCategories = [],
    whatsappNumber = "",
}) {
    const { auth } = usePage().props;
    const leadFormRef = useRef(null);
    const creditRef = useRef(null);

    const car = heroProduct?.car ?? {};
    const heroPrice = heroProduct?.current_price ?? heroProduct?.sell_price ?? 0;
    const heroStock = heroProduct?.stock ?? 0;

    const [activeCategory, setActiveCategory] = useState(null);
    const filteredCatalog = activeCategory
        ? catalog.filter((p) => p.category?.name === activeCategory)
        : catalog;

    const scrollToLeadForm = () =>
        leadFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const scrollToCredit = () =>
        creditRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const handleAddToCart = useCallback(() => {
        if (!auth?.user) {
            toast.error("Silakan login untuk belanja");
            router.visit(route("login"));
            return;
        }
        if (!heroProduct) return;
        router.post(
            route("user.cart.store"),
            { product_id: heroProduct.id, qty: 1 },
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(`${heroProduct.title} ditambahkan ke keranjang`, {
                        duration: 2000,
                        icon: "🛒",
                    }),
                onError: () => toast.error("Gagal menambahkan ke keranjang"),
            },
        );
    }, [auth, heroProduct]);

    const handleBuyNow = useCallback(() => {
        if (!auth?.user) {
            toast.error("Silakan login untuk melanjutkan pembelian");
            router.visit(route("login"));
            return;
        }
        if (!heroProduct) return;
        router.post(
            route("user.cart.store"),
            { product_id: heroProduct.id, qty: 1 },
            {
                preserveScroll: true,
                onSuccess: () => router.visit(route("user.checkout")),
                onError: () => toast.error("Gagal, coba lagi"),
            },
        );
    }, [auth, heroProduct]);

    const waHeroUrl = `https://wa.me/${whatsappNumber?.replace(/\D/g, "")}?text=${encodeURIComponent(
        car.cta_whatsapp_message ??
            "Halo, saya tertarik dengan VinFast Limo Green, mohon info lebih lanjut.",
    )}`;

    // Gallery lightbox
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const gallery = car.gallery ?? [];
    const openLightbox = (i) => setLightboxIndex(i);
    const closeLightbox = () => setLightboxIndex(null);
    const prevPhoto = () => setLightboxIndex((i) => (i > 0 ? i - 1 : gallery.length - 1));
    const nextPhoto = () => setLightboxIndex((i) => (i < gallery.length - 1 ? i + 1 : 0));

    return (
        <UserLayout headerVariant="showroom" hideMobileNav footerProps={{ whatsappNumber }}>
            <Head
                title={
                    heroProduct
                        ? `${heroProduct.title} — Showroom Digital`
                        : "Showroom Digital VinFast"
                }
            />

            {/* ═══════════════════════════════════════════════
                §1  HERO — cinematic split layout
            ═══════════════════════════════════════════════ */}
            {/* Fixed nav takes 68px — hero is full-bleed beneath it */}
            <section
                id="hero"
                className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#07090a]"
            >
                {/* Background image — full bleed, right-weighted */}
                {heroProduct?.image && (
                    <>
                        <img
                            src={heroProduct.image}
                            alt={heroProduct.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#07090a] via-[#07090a]/85 to-[#07090a]/10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090a] via-transparent to-[#07090a]/40" />
                    </>
                )}

                <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 pt-[120px] pb-24 w-full">
                    <div className="max-w-2xl">
                        {/* Eyebrow */}
                        <div className="mb-5">
                            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
                                Electric MPV · 7-Seater
                            </p>
                        </div>

                        {/* Title */}
                        <h1 className="text-[3rem] sm:text-[4rem] md:text-[4.75rem] font-black text-white leading-[0.98] tracking-tight mb-4">
                            {heroProduct?.title ?? "VinFast Limo Green"}
                        </h1>

                        {/* Subtitle */}
                        {car.subtitle && (
                            <p className="text-[17px] sm:text-[19px] text-white/60 mb-8 leading-relaxed font-light max-w-lg">
                                {car.subtitle}
                            </p>
                        )}

                        {/* Price */}
                        <div className="mb-10">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                                Mulai Dari
                            </p>
                            <p className="text-[2rem] font-black text-white tracking-tight leading-none">
                                {formatRp(heroPrice)}
                                {car.price_max && (
                                    <span className="text-[15px] text-white/40 font-semibold ml-2">
                                        – {formatRp(car.price_max)}
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-3">
                            {heroStock > 0 ? (
                                <>
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex items-center gap-2 px-7 py-4 rounded-lg bg-white text-gray-900 hover:bg-gray-100 font-bold text-[14px] transition-colors"
                                    >
                                        Beli Sekarang
                                        <IconChevronRight size={16} />
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex items-center gap-2 px-7 py-4 rounded-lg border border-white/25 text-white hover:bg-white/10 font-bold text-[14px] transition-colors"
                                    >
                                        <IconShoppingCart size={17} />
                                        Tambah ke Keranjang
                                    </button>
                                </>
                            ) : (
                                <span className="inline-flex items-center px-6 py-4 rounded-lg border border-white/10 text-white/40 font-bold text-[14px]">
                                    Unit Habis — Indent Tersedia
                                </span>
                            )}
                            <button
                                onClick={scrollToLeadForm}
                                className="flex items-center gap-2 px-7 py-4 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/35 font-semibold text-[14px] transition-colors"
                            >
                                <IconCalendarEvent size={17} />
                                Booking Test Drive
                            </button>
                            <a
                                href={waHeroUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-4 text-white/60 hover:text-white font-semibold text-[14px] transition-colors"
                            >
                                <IconBrandWhatsapp size={17} />
                                Chat Sales
                            </a>
                        </div>

                        {/* Trust strip */}
                        <div className="flex flex-wrap items-center gap-6 mt-12 pt-6 border-t border-white/10">
                            {[
                                { icon: IconShieldCheck, label: "Garansi Resmi" },
                                { icon: IconBolt, label: "Fast Charging 30 Menit" },
                                { icon: IconLeaf, label: "Zero Emisi" },
                            ].map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2 text-[12px] text-white/40 font-medium"
                                >
                                    <Icon size={15} className="text-white/30" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll cue */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
                    <span className="text-[10px] text-white uppercase tracking-[0.2em]">
                        Scroll
                    </span>
                    <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                §2  HIGHLIGHT SPESIFIKASI — dark
            ═══════════════════════════════════════════════ */}
            {car.highlight_specs?.length > 0 && (
                <Section id="highlight-specs" dark>
                    <SectionHeading
                        dark
                        eyebrow="Keunggulan Utama"
                        title="Direkayasa untuk Yang Terbaik"
                        subtitle="Dirancang untuk keluarga modern dan armada bisnis yang menginginkan efisiensi tanpa mengorbankan kenyamanan."
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {car.highlight_specs.map((spec, i) => (
                            <SpecBadge
                                key={i}
                                dark
                                icon={spec.icon}
                                label={spec.label}
                                value={spec.value}
                            />
                        ))}
                    </div>
                </Section>
            )}

            {/* ═══════════════════════════════════════════════
                §3  GALERI FOTO — full black cinematic
            ═══════════════════════════════════════════════ */}
            {gallery.length > 0 && (
                <Section id="gallery" dark className="bg-black">
                    <SectionHeading
                        dark
                        eyebrow="Galeri"
                        title="Setiap Detail, Diperhatikan"
                        subtitle="Eksterior dan interior yang dirancang untuk kenyamanan penumpang kelas premium."
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {gallery.map((filename, i) => (
                            <button
                                key={i}
                                onClick={() => openLightbox(i)}
                                className={`relative overflow-hidden rounded-lg bg-gray-100 group focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                    i === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
                                }`}
                            >
                                <img
                                    src={galleryUrl(filename)}
                                    alt={`${heroProduct?.title ?? "Limo Green"} foto ${i + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = heroProduct?.image ?? "";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                    <IconZoomIn
                                        size={28}
                                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Lightbox */}
                    {lightboxIndex !== null && (
                        <div
                            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                            onClick={closeLightbox}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevPhoto();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                            >
                                <IconChevronLeft size={20} />
                            </button>
                            <img
                                src={galleryUrl(gallery[lightboxIndex])}
                                alt="Galeri"
                                className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                                onError={(e) => {
                                    e.target.src = heroProduct?.image ?? "";
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextPhoto();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                            >
                                <IconChevronRight size={20} />
                            </button>
                            <button
                                onClick={closeLightbox}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white text-xl leading-none transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </Section>
            )}

            {/* ═══════════════════════════════════════════════
                §4  SPESIFIKASI LENGKAP — white, editorial
            ═══════════════════════════════════════════════ */}
            {car.specs && Object.keys(car.specs).length > 0 && (
                <Section id="specs">
                    <SectionHeading
                        eyebrow="Spesifikasi Teknis"
                        title="Detail Rekayasa"
                        subtitle="Semua data teknis yang Anda butuhkan sebelum memutuskan pembelian."
                    />
                    <SpecTabs specs={car.specs} />
                </Section>
            )}

            {/* ═══════════════════════════════════════════════
                §5  KALKULATOR KREDIT — dark, floating white card
            ═══════════════════════════════════════════════ */}
            <Section id="credit-simulator" ref={creditRef} dark className="bg-[#0a0d0c]">
                <SectionHeading
                    dark
                    eyebrow="Simulasi Kredit"
                    title="Rencanakan Kepemilikan Anda"
                    subtitle="Sesuaikan DP dan tenor sesuai kemampuan. Angka di bawah bersifat estimasi."
                />
                <div className="max-w-2xl mx-auto">
                    <CreditSimulator basePrice={heroPrice} onBuyNow={handleBuyNow} />
                </div>
            </Section>

            {/* ═══════════════════════════════════════════════
                §6  SKEMA PEMBELIAN — white
            ═══════════════════════════════════════════════ */}
            <Section id="purchase-scheme">
                <SectionHeading
                    eyebrow="Skema Pembelian"
                    title="Termasuk Baterai atau Subscription?"
                    subtitle="Pilih skema yang paling sesuai dengan kebutuhan dan model bisnis Anda."
                />
                <div className="max-w-2xl mx-auto">
                    <PurchaseSchemeToggle />
                </div>
            </Section>

            {/* ═══════════════════════════════════════════════
                §7  KATALOG MOBIL LAIN — dark showroom grid
            ═══════════════════════════════════════════════ */}
            {catalog.length > 0 && (
                <Section id="catalog" className="bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                        <SectionHeading
                            align="left"
                            eyebrow="Lineup VinFast"
                            title="Jelajahi Koleksi Lengkap"
                            subtitle="Dari city car lincah hingga SUV bertenaga — temukan model yang tepat untuk Anda."
                        />
                    </div>

                    {/* Category filter tabs */}
                    {productCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`px-4 py-2 rounded-md text-[13px] font-semibold transition-colors ${
                                    activeCategory === null
                                        ? "bg-gray-900 text-white"
                                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                                }`}
                            >
                                Semua Model
                            </button>
                            {productCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`px-4 py-2 rounded-md text-[13px] font-semibold transition-colors ${
                                        activeCategory === cat.name
                                            ? "bg-gray-900 text-white"
                                            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredCatalog.map((product) => (
                            <CarCard
                                key={product.id}
                                product={product}
                                whatsappNumber={whatsappNumber}
                            />
                        ))}
                    </div>

                    {filteredCatalog.length === 0 && (
                        <p className="text-center text-gray-400 py-16 text-[14px]">
                            Tidak ada model di kategori ini.
                        </p>
                    )}

                    <div className="mt-12 flex justify-center">
                        <Link
                            href={route("user.products")}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 font-semibold text-[14px] transition-colors"
                        >
                            <IconBuildingStore size={18} />
                            Lihat Semua Produk di Katalog
                            <IconChevronRight size={16} />
                        </Link>
                    </div>
                </Section>
            )}

            {/* ═══════════════════════════════════════════════
                §8  TESTIMONI — white editorial
            ═══════════════════════════════════════════════ */}
            <Section id="testimonials">
                <SectionHeading
                    eyebrow="Testimonial"
                    title="Dipercaya Pebisnis & Keluarga"
                    subtitle="Ribuan pengguna VinFast di Indonesia sudah merasakan manfaatnya."
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
                        >
                            <IconQuote size={24} className="text-gray-200" />
                            <p className="text-[14px] text-gray-600 leading-relaxed flex-1">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="w-9 h-9 rounded-full bg-gray-800 text-white font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-gray-900">{t.name}</p>
                                    <p className="text-[11px] text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ═══════════════════════════════════════════════
                §9  FAQ — light gray, split layout
            ═══════════════════════════════════════════════ */}
            <Section id="faq" className="bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Left: heading + CTA */}
                    <div className="lg:col-span-2">
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
                            FAQ
                        </p>
                        <h2 className="text-[1.7rem] font-black text-gray-900 tracking-tight leading-tight mb-4">
                            Pertanyaan yang Sering Ditanya
                        </h2>
                        <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
                            Tidak menemukan jawaban? Chat langsung dengan tim kami.
                        </p>
                        <a
                            href={`https://wa.me/${whatsappNumber?.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 font-semibold text-[13px] transition-colors"
                        >
                            <IconBrandWhatsapp size={16} />
                            Hubungi Kami
                        </a>
                    </div>
                    {/* Right: accordion */}
                    <div className="lg:col-span-3">
                        <FaqAccordion />
                    </div>
                </div>
            </Section>

            {/* ═══════════════════════════════════════════════
                §10  LEAD FORM — dark split layout
            ═══════════════════════════════════════════════ */}
            <Section id="lead-form" ref={leadFormRef} dark className="bg-gray-900">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left — info panel */}
                    <div>
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3">
                            Konsultasi Gratis
                        </p>
                        <h2 className="text-[1.9rem] md:text-[2.4rem] font-black text-white tracking-tight leading-tight mb-4">
                            Booking Test Drive
                            <span className="block text-gray-400">atau Tanya Harga</span>
                        </h2>
                        <p className="text-[14px] text-gray-400 leading-relaxed mb-8 max-w-sm">
                            Tim sales kami siap membantu — isi form atau langsung hubungi kami via
                            WhatsApp. Respons dalam 1×24 jam kerja.
                        </p>

                        {/* Benefits list */}
                        <ul className="flex flex-col gap-4 mb-8">
                            {[
                                {
                                    icon: IconCalendarEvent,
                                    text: "Jadwal test drive fleksibel, sesuai waktu Anda",
                                },
                                {
                                    icon: IconShieldCheck,
                                    text: "Konsultasi tanpa tekanan, tanpa biaya",
                                },
                                { icon: IconBolt, text: "Penawaran harga & cicilan terbaik" },
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-start gap-3">
                                    <span className="mt-0.5 w-7 h-7 rounded border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <Icon size={15} className="text-white/50" />
                                    </span>
                                    <span className="text-[13px] text-gray-400 leading-relaxed">
                                        {text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Direct WA CTA */}
                        <a
                            href={waHeroUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-[13px] transition-colors"
                        >
                            <IconBrandWhatsapp size={16} />
                            Chat Langsung via WhatsApp
                        </a>
                    </div>

                    {/* Right — form */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                        <p className="text-[12px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4">
                            Isi Form di Bawah
                        </p>
                        <LeadForm catalog={catalog} heroProduct={heroProduct} />
                    </div>
                </div>
            </Section>

            {/* ═══════════════════════════════════════════════
                Sticky WA button
            ═══════════════════════════════════════════════ */}
            <StickyWhatsAppButton
                whatsappNumber={whatsappNumber}
                message={
                    car.cta_whatsapp_message ?? "Halo, saya ingin informasi VinFast Limo Green."
                }
            />
        </UserLayout>
    );
}
