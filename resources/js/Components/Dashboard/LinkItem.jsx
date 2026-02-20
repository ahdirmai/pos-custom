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

    const isActive = active !== undefined
        ? active
        : (targetPath === '/dashboard'
            ? currentPath === '/dashboard'
            : (currentPath === targetPath || currentPath.startsWith(targetPath + '/')));

    const canAccess = auth.super === true || access === true;
    if (!canAccess) return null;

    if (sidebarOpen) {
        return (
            <Link
                href={href}
                className={`
                    flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                        ? "bg-[#d5f2ee] dark:bg-teal-900/40 text-slate-800 dark:text-teal-300"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                    }
                `}
                {...props}
            >
                <span className={`flex-shrink-0 ${isActive ? "text-slate-700 dark:text-teal-400" : ""}`}>{icon}</span>
                <span className="truncate">{title}</span>
            </Link>
        );
    }

    return (
        <Link
            href={href}
            title={title}
            className={`
                w-10 h-10 flex items-center justify-center rounded-xl
                transition-all duration-200
                ${isActive
                    ? "bg-[#d5f2ee] dark:bg-teal-900/40 text-slate-700 dark:text-teal-400"
                    : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
                }
            `}
            {...props}
        >
            {icon}
        </Link>
    );
}