import React, { useState } from "react";
import { IconCheck, IconX, IconBatteryCharging, IconBattery1 } from "@tabler/icons-react";

const SCHEMES = {
    included: {
        label: "Termasuk Baterai",
        icon: IconBatteryCharging,
        tagline: "Beli putus, baterai jadi milik Anda seutuhnya.",
        rows: [
            {
                label: "Kepemilikan baterai",
                included: true,
                note: "Milik penuh sejak hari pertama",
            },
            { label: "Harga unit", included: true, note: "Lebih tinggi di harga awal" },
            { label: "Biaya bulanan tambahan", included: false, note: "Tidak ada" },
            { label: "Garansi baterai", included: true, note: "Sesuai kebijakan garansi resmi" },
            {
                label: "Fleksibilitas jual kembali",
                included: true,
                note: "Unit + baterai dijual bersamaan",
            },
        ],
    },
    subscription: {
        label: "Subscription Baterai",
        icon: IconBattery1,
        tagline: "Harga unit lebih ringan, baterai disewa bulanan.",
        rows: [
            { label: "Kepemilikan baterai", included: false, note: "Milik penyedia, disewakan" },
            { label: "Harga unit", included: true, note: "Lebih rendah di harga awal" },
            {
                label: "Biaya bulanan tambahan",
                included: true,
                note: "Biaya subscription per bulan",
            },
            { label: "Garansi baterai", included: true, note: "Ditanggung selama masa sewa" },
            {
                label: "Fleksibilitas upgrade",
                included: true,
                note: "Bisa upgrade kapasitas baterai",
            },
        ],
    },
};

export default function PurchaseSchemeToggle() {
    const [active, setActive] = useState("included");
    const scheme = SCHEMES[active];
    const ActiveIcon = scheme.icon;

    return (
        <div className="w-full">
            {/* Toggle */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                    {Object.entries(SCHEMES).map(([key, s]) => (
                        <button
                            key={key}
                            onClick={() => setActive(key)}
                            className={`px-5 py-2.5 rounded-md text-[13px] font-bold transition-all duration-200 ${
                                active === key
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ActiveIcon size={22} className="text-gray-600" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-bold text-gray-900">{scheme.label}</h3>
                        <p className="text-[12px] text-gray-500">{scheme.tagline}</p>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {scheme.rows.map((row) => (
                        <div key={row.label} className="flex items-center gap-4 py-3.5">
                            <div
                                className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                                    row.included
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                {row.included ? <IconCheck size={16} /> : <IconX size={16} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] font-semibold text-gray-800">
                                    {row.label}
                                </p>
                                <p className="text-[12px] text-gray-500">{row.note}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-[11px] text-gray-400 text-center mt-4">
                *) Skema di atas adalah ilustrasi umum. Detail biaya & syarat mengikuti kebijakan
                dealer/leasing yang berlaku.
            </p>
        </div>
    );
}
