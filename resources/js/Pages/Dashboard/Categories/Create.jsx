import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone"; // Import Komponen Baru
import toast from "react-hot-toast";
import {
    IconCategory,
    IconDeviceFloppy,
    IconArrowLeft,
    IconPhoto,
} from "@tabler/icons-react";

export default function Create() {
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        name: "",
        description: "",
        image: "",
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("categories.store"), {
            onSuccess: () => toast.success("Kategori berhasil ditambahkan"),
            onError: () => toast.error("Gagal menyimpan kategori"),
        });
    };

    return (
        <>
            <Head title="Tambah Kategori Baru" />

            <div className="mb-8">
                <Link
                    href={route("categories.index")}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary-600 mb-3 transition-colors"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Kategori
                </Link>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <IconCategory size={26} className="text-primary-500" />
                    </div>
                    Tambah Kategori Baru
                </h1>
                <p className="text-sm text-slate-500 mt-1 pl-12">Buat kelompok produk baru lo di sini.</p>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl">
                    
                    {/* Sisi Kiri: Media Dropzone (Col 5) */}
                    <div className="lg:col-span-5 space-y-4">
                        <ImageUploadZone 
                            title="Gambar Kategori"
                            icon={IconPhoto}
                            imagePreview={imagePreview}
                            onImageChange={handleImageChange}
                            onImageRemove={() => {
                                setImagePreview(null);
                                setData('image', null);
                            }}
                            error={errors.image}
                        />
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                            <p className="text-[11px] text-blue-600 dark:text-blue-300 leading-relaxed text-center font-medium">
                                Tambahkan ikon atau foto yang merepresentasikan isi kategori ini agar lebih visual di menu kasir.
                            </p>
                        </div>
                    </div>

                    {/* Sisi Kanan: Form Detail (Col 7) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                            <Input
                                type="text"
                                label="Nama Kategori"
                                placeholder="Misal: Makanan, Minuman, Snak..."
                                errors={errors.name}
                                onChange={(e) => setData("name", e.target.value)}
                                value={data.name}
                            />
                            
                            <Textarea
                                label="Deskripsi"
                                placeholder="Tambahkan sedikit penjelasan tentang kategori ini (opsional)..."
                                errors={errors.description}
                                onChange={(e) => setData("description", e.target.value)}
                                value={data.description}
                                rows={5}
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                                <Link
                                    href={route("categories.index")}
                                    className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-10 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-xl shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <IconDeviceFloppy size={18} />
                                    {processing ? "Proses..." : "Simpan Kategori"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;