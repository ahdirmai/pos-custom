import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { IconChevronDown, IconChevronUp, IconCornerDownRight } from '@tabler/icons-react';

export default function LinkItemDropdown({ icon, title, data, access, sidebarOpen, ...props }) {
    const { url } = usePage();
    const { auth } = usePage().props;

    const getPathName = (urlString) => {
        try {
            const path = urlString.startsWith('http') ? new URL(urlString).pathname : urlString.split('?')[0];
            return path.length > 1 ? path.replace(/\/$/, "") : path;
        } catch { return urlString; }
    };

    const currentPath = getPathName(url);

    const checkIsActive = (item) => {
        if (item.active !== undefined) return item.active;
        const targetPath = getPathName(item.href);
        return targetPath === '/dashboard' 
            ? currentPath === '/dashboard' 
            : (currentPath === targetPath || currentPath.startsWith(targetPath + '/'));
    };

    const hasActiveChild = data.some(item => item.permissions && checkIsActive(item));
    const [isOpen, setIsOpen] = useState(hasActiveChild);

    useEffect(() => {
        if (hasActiveChild) setIsOpen(true);
    }, [hasActiveChild, url]); // Re-check saat URL berubah

    const canAccess = auth.super === true || access === true;
    if (!canAccess) return null;

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`min-w-full flex items-center font-medium gap-x-3.5 px-4 py-2.5 transition-all duration-200 text-sm justify-between ${
                    hasActiveChild ? 'bg-primary-50 text-primary-700 border-l-[3px] border-primary-500' : 'text-slate-600 hover:bg-slate-100 border-l-[3px] border-transparent'
                }`}
            >
                <div className='flex items-center gap-x-3.5'>
                    <span className={hasActiveChild ? 'text-primary-600' : ''}>{icon}</span>
                    {sidebarOpen && title}
                </div>
                {sidebarOpen && (isOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />)}
            </button>
            
            {isOpen && sidebarOpen && data.map((item, i) => (
                item.permissions && (
                    <Link
                        key={i}
                        href={item.href}
                        className={`min-w-full flex items-center gap-x-3.5 px-5 py-2.5 text-sm transition-all ${
                            checkIsActive(item) ? 'bg-primary-100 text-primary-800 border-l-[3px] border-primary-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <IconCornerDownRight size={18} />
                        {item.title}
                    </Link>
                )
            ))}
        </div>
    );
}