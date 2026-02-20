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
    }, [hasActiveChild, url]);

    const canAccess = auth.super === true || access === true;
    if (!canAccess) return null;

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center font-medium gap-x-3 mx-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 text-sm justify-between
                    ${hasActiveChild
                        ? 'bg-[#d5f2ee] dark:bg-teal-900/40 text-slate-800 dark:text-teal-300'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                `}
                style={{ width: 'calc(100% - 1.5rem)' }}
            >
                <div className='flex items-center gap-x-3'>
                    <span className={`flex-shrink-0 ${hasActiveChild ? 'text-slate-700 dark:text-teal-400' : ''}`}>{icon}</span>
                    {sidebarOpen && title}
                </div>
                {sidebarOpen && (isOpen ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />)}
            </button>

            {isOpen && sidebarOpen && data.map((item, i) => (
                item.permissions && (
                    <Link
                        key={i}
                        href={item.href}
                        className={`
                            flex items-center gap-x-3 ml-8 mr-3 px-3 py-2 rounded-lg text-sm
                            transition-all duration-200
                            ${checkIsActive(item)
                                ? 'bg-[#d5f2ee]/70 dark:bg-teal-900/30 text-slate-800 dark:text-teal-300'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }
                        `}
                    >
                        <IconCornerDownRight size={16} />
                        {item.title}
                    </Link>
                )
            ))}
        </div>
    );
}