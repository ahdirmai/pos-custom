import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    IconShoppingCart,
    IconUser,
    IconMail,
    IconLock,
    IconEye,
    IconEyeOff,
    IconLoader2,
} from "@tabler/icons-react";

export default function Register({ store_name, store_logo }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <>
            <Head title="Daftar" />

            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center mb-6">
                            {store_logo ? (
                                <img
                                    src={'/storage/' + store_logo}
                                    alt={store_name}
                                    className="w-20 h-20 object-contain rounded-xl"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                    <IconShoppingCart
                                        size={32}
                                        className="text-white"
                                    />
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {store_name || "Aplikasi Kasir"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Buat akun baru untuk mulai berbelanja
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <IconUser size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Nama Anda"
                                    className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 ${errors.name
                                            ? "border-danger-500 focus:border-danger-500"
                                            : "border-slate-200 dark:border-slate-700 focus:border-primary-500"
                                        } bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-primary-500/20 transition-all`}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-sm text-danger-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <IconMail size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="nama@email.com"
                                    className={`w-full h-12 pl-12 pr-4 rounded-xl border-2 ${errors.email
                                            ? "border-danger-500 focus:border-danger-500"
                                            : "border-slate-200 dark:border-slate-700 focus:border-primary-500"
                                        } bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-primary-500/20 transition-all`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-danger-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <IconLock size={20} />
                                </div>
                                <input
                                    type={
                                        showPassword ? "text" : "password"
                                    }
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Minimal 8 karakter"
                                    className={`w-full h-12 pl-12 pr-12 rounded-xl border-2 ${errors.password
                                            ? "border-danger-500 focus:border-danger-500"
                                            : "border-slate-200 dark:border-slate-700 focus:border-primary-500"
                                        } bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-primary-500/20 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <IconEyeOff size={20} />
                                    ) : (
                                        <IconEye size={20} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-danger-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <IconLock size={20} />
                                </div>
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ulangi password"
                                    className={`w-full h-12 pl-12 pr-12 rounded-xl border-2 ${errors.password_confirmation
                                            ? "border-danger-500 focus:border-danger-500"
                                            : "border-slate-200 dark:border-slate-700 focus:border-primary-500"
                                        } bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-primary-500/20 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <IconEyeOff size={20} />
                                    ) : (
                                        <IconEye size={20} />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1.5 text-sm text-danger-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                        >
                            {processing ? (
                                <>
                                    <IconLoader2
                                        size={20}
                                        className="animate-spin"
                                    />
                                    Memproses...
                                </>
                            ) : (
                                "Daftar Sekarang"
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                            Sudah punya akun?{" "}
                            <Link
                                href={route("login")}
                                className="text-primary-500 hover:text-primary-600 font-semibold transition-colors"
                            >
                                Masuk disini
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
