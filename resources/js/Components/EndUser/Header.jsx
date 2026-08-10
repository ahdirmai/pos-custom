import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { useCart } from "@/Context/CartContext";
import { useWishlist } from "@/Context/WishlistContext";
import Dropdown from "@/Components/Dropdown";

// ─────────────────────────────────────────────────────────────
//  SHOWROOM VARIANT  (transparent → dark-glass on scroll)
// ─────────────────────────────────────────────────────────────
function ShowroomHeader() {
    const { auth, storeProfile } = usePage().props;
    const { cartCount, setIsCartOpen } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 56);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setMenuOpen(false);
    };

    const NAV = [
        { label: "Spesifikasi", id: "highlight-specs" },
        { label: "Galeri", id: "gallery" },
        { label: "Katalog", id: "catalog" },
        { label: "Kredit", id: "credit-simulator" },
    ];

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
                    scrolled
                        ? "bg-[#07090a]/90 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_1px_60px_rgba(0,0,0,0.5)]"
                        : "bg-transparent border-b border-transparent"
                }`}
            >
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-[68px] gap-6">
                        {/* ── Logo ── */}
                        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                            <ApplicationLogo className="h-6 w-auto fill-white opacity-90 group-hover:opacity-100 transition-opacity" />
                            {storeProfile?.name && (
                                <span className="text-white/80 group-hover:text-white font-semibold text-[14px] tracking-tight transition-colors">
                                    {storeProfile.name}
                                </span>
                            )}
                        </Link>

                        {/* ── Desktop nav ── */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV.map(({ label, id }) => (
                                <button
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    className="px-3.5 py-2 text-white/50 hover:text-white text-[13px] font-medium tracking-wide transition-colors rounded-lg hover:bg-white/[0.04]"
                                >
                                    {label}
                                </button>
                            ))}
                        </nav>

                        {/* ── Right controls ── */}
                        <div className="flex items-center gap-1.5">
                            {/* Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2.5 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
                                aria-label="Keranjang"
                            >
                                <svg
                                    className="h-[19px] w-[19px]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.6}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 w-[16px] h-[16px] bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Auth — desktop */}
                            {auth.user ? (
                                <div className="hidden md:block">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="flex items-center gap-2 text-white/50 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors text-[13px] font-medium">
                                                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center font-bold text-[11px]">
                                                    {auth.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="truncate max-w-[80px]">
                                                    {auth.user.name}
                                                </span>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route("user.profile")}>
                                                Profil Saya
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route("user.orders.index")}>
                                                Pesanan Saya
                                            </Dropdown.Link>
                                            <div className="border-t border-gray-100 my-1" />
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="text-red-600"
                                            >
                                                Keluar
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="hidden md:inline-flex items-center px-3.5 py-1.5 text-[12px] font-medium text-white/50 hover:text-white transition-colors"
                                >
                                    Masuk
                                </Link>
                            )}

                            {/* CTA pill — desktop */}
                            <button
                                onClick={() => scrollTo("lead-form")}
                                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold text-white bg-white/[0.08] border border-white/[0.12] hover:bg-primary-600 hover:border-primary-600 transition-all ml-1"
                            >
                                Test Drive
                            </button>

                            {/* Hamburger — mobile */}
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="lg:hidden p-2.5 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
                                aria-label="Menu"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h10M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer (dark) ── */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    {/* Scrim */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                    />
                    {/* Panel */}
                    <div className="absolute inset-y-0 right-0 w-[280px] bg-[#09100e] border-l border-white/[0.06] flex flex-col">
                        {/* Panel header */}
                        <div className="flex items-center justify-between px-6 h-[68px] border-b border-white/[0.06]">
                            <span className="text-[10px] text-white/25 font-bold tracking-[0.25em] uppercase">
                                Navigasi
                            </span>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="p-2 text-white/30 hover:text-white transition-colors"
                                aria-label="Tutup"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Links */}
                        <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
                            {[
                                { label: "Spesifikasi", id: "highlight-specs" },
                                { label: "Galeri Foto", id: "gallery" },
                                { label: "Katalog Model", id: "catalog" },
                                { label: "Simulasi Kredit", id: "credit-simulator" },
                                { label: "Booking Test Drive", id: "lead-form" },
                            ].map(({ label, id }) => (
                                <button
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    className="flex items-center justify-between py-4 text-left text-[15px] text-white/50 hover:text-white font-medium border-b border-white/[0.05] transition-colors"
                                >
                                    {label}
                                    <svg
                                        className="w-4 h-4 opacity-20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            ))}
                            <Link
                                href={route("user.products")}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center justify-between py-4 text-[15px] text-white/50 hover:text-white font-medium border-b border-white/[0.05] transition-colors"
                            >
                                Semua Produk
                                <svg
                                    className="w-4 h-4 opacity-20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </nav>

                        {/* Auth footer */}
                        <div className="px-6 pb-8 pt-4 border-t border-white/[0.06]">
                            {auth.user ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center font-bold text-[12px]">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="text-white/70 text-[13px] font-medium">
                                            {auth.user.name}
                                        </p>
                                    </div>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-white/25 hover:text-white/60 text-[11px] transition-colors"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link
                                        href={route("login")}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex-1 text-center py-2.5 text-[13px] font-semibold text-white/70 border border-white/15 rounded-lg hover:bg-white/[0.06] transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex-1 text-center py-2.5 text-[13px] font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────
//  DEFAULT VARIANT  (existing retail header, unchanged)
// ─────────────────────────────────────────────────────────────
function DefaultHeader() {
    const { url } = usePage();
    const { cartCount, setIsCartOpen } = useCart();
    const { wishlistCount } = useWishlist();
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        if (path === "/") return url === "/";
        return url.startsWith(path);
    };

    const { auth, storeProfile } = usePage().props;

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-3 sm:gap-6">
                    {/* Left: hamburger + logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            {storeProfile?.logo ? (
                                <img
                                    src={storeProfile.logo}
                                    alt={storeProfile?.name || "Store Logo"}
                                    className="h-8 w-auto object-contain"
                                />
                            ) : (
                                <ApplicationLogo className="h-8 w-auto text-primary-600" />
                            )}
                            {storeProfile?.name && (
                                <span className="text-lg sm:text-xl font-extrabold text-primary-600 truncate max-w-[130px] sm:max-w-[160px] tracking-tight">
                                    {storeProfile.name}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Center: search */}
                    <div className="hidden lg:flex flex-1 items-center gap-4 mx-4">
                        <button className="text-gray-700 font-medium whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                            Kategori
                        </button>
                        <div className="flex-1 relative">
                            <form
                                onSubmit={handleSearch}
                                className="flex border border-[#B3BBC9] rounded-lg h-10 w-full overflow-hidden transition-colors hover:border-primary-600 focus-within:border-primary-600"
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk..."
                                    className="flex-1 border-none focus:ring-0 px-4 text-sm bg-transparent outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-3 bg-gray-50 border-l border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: cart + auth */}
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full relative transition-colors"
                            title="Keranjang"
                        >
                            <span className="sr-only">Keranjang</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </button>

                        <div className="hidden md:block w-px h-6 bg-gray-200 mx-2" />

                        {auth.user ? (
                            <div className="hidden md:flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 px-2 py-1.5 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium">
                                            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                                                {auth.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="truncate max-w-[100px]">
                                                {auth.user.name}
                                            </span>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("user.profile")}>
                                            Profil Saya
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("user.orders.index")}>
                                            Pesanan Saya
                                        </Dropdown.Link>
                                        <div className="border-t border-gray-100 my-1" />
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="text-red-600 focus:text-red-700 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Keluar
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    href={route("login")}
                                    className="px-4 py-1.5 text-sm font-bold text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-4 py-1.5 text-sm font-bold text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl flex flex-col transform transition-transform duration-300">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <span className="font-bold text-lg text-primary-600">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                            {!auth.user && (
                                <div className="flex gap-2 mb-6">
                                    <Link
                                        href={route("login")}
                                        className="flex-1 text-center py-2 px-4 border border-primary-600 text-primary-600 rounded-lg font-bold text-sm"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="flex-1 text-center py-2 px-4 bg-primary-600 text-white rounded-lg font-bold text-sm"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                            <nav className="flex flex-col space-y-2">
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    href="/"
                                    className={`px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${isActive("/") ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        />
                                    </svg>
                                    Beranda
                                </Link>
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    href="/products"
                                    className={`px-4 py-3 rounded-xl font-bold flex items-center gap-3 ${isActive("/products") ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                        />
                                    </svg>
                                    Katalog Produk
                                </Link>
                                <Link
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    href="/wishlist"
                                    className="px-4 py-3 rounded-xl font-bold flex items-center gap-3 text-gray-700 hover:bg-gray-50"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    Wishlist ({wishlistCount})
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

// ─────────────────────────────────────────────────────────────
//  LIGHT VARIANT  (premium light header for catalog & detail)
// ─────────────────────────────────────────────────────────────
function LightHeader() {
    const { url } = usePage();
    const { auth, storeProfile } = usePage().props;
    const { cartCount, setIsCartOpen } = useCart();
    const { wishlistCount } = useWishlist();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => {
        if (path === "/") return url === "/";
        return url.startsWith(path);
    };

    const NAV = [
        { label: "Beranda", href: "/" },
        { label: "Katalog", href: "/products" },
    ];

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-100">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-[68px] gap-6">
                        {/* ── Logo ── */}
                        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                            <ApplicationLogo className="h-6 w-auto fill-gray-900 group-hover:opacity-80 transition-opacity" />
                            {storeProfile?.name && (
                                <span className="text-gray-900 font-semibold text-[14px] tracking-tight transition-colors">
                                    {storeProfile.name}
                                </span>
                            )}
                        </Link>

                        {/* ── Desktop nav ── */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV.map(({ label, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors rounded-lg ${
                                        isActive(href)
                                            ? "text-gray-900 font-bold"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>

                        {/* ── Right controls ── */}
                        <div className="flex items-center gap-1.5">
                            {/* Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                                aria-label="Keranjang"
                            >
                                <svg
                                    className="h-[19px] w-[19px]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.6}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 w-[16px] h-[16px] bg-gray-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Auth — desktop */}
                            {auth.user ? (
                                <div className="hidden md:block">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-[13px] font-medium">
                                                <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[11px]">
                                                    {auth.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="truncate max-w-[80px]">
                                                    {auth.user.name}
                                                </span>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route("user.profile")}>
                                                Profil Saya
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route("user.orders.index")}>
                                                Pesanan Saya
                                            </Dropdown.Link>
                                            <div className="border-t border-gray-100 my-1" />
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="text-red-600"
                                            >
                                                Keluar
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="hidden md:inline-flex items-center px-3.5 py-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Masuk
                                </Link>
                            )}

                            {/* CTA — desktop */}
                            <Link
                                href="/#lead-form"
                                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors ml-1"
                            >
                                Test Drive
                            </Link>

                            {/* Hamburger — mobile */}
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                                aria-label="Menu"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h10M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer (light) ── */}
            {menuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute inset-y-0 right-0 w-[280px] bg-white border-l border-gray-100 flex flex-col shadow-2xl">
                        {/* Panel header */}
                        <div className="flex items-center justify-between px-6 h-[68px] border-b border-gray-100">
                            <span className="text-[10px] text-gray-400 font-bold tracking-[0.25em] uppercase">
                                Navigasi
                            </span>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                                aria-label="Tutup"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Links */}
                        <nav className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
                            <Link
                                href="/"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center justify-between py-4 text-left text-[15px] font-medium border-b border-gray-100 transition-colors ${
                                    isActive("/")
                                        ? "text-gray-900 font-bold"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                Beranda
                                <svg
                                    className="w-4 h-4 opacity-20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href="/products"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center justify-between py-4 text-[15px] font-medium border-b border-gray-100 transition-colors ${
                                    isActive("/products")
                                        ? "text-gray-900 font-bold"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                Katalog
                                <svg
                                    className="w-4 h-4 opacity-20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href="/wishlist"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center justify-between py-4 text-[15px] text-gray-600 hover:text-gray-900 font-medium border-b border-gray-100 transition-colors"
                            >
                                Wishlist ({wishlistCount})
                                <svg
                                    className="w-4 h-4 opacity-20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href="/#lead-form"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center justify-between py-4 text-[15px] text-gray-600 hover:text-gray-900 font-medium border-b border-gray-100 transition-colors"
                            >
                                Test Drive
                                <svg
                                    className="w-4 h-4 opacity-20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </nav>

                        {/* Auth footer */}
                        <div className="px-6 pb-8 pt-4 border-t border-gray-100">
                            {auth.user ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-[12px]">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="text-gray-800 text-[13px] font-medium">
                                            {auth.user.name}
                                        </p>
                                    </div>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-gray-400 hover:text-gray-700 text-[11px] transition-colors"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link
                                        href={route("login")}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex-1 text-center py-2.5 text-[13px] font-semibold text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex-1 text-center py-2.5 text-[13px] font-semibold text-white bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────
//  Export — variant router
// ─────────────────────────────────────────────────────────────
export default function Header({ variant = "default" }) {
    if (variant === "showroom") return <ShowroomHeader />;
    if (variant === "light") return <LightHeader />;
    return <DefaultHeader />;
}
