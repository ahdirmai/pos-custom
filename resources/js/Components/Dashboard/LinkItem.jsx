import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function LinkItem({
    href,
    icon,
    access,
    title,
    sidebarOpen,
    active, // Prop active dari Menu.jsx
    ...props
}) {
    const { url } = usePage();
    const { auth } = usePage().props;

    // Helper untuk mengambil path saja tanpa query string (?...)
    const getPathName = (urlString) => {
        try {
            const path = urlString.startsWith('http')
                ? new URL(urlString).pathname
                : urlString.split('?')[0];
            // Hapus trailing slash jika ada (kecuali root /)
            return path.length > 1 ? path.replace(/\/$/, "") : path;
        } catch {
            return urlString;
        }
    };

    const currentPath = getPathName(url);
    const targetPath = getPathName(href);

    /**
     * LOGIKA ACTIVE:
     * 1. Jika prop 'active' dikirim dari Menu.jsx, gunakan itu (Prioritas Utama).
     * 2. Jika target adalah dashboard, harus exact match.
     * 3. Untuk menu lain (Produk, Kategori), gunakan startsWith agar halaman 
     * /create atau /edit tetap membuat menu induk aktif.
     */
    const isActive = active !== undefined
        ? active
        : (targetPath === '/dashboard'
            ? currentPath === '/dashboard'
            : (currentPath === targetPath || currentPath.startsWith(targetPath + '/')));

    const canAccess = auth.super === true || access === true;
    if (!canAccess) return null;

    const baseClasses = `flex items-center gap-3 transition-all duration-200 text-slate-600 dark:text-slate-400`;
    const activeClasses = isActive
        ? "bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 border-l-[3px] border-primary-500"
        : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-l-[3px] border-transparent";

    if (sidebarOpen) {
        return (
            <Link href={href} className={`${baseClasses} ${activeClasses} px-4 py-2.5 text-sm font-medium`} {...props}>
                <span className={isActive ? "text-primary-600 dark:text-primary-400" : ""}>{icon}</span>
                <span className="truncate">{title}</span>
            </Link>
        );
    }

    return (
        <Link
            href={href}
            title={title}
            className={`w-full flex justify-center py-3 transition-all duration-200 ${isActive ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
            {...props}
        >
            {icon}
        </Link>
    );
}