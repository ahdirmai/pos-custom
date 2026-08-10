import React, { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

const FAQ_ITEMS = [
    {
        q: "Apakah saya bisa benar-benar membeli mobil ini secara online?",
        a: "Ya! Anda dapat menambahkan unit ke keranjang, mengisi data pengiriman, memilih metode pembayaran (transfer bank, kartu kredit, dsb.), dan menyelesaikan transaksi sepenuhnya online. Tim kami akan menghubungi Anda untuk koordinasi pengiriman unit setelah pembayaran dikonfirmasi.",
    },
    {
        q: "Berapa garansi yang diberikan untuk VinFast Limo Green?",
        a: "VinFast memberikan garansi baterai & motor hingga 10 tahun atau 200.000 km (untuk skema termasuk baterai) dan garansi kendaraan umum 5 tahun. Detail garansi dapat berubah; silakan konfirmasi dengan sales kami untuk penawaran terkini.",
    },
    {
        q: "Berapa estimasi biaya pengisian daya (charging)?",
        a: "Dengan tarif listrik rumah tangga daya 1.300 VA ke atas (~Rp 1.444/kWh), mengisi daya penuh baterai ~60 kWh menghabiskan sekitar Rp 86.000–90.000 untuk jarak hingga 450 km. Jauh lebih hemat dibanding BBM.",
    },
    {
        q: "Di mana saya bisa servis dan mengisi daya VinFast?",
        a: "VinFast memiliki jaringan dealer & bengkel resmi yang terus berkembang di kota-kota besar Indonesia. Untuk charging publik, unit mendukung pengisian via EVDRIVE, Voltarei, dan charging station umum DC CCS2/ChaDeMo. Hubungi kami untuk info lokasi terdekat.",
    },
    {
        q: 'Apa perbedaan skema "Termasuk Baterai" vs "Subscription Baterai"?',
        a: '"Termasuk Baterai" berarti Anda memiliki baterai penuh sejak awal (harga unit lebih tinggi, tanpa biaya bulanan tambahan). "Subscription Baterai" menawarkan harga unit lebih rendah namun ada biaya sewa baterai per bulan — cocok untuk operator armada yang ingin menekan biaya awal.',
    },
    {
        q: "Bisakah saya booking test drive dulu sebelum membeli?",
        a: 'Tentu! Isi formulir "Konsultasi & Test Drive" di bawah halaman ini. Tim sales kami akan menghubungi Anda dalam 1×24 jam kerja untuk menjadwalkan test drive di lokasi terdekat.',
    },
    {
        q: "Apakah ada program cicilan/kredit?",
        a: "Tersedia skema pembelian tunai maupun kredit melalui bank/leasing rekanan. Gunakan kalkulator simulasi kredit di halaman ini untuk estimasi cicilan. Untuk angka pasti dan proses kredit, silakan isi form konsultasi atau chat WhatsApp dengan sales kami.",
    },
    {
        q: "Apakah stok selalu tersedia?",
        a: "Stok yang ditampilkan mencerminkan unit tersedia di dealer. Jika unit habis, Anda tetap bisa mengisi form konsultasi untuk info indent/pre-order.",
    },
];

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

    return (
        <div className="w-full">
            {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border-b border-gray-200 last:border-b-0">
                    <button
                        onClick={() => toggle(i)}
                        className="w-full flex items-center justify-between gap-4 py-4 text-left"
                    >
                        <span className="text-[14px] font-semibold text-gray-800 leading-snug flex-1">
                            {item.q}
                        </span>
                        <IconChevronDown
                            size={18}
                            className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
                        />
                    </button>
                    {openIndex === i && (
                        <div className="pb-4">
                            <p className="text-[13px] text-gray-500 leading-relaxed">{item.a}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
