import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import {
    IconBolt,
    IconBrush,
    IconDeviceFloppy,
    IconPalette,
    IconSparkles,
} from "@tabler/icons-react";

function ColorField({ label, value, onChange, error, helper }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={onChange}
                    className="h-11 w-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 cursor-pointer"
                />
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    className="w-full h-11 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
            </div>
            {helper && <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>}
            {error && <p className="text-xs text-danger-500">{error}</p>}
        </div>
    );
}

export default function FlashSaleStyle({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        flash_sale_badge_text: settings.flash_sale_badge_text || "Flash Sale",
        flash_sale_bg_from: settings.flash_sale_bg_from || "#b91c1c",
        flash_sale_bg_via: settings.flash_sale_bg_via || "#ea580c",
        flash_sale_bg_to: settings.flash_sale_bg_to || "#f59e0b",
        flash_sale_text_color: settings.flash_sale_text_color || "#ffffff",
        flash_sale_muted_text_color: settings.flash_sale_muted_text_color || "#ffe7d6",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("settings.flash-sale-style.update"), {
            preserveScroll: true,
            onSuccess: () => toast.success("Style flash sale disimpan"),
            onError: () => toast.error("Gagal menyimpan style flash sale"),
        });
    };

    const previewStyle = {
        background: `linear-gradient(135deg, ${data.flash_sale_bg_from} 0%, ${data.flash_sale_bg_via} 45%, ${data.flash_sale_bg_to} 100%)`,
        color: data.flash_sale_text_color,
    };

    return (
        <>
            <Head title="Style Flash Sale" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Style Flash Sale
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Atur tampilan blok flash sale di homepage agar tetap senada dengan identitas brand Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/40">
                                    <IconSparkles size={20} className="text-rose-500" />
                                </div>
                                <h2 className="font-bold text-slate-800 dark:text-slate-200">
                                    Preview
                                </h2>
                            </div>

                            <div className="relative overflow-hidden rounded-[28px] p-5 shadow-[0_16px_40px_rgba(234,88,12,0.18)]" style={previewStyle}>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_30%)]"></div>
                                <div className="relative">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-[0.24em] uppercase bg-white/15 border border-white/15 mb-3">
                                        {data.flash_sale_badge_text}
                                    </span>
                                    <h3 className="text-[1.7rem] font-black tracking-tight leading-tight">
                                        Flash Sale Gajian
                                    </h3>
                                    <p className="text-sm mt-2 max-w-md" style={{ color: data.flash_sale_muted_text_color }}>
                                        Preview ini menampilkan arah warna, badge, dan hirarki teks yang akan dipakai di homepage.
                                    </p>
                                    <div className="mt-5 flex items-center gap-2">
                                        {["08", "12", "49"].map((part) => (
                                            <span key={part} className="inline-flex items-center justify-center min-w-[40px] h-10 rounded-xl bg-white/15 border border-white/20 font-black text-sm shadow-inner">
                                                {part}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                            <div className="flex items-start gap-3">
                                <IconPalette size={20} className="text-primary-500 mt-0.5" />
                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <p>
                                        Gunakan kombinasi warna dengan kontras tinggi agar produk promo tetap terbaca jelas di mobile maupun desktop.
                                    </p>
                                    <p>
                                        Jika ingin tetap senada dengan desain saat ini, pakai gradasi hangat merah-oranye-amber seperti default.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                                <h2 className="font-bold text-slate-800 dark:text-slate-200">
                                    Pengaturan Visual
                                </h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Teks Badge
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <IconBolt size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        value={data.flash_sale_badge_text}
                                        onChange={(e) => setData("flash_sale_badge_text", e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        placeholder="Flash Sale"
                                    />
                                </div>
                                {errors.flash_sale_badge_text && <p className="text-xs text-danger-500">{errors.flash_sale_badge_text}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <ColorField
                                    label="Warna Awal Gradient"
                                    value={data.flash_sale_bg_from}
                                    onChange={(e) => setData("flash_sale_bg_from", e.target.value)}
                                    error={errors.flash_sale_bg_from}
                                />
                                <ColorField
                                    label="Warna Tengah Gradient"
                                    value={data.flash_sale_bg_via}
                                    onChange={(e) => setData("flash_sale_bg_via", e.target.value)}
                                    error={errors.flash_sale_bg_via}
                                />
                                <ColorField
                                    label="Warna Akhir Gradient"
                                    value={data.flash_sale_bg_to}
                                    onChange={(e) => setData("flash_sale_bg_to", e.target.value)}
                                    error={errors.flash_sale_bg_to}
                                />
                                <ColorField
                                    label="Warna Teks Utama"
                                    value={data.flash_sale_text_color}
                                    onChange={(e) => setData("flash_sale_text_color", e.target.value)}
                                    error={errors.flash_sale_text_color}
                                />
                                <div className="md:col-span-2">
                                    <ColorField
                                        label="Warna Teks Pendukung"
                                        value={data.flash_sale_muted_text_color}
                                        onChange={(e) => setData("flash_sale_muted_text_color", e.target.value)}
                                        error={errors.flash_sale_muted_text_color}
                                        helper="Dipakai untuk deskripsi dan teks countdown pendukung."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <IconDeviceFloppy size={20} />
                                    {processing ? "Menyimpan..." : "Simpan Style Flash Sale"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

FlashSaleStyle.layout = (page) => <DashboardLayout children={page} />;
