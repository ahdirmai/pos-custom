import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
    IconPalette,
    IconDeviceFloppy,
    IconRefresh,
    IconCheck,
} from "@tabler/icons-react";

// Mirror of App\Services\ThemeService shade ratios.
const SHADES = {
    50: 0.92,
    100: 0.82,
    200: 0.64,
    300: 0.46,
    400: 0.26,
    500: 0.12,
    600: 0.0,
    700: -0.18,
    800: -0.34,
    900: -0.48,
    950: -0.66,
};

const hexToRgb = (hex) => {
    const h = hex.replace("#", "");
    return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
    ];
};

const buildPalette = (hex) => {
    const [r, g, b] = hexToRgb(hex);
    const out = {};
    for (const [shade, ratio] of Object.entries(SHADES)) {
        let mr, mg, mb;
        if (ratio > 0) {
            mr = Math.round(r + (255 - r) * ratio);
            mg = Math.round(g + (255 - g) * ratio);
            mb = Math.round(b + (255 - b) * ratio);
        } else if (ratio < 0) {
            const f = 1 + ratio;
            mr = Math.round(r * f);
            mg = Math.round(g * f);
            mb = Math.round(b * f);
        } else {
            [mr, mg, mb] = [r, g, b];
        }
        out[shade] = `${mr} ${mg} ${mb}`;
    }
    return out;
};

const isValidHex = (v) => /^#?[0-9a-fA-F]{6}$/.test(v);

export default function Theme({ primaryHex, defaultHex, presets = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        theme_primary: primaryHex || defaultHex,
    });

    const palette = useMemo(
        () => (isValidHex(data.theme_primary) ? buildPalette(data.theme_primary) : null),
        [data.theme_primary]
    );

    // Live preview: apply vars to document root so whole dashboard reflects choice.
    useEffect(() => {
        if (!palette) return;
        const root = document.documentElement;
        Object.entries(palette).forEach(([shade, triplet]) => {
            root.style.setProperty(`--color-primary-${shade}`, triplet);
        });
        return () => {
            // restore saved value on unmount
            const saved = buildPalette(primaryHex || defaultHex);
            Object.entries(saved).forEach(([shade, triplet]) => {
                root.style.setProperty(`--color-primary-${shade}`, triplet);
            });
        };
    }, [palette, primaryHex, defaultHex]);

    const submit = (e) => {
        e.preventDefault();
        post(route("settings.theme.update"), {
            preserveScroll: true,
            onSuccess: () => toast.success("Warna tema berhasil diperbarui"),
        });
    };

    const setHex = (hex) => setData("theme_primary", hex.toLowerCase());

    return (
        <>
            <Head title="Pengaturan Tema" />

            <div className="mb-6 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <IconPalette size={22} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Pengaturan Tema
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Atur warna dasar (primary) dashboard & toko.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Picker */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                            Preset Warna
                        </h3>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                            {presets.map((p) => {
                                const active = data.theme_primary === p.hex.toLowerCase();
                                return (
                                    <button
                                        key={p.hex}
                                        type="button"
                                        title={p.name}
                                        onClick={() => setHex(p.hex)}
                                        className={`relative aspect-square rounded-xl border-2 transition-all ${
                                            active
                                                ? "border-slate-900 dark:border-white scale-105"
                                                : "border-transparent hover:scale-105"
                                        }`}
                                        style={{ backgroundColor: p.hex }}
                                    >
                                        {active && (
                                            <IconCheck
                                                size={18}
                                                className="absolute inset-0 m-auto text-white drop-shadow"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                            Warna Kustom
                        </h3>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={isValidHex(data.theme_primary) ? data.theme_primary : "#000000"}
                                onChange={(e) => setHex(e.target.value)}
                                className="h-11 w-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={data.theme_primary}
                                onChange={(e) => setData("theme_primary", e.target.value)}
                                placeholder="#cfaa08"
                                className="w-40 h-11 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            />
                            <button
                                type="button"
                                onClick={() => setHex(defaultHex)}
                                className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <IconRefresh size={16} />
                                Default
                            </button>
                        </div>
                        {errors.theme_primary && (
                            <p className="text-xs text-danger-500 mt-2">{errors.theme_primary}</p>
                        )}

                        {/* Shade strip */}
                        {palette && (
                            <div className="mt-6">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    Pratinjau gradasi (50 → 950)
                                </p>
                                <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {Object.entries(palette).map(([shade, triplet]) => (
                                        <div
                                            key={shade}
                                            className="flex-1 h-10"
                                            style={{ backgroundColor: `rgb(${triplet})` }}
                                            title={shade}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !isValidHex(data.theme_primary)}
                        className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/20 disabled:opacity-70"
                    >
                        <IconDeviceFloppy size={18} />
                        {processing ? "Menyimpan..." : "Simpan Tema"}
                    </button>
                </div>

                {/* Live preview */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 h-fit">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                        Pratinjau Komponen
                    </h3>
                    <div className="space-y-3">
                        <button type="button" className="w-full h-11 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold">
                            Tombol Utama
                        </button>
                        <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800">
                            <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                                Kartu beraksen primary
                            </span>
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 text-xs font-semibold">
                            Badge
                        </span>
                        <a href="#" onClick={(e) => e.preventDefault()} className="block text-sm text-primary-600 dark:text-primary-400 hover:underline">
                            Tautan teks primary &rarr;
                        </a>
                    </div>
                </div>
            </form>
        </>
    );
}

Theme.layout = (page) => <DashboardLayout children={page} />;
