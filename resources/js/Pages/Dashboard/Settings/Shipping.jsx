import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import { IconDeviceFloppy, IconTruckDelivery, IconMapPin, IconBarcode, IconWorld } from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function Shipping({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        shop_postal_code: settings.shop_postal_code || "",
        shipping_provider: settings.shipping_provider || "biteship",
        biteship_api_key: settings.biteship_api_key || "",
        biteship_base_url: settings.biteship_base_url || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("settings.shipping.update"), {
            preserveScroll: true,
            onSuccess: () => toast.success("Konfigurasi pengiriman disimpan"),
            onError: () => toast.error("Gagal menyimpan konfigurasi"),
        });
    };

    return (
        <>
            <Head title="Konfigurasi Pengiriman" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <IconTruckDelivery className="text-primary-500" size={28} />
                        Konfigurasi Pengiriman
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Atur integrasi dengan pihak pengiriman (kurir) dan lokasi asal pengiriman toko Anda.
                    </p>
                </div>

                <form onSubmit={submit} className="pb-10">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                Integrasi Biteship
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Hubungkan toko Anda dengan Biteship untuk penghitungan ongkos kirim otomatis.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="md:col-span-2">
                                <Input
                                    label="Kode Pos Asal (Origin)"
                                    value={data.shop_postal_code}
                                    errors={errors.shop_postal_code}
                                    onChange={(e) => setData("shop_postal_code", e.target.value)}
                                    placeholder="Contoh: 12345"
                                    icon={<IconMapPin size={18} />}
                                />
                                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                                    <IconMapPin size={12} />
                                    Kode pos ini digunakan sebagai lokasi penjemputan paket.
                                </p>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Provider
                                    </label>
                                    <select
                                        className="w-full border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                                        value={data.shipping_provider}
                                        onChange={(e) => setData("shipping_provider", e.target.value)}
                                    >
                                        <option value="biteship">Biteship</option>
                                    </select>
                                    {errors.shipping_provider && (
                                        <div className="text-red-500 text-xs mt-1">{errors.shipping_provider}</div>
                                    )}
                                </div>
                                
                                <Input
                                    label="Base URL API"
                                    value={data.biteship_base_url}
                                    errors={errors.biteship_base_url}
                                    onChange={(e) => setData("biteship_base_url", e.target.value)}
                                    placeholder="https://api.biteship.com"
                                    icon={<IconWorld size={18} />}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    label="API Key"
                                    value={data.biteship_api_key}
                                    errors={errors.biteship_api_key}
                                    onChange={(e) => setData("biteship_api_key", e.target.value)}
                                    placeholder="biteship_live_..."
                                    type="password"
                                    icon={<IconBarcode size={18} />}
                                />
                                <p className="text-[11px] text-slate-500 mt-1.5 ml-1">
                                    Dapatkan API Key di dashboard Biteship Anda. Disarankan menggunakan API Key Production.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <IconDeviceFloppy size={20} />
                                {processing ? "Menyimpan..." : "Simpan Konfigurasi"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Shipping.layout = (page) => <DashboardLayout children={page} />;
