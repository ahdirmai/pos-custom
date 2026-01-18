import React, { useState } from "react";
import { Head, usePage, useForm, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {
    IconUserEdit,
    IconDeviceFloppy,
    IconArrowLeft,
    IconShield,
    IconUser,
    IconMail,
    IconLock,
} from "@tabler/icons-react";
import Input from "@/Components/Dashboard/Input";
import Checkbox from "@/Components/Dashboard/Checkbox";
import ImageUploadZone from "@/Components/Dashboard/ImageUploadZone";
import toast from "react-hot-toast";

export default function Edit() {
    const { roles, user } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        selectedRoles: user.roles.map((role) => role.name),
        avatar: null,
        _method: "PUT",
    });

    const [avatarPreview, setAvatarPreview] = useState(user.avatar || null);

    const setSelectedRoles = (e) => {
        let items = [...data.selectedRoles];
        if (items.includes(e.target.value)) {
            items = items.filter((name) => name !== e.target.value);
        } else {
            items.push(e.target.value);
        }
        setData("selectedRoles", items);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("avatar", file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleImageRemove = () => {
        setData("avatar", null);
        setAvatarPreview(null);
        // Note: Backend logic for deleting existing avatar depends on how it handles null vs undefined.
        // Usually separate flag is needed for explicit deletion if not replacing.
        // For now, this just clears the preview/input.
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("users.update", user.id), {
            onSuccess: () => toast.success("Pengguna berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui pengguna"),
        });
    };

    return (
        <>
            <Head title="Edit Pengguna" />

            <div className="mb-6">
                <Link
                    href={route("users.index")}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-3 transition-colors"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Pengguna
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
                        <IconUserEdit size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Edit Pengguna
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {user.name} • {user.email}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Account Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <IconUser size={20} className="text-primary-500" />
                            Informasi Akun
                        </h3>
                        
                        <div className="space-y-5">
                            <Input
                                type="text"
                                label="Nama Lengkap"
                                placeholder="Nama pengguna"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                errors={errors.name}
                                icon={<IconUser size={20} />}
                            />
                            
                            <Input
                                type="email"
                                label="Alamat Email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                errors={errors.email}
                                disabled
                                className="opacity-60 bg-slate-50 dark:bg-slate-800"
                                icon={<IconMail size={20} />}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    type="password"
                                    label="Kata Sandi Baru"
                                    placeholder="Kosongkan jika tidak diubah"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    errors={errors.password}
                                    icon={<IconLock size={20} />}
                                />
                                <Input
                                    type="password"
                                    label="Konfirmasi Kata Sandi"
                                    placeholder="Ulangi kata sandi baru"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    errors={errors.password_confirmation}
                                    icon={<IconLock size={20} />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Roles */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <IconShield size={20} className="text-primary-500" />
                            Akses Group & Peran
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {roles.map((role, i) => (
                                <label
                                    key={i}
                                    className={`flex items-center gap-3 px-5 py-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                        data.selectedRoles.includes(role.name)
                                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm"
                                            : "border-slate-200 dark:border-slate-700 hover:border-primary-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    <Checkbox
                                        value={role.name}
                                        onChange={setSelectedRoles}
                                        checked={data.selectedRoles.includes(role.name)}
                                    />
                                    <div>
                                        <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">
                                            {role.name}
                                        </span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Akses sebagai {role.name}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.selectedRoles && (
                            <p className="text-sm text-red-500 mt-3 flex items-center gap-1">
                                <IconShield size={16} /> {errors.selectedRoles}
                            </p>
                        )}
                    </div>
                </div>

                <div className="contents lg:block lg:col-span-1 lg:space-y-6">
                    {/* Avatar Upload */}
                    <div className="order-first lg:order-none w-full">
                        <ImageUploadZone
                            title="Foto Profil"
                            imagePreview={avatarPreview}
                            onImageChange={handleImageChange}
                            onImageRemove={handleImageRemove}
                            error={errors.avatar}
                        />
                    </div>

                    {/* Action Card */}
                    <div className="order-last lg:order-none w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                            Aksi
                        </h3>
                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all disabled:opacity-70 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
                            >
                                <IconDeviceFloppy size={20} />
                                {processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </button>
                            <Link
                                href={route("users.index")}
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
