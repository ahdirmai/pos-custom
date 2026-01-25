import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import {
    IconBuildingStore,
    IconDeviceFloppy,
    IconPhone,
    IconMapPin,
    IconWorld,
    IconMail,
    IconBarcode,
} from "@tabler/icons-react";

export default function Store({ settings }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        store_name: settings.store_name || "",
        store_code: settings.store_code || "",
        store_logo: null,
        store_address: settings.store_address || "",
        store_phone: settings.store_phone || "",
        store_email: settings.store_email || "",
        store_website: settings.store_website || "",
        store_city: settings.store_city || "",
        _method: "POST",
    });

    const [logoPreview, setLogoPreview] = useState(
        settings.store_logo 
            ? (settings.store_logo.startsWith("http") ? settings.store_logo : `/storage/${settings.store_logo}`) 
            : null
    );

    useEffect(() => {
        return () => {
            if (logoPreview && logoPreview.startsWith("blob:")) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("store_logo", file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("settings.store.update"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Profil toko disimpan");
                reset("store_logo");
            },
            onError: () => toast.error("Gagal menyimpan profil toko"),
        });
    };

    return (
        <>
            <Head title="Profil Toko" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Pengaturan Toko
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Identitas ini akan muncul secara otomatis di struk belanja dan laporan operasional.
                    </p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
                    
                    {/* Bagian Kiri: Kolom Logo (Col 4) */}
                    <div className="lg:col-span-4 space-y-4">
                        <ImageUploadZone
                            title="Logo Toko"
                            icon={IconBuildingStore}
                            imagePreview={logoPreview}
                            onImageChange={handleLogoChange}
                            onImageRemove={() => {
                                setLogoPreview(null);
                                setData("store_logo", null);
                            }}
                            error={errors.store_logo}
                        />
                        
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Informasi Visual</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Logo akan dicetak pada struk thermal. Gunakan logo dengan kontras tinggi (Hitam/Putih) untuk hasil cetak maksimal.
                            </p>
                        </div>
                    </div>

                    {/* Bagian Kanan: Detail Info (Col 8) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                            <div className="grid grid-cols-1 gap-5">
                                <Input
                                    label="Nama Toko"
                                    value={data.store_name}
                                    errors={errors.store_name}
                                    onChange={(e) => setData("store_name", e.target.value)}
                                    placeholder="Masukkan nama brand/toko lo"
                                    icon={<IconBuildingStore size={18} />}
                                />
                                
                                <Input
                                    label="Kode Toko (Prefix Invoice)"
                                    value={data.store_code}
                                    errors={errors.store_code}
                                    onChange={(e) => setData("store_code", e.target.value.toUpperCase().replace(/\s/g, ''))}
                                    placeholder="Contoh: POS01 (Default: TRX)"
                                    icon={<IconBarcode size={18} />}
                                />
                                
                                <Textarea
                                    label="Alamat Lengkap"
                                    value={data.store_address}
                                    errors={errors.store_address}
                                    onChange={(e) => setData("store_address", e.target.value)}
                                    placeholder="Jl. Nama Jalan No. XX, Kecamatan..."
                                    rows={3}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Kota/Kabupaten"
                                        value={data.store_city}
                                        errors={errors.store_city}
                                        onChange={(e) => setData("store_city", e.target.value)}
                                        placeholder="Contoh: Jakarta Selatan"
                                        icon={<IconMapPin size={18} />}
                                    />
                                    <Input
                                        label="Nomor Telepon Bisnis"
                                        value={data.store_phone}
                                        errors={errors.store_phone}
                                        onChange={(e) => setData("store_phone", e.target.value)}
                                        placeholder="0812xxxxxxx"
                                        icon={<IconPhone size={18} />}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Email Bisnis"
                                        type="email"
                                        value={data.store_email}
                                        errors={errors.store_email}
                                        onChange={(e) => setData("store_email", e.target.value)}
                                        placeholder="halo@bisnislo.com"
                                        icon={<IconMail size={18} />}
                                    />
                                    <Input
                                        label="Website / Link Sosial Media"
                                        value={data.store_website}
                                        errors={errors.store_website}
                                        onChange={(e) => setData("store_website", e.target.value)}
                                        placeholder="www.linkbeli.id/toko-lo"
                                        icon={<IconWorld size={18} />}
                                    />
                                </div>

                            </div>

                            <div className="flex justify-end pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <IconDeviceFloppy size={20} />
                                    {processing ? "Menyimpan..." : "Simpan Profil Toko"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Store.layout = (page) => <DashboardLayout children={page} />;