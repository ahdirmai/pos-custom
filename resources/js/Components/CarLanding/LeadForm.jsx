import React from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import {
    IconSend,
    IconUser,
    IconPhone,
    IconMapPin,
    IconCarSuv,
    IconNotes,
} from "@tabler/icons-react";

export default function LeadForm({ catalog = [], heroProduct = null }) {
    const allProducts = [...(heroProduct ? [heroProduct] : []), ...catalog];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phone: "",
        city: "",
        interested_product_id: "",
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("user.leads.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success("Terima kasih! Tim sales kami akan segera menghubungi Anda.", {
                    duration: 4000,
                    icon: "🚗",
                });
            },
            onError: () => toast.error("Mohon periksa kembali data Anda."),
        });
    };

    const inputClass =
        "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors";

    const errorClass = "text-[11px] text-danger-500 mt-1.5 font-medium";

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                    <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                        Nama Lengkap <span className="text-danger-500">*</span>
                    </label>
                    <div className="relative">
                        <IconUser
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Nama Anda"
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                        No. HP / WhatsApp <span className="text-danger-500">*</span>
                    </label>
                    <div className="relative">
                        <IconPhone
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                    {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                </div>

                {/* City */}
                <div>
                    <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                        Kota
                    </label>
                    <div className="relative">
                        <IconMapPin
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                            placeholder="Jakarta, Surabaya, Bandung..."
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                    {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>

                {/* Interested Product */}
                <div>
                    <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                        Model yang Diminati
                    </label>
                    <div className="relative">
                        <IconCarSuv
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <select
                            value={data.interested_product_id}
                            onChange={(e) => setData("interested_product_id", e.target.value)}
                            className={`${inputClass} pl-10 appearance-none cursor-pointer`}
                        >
                            <option value="">-- Pilih Model --</option>
                            {allProducts.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.interested_product_id && (
                        <p className={errorClass}>{errors.interested_product_id}</p>
                    )}
                </div>

                {/* Notes — full width */}
                <div className="sm:col-span-2">
                    <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                        Pesan / Pertanyaan
                    </label>
                    <div className="relative">
                        <IconNotes
                            size={16}
                            className="absolute left-3.5 top-4 text-gray-400 pointer-events-none"
                        />
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={3}
                            placeholder="Pertanyaan atau permintaan khusus..."
                            className={`${inputClass} pl-10 resize-none`}
                        />
                    </div>
                    {errors.notes && <p className={errorClass}>{errors.notes}</p>}
                </div>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gray-900 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold text-[15px] transition-colors"
            >
                <IconSend size={18} />
                {processing ? "Mengirim..." : "Kirim & Minta Dihubungi"}
            </button>

            <p className="text-center text-[11px] text-gray-400 mt-3">
                Data Anda aman dan hanya digunakan untuk keperluan konsultasi pembelian.
            </p>
        </form>
    );
}
