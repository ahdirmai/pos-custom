import React from "react";
import { Link } from "@inertiajs/react";
import {
    IconBrandWhatsapp,
    IconPhone,
    IconMapPin,
    IconMail,
    IconBrandInstagram,
    IconBrandFacebook,
    IconBrandYoutube,
    IconChevronRight,
} from "@tabler/icons-react";

const NAV_COLUMNS = [
    {
        heading: "Kendaraan",
        links: [
            { label: "VinFast Limo Green", href: "#hero" },
            { label: "Semua Model", href: route("user.products") },
            { label: "Spesifikasi", href: "#specs" },
            { label: "Galeri", href: "#gallery" },
        ],
    },
    {
        heading: "Layanan",
        links: [
            { label: "Booking Test Drive", href: "#lead-form" },
            { label: "Simulasi Kredit", href: "#credit-simulator" },
            { label: "Skema Pembelian", href: "#purchase-scheme" },
            { label: "Tanya via WhatsApp", href: "#" },
        ],
    },
    {
        heading: "Informasi",
        links: [
            { label: "Tentang Kami", href: "#" },
            { label: "FAQ", href: "#faq" },
            { label: "Syarat & Ketentuan", href: "#" },
            { label: "Kebijakan Privasi", href: "#" },
        ],
    },
];

export default function CarFooter({ whatsappNumber = "" }) {
    const waUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
        : "#";

    return (
        <footer className="bg-gray-950 text-gray-400">
            {/* ── Main footer grid ── */}
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

                {/* Col 1 – Brand */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <div>
                        <p className="text-white font-black text-[20px] tracking-tight leading-none mb-1">
                            VinFast
                        </p>
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
                            Authorized Dealer
                        </p>
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-500 max-w-xs">
                        Dealer resmi kendaraan listrik VinFast di Indonesia. Melayani pembelian, test drive, dan konsultasi armada untuk perorangan maupun bisnis.
                    </p>

                    {/* Contact block */}
                    <div className="flex flex-col gap-2.5 mt-1">
                        {whatsappNumber && (
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 text-[13px] text-gray-400 hover:text-white transition-colors group"
                            >
                                <IconBrandWhatsapp size={16} className="text-[#25D366] flex-shrink-0" />
                                {whatsappNumber}
                            </a>
                        )}
                        <span className="flex items-center gap-2.5 text-[13px]">
                            <IconMapPin size={16} className="text-gray-600 flex-shrink-0" />
                            Jakarta, Surabaya, Bali
                        </span>
                        <a
                            href="mailto:info@dealer.vinfast.id"
                            className="flex items-center gap-2.5 text-[13px] text-gray-400 hover:text-white transition-colors"
                        >
                            <IconMail size={16} className="text-gray-600 flex-shrink-0" />
                            info@dealer.vinfast.id
                        </a>
                    </div>

                    {/* Social */}
                    <div className="flex items-center gap-3 mt-1">
                        {[
                            { Icon: IconBrandInstagram, href: "#", label: "Instagram" },
                            { Icon: IconBrandFacebook, href: "#", label: "Facebook" },
                            { Icon: IconBrandYoutube, href: "#", label: "YouTube" },
                        ].map(({ Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-8 h-8 border border-gray-700 rounded flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-white transition-colors"
                            >
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Cols 2–4 – Nav links */}
                {NAV_COLUMNS.map((col) => (
                    <div key={col.heading} className="flex flex-col gap-3">
                        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-1">
                            {col.heading}
                        </p>
                        <ul className="flex flex-col gap-2.5">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-[13px] text-gray-500 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* ── Bottom bar ── */}
            <div className="border-t border-white/5">
                <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[12px] text-gray-600">
                        © {new Date().getFullYear()} VinFast Authorized Dealer Indonesia. Hak cipta dilindungi.
                    </p>
                    <p className="text-[11px] text-gray-700">
                        Harga bersifat estimasi — hubungi dealer untuk penawaran resmi
                    </p>
                </div>
            </div>
        </footer>
    );
}
