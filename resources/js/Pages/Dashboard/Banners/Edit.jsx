import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone";
import toast from "react-hot-toast";
import {
    IconPhoto,
    IconDeviceFloppy,
    IconArrowLeft,
} from "@tabler/icons-react";

export default function Edit({ banner }) {
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        id: banner.id,
        image: null,
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        link: banner.link || '',
        type: banner.type,
        order: banner.order,
        is_active: banner.is_active,
        _method: 'PUT'
    });

    const [imagePreview, setImagePreview] = useState(
        banner.image ? banner.image : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("banners.update", banner.id), {
            onSuccess: () => toast.success("Banner berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui banner"),
        });
    };

    return (
        <>
            <Head title="Edit Banner" />

            <div className="mb-8">
                <Link
                    href={route("banners.index")}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary-600 mb-3 transition-colors"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Banner
                </Link>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <IconPhoto size={26} className="text-primary-500" />
                    </div>
                    Edit Banner
                </h1>
                <p className="text-sm text-slate-500 mt-1 pl-12">{banner.title || 'Banner Tanpa Judul'}</p>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl">
                    
                    {/* Left Side: Media Dropzone (Col 5) */}
                    <div className="lg:col-span-5 space-y-4">
                        <ImageUploadZone 
                            title="Gambar Banner"
                            icon={IconPhoto}
                            imagePreview={imagePreview}
                            onImageChange={handleImageChange}
                            onImageRemove={() => {
                                setImagePreview(null);
                                setData('image', null);
                            }}
                            error={errors.image}
                        />
                        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                             <p className="text-[11px] text-slate-500 leading-relaxed italic text-center">
                                Pastikan gambar yang diunggah sesuai dengan tipe banner yang dipilih (Hero/Promo).
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Form Detail (Col 7) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                            <Input
                                type="text"
                                label="Judul"
                                placeholder="Masukkan judul banner..."
                                errors={errors.title}
                                onChange={(e) => setData("title", e.target.value)}
                                value={data.title}
                            />
                            
                            <Input
                                type="text"
                                label="Subjudul"
                                placeholder="Masukkan subjudul banner..."
                                errors={errors.subtitle}
                                onChange={(e) => setData("subtitle", e.target.value)}
                                value={data.subtitle}
                            />

                             <Input
                                type="text"
                                label="Link Tujuan"
                                placeholder="https://..."
                                errors={errors.link}
                                onChange={(e) => setData("link", e.target.value)}
                                value={data.link}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipe Banner</label>
                                    <select 
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:border-primary-500 focus:ring-primary-500"
                                        value={data.type} 
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        <option value="hero">Hero Banner</option>
                                        <option value="promo">Promo Banner</option>
                                    </select>
                                    {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type}</div>}
                                </div>
                                <Input
                                    type="number"
                                    label="Urutan"
                                    placeholder="0"
                                    errors={errors.order}
                                    onChange={(e) => setData("order", e.target.value)}
                                    value={data.order}
                                />
                            </div>

                            <div className="flex items-center pt-2">
                                <div className="flex items-center h-5">
                                    <input 
                                        id="is_active" 
                                        type="checkbox" 
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                        checked={data.is_active} 
                                        onChange={(e) => setData('is_active', e.target.checked)} 
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="is_active" className="font-medium text-gray-700 dark:text-gray-300">Aktifkan Banner</label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Banner akan ditampilkan jika diaktifkan.</p>
                                </div>
                            </div>


                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <Link
                                    href={route("banners.index")}
                                    className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <IconDeviceFloppy size={18} />
                                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
