import React, { useState, useEffect, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
    IconBell,
    IconDots,
    IconCircleCheck,
    IconPackage,
    IconReceipt,
    IconCurrencyDollar,
    IconX,
} from "@tabler/icons-react";
import { usePage, router } from "@inertiajs/react";

export default function Notification() {
    const {
        lowStockNotifications = [],
        receivableNotifications = [],
        payableNotifications = [],
    } = usePage().props;

    const mapItems = (items) =>
        items.map((item) => ({
            ...item,
            type: item.type || "stock",
            icon:
                item.type === "receivable" ? (
                    <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                        <IconReceipt size={18} strokeWidth={1.5} />
                    </span>
                ) : item.type === "payable" ? (
                    <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <IconCurrencyDollar size={18} strokeWidth={1.5} />
                    </span>
                ) : (
                    <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                        <IconPackage size={18} strokeWidth={1.5} />
                    </span>
                ),
        }));

    const mergeData = () => [
        ...mapItems(
            lowStockNotifications.map((n) => ({
                ...n,
                id: `stock-${n.id}`,
                originalId: n.id,
                title: `Stok habis: ${n.title}`,
                subtitle: `Stok: ${n.stock}`,
                type: "stock",
            }))
        ),
        ...mapItems(
            receivableNotifications.map((n) => ({
                ...n,
                id: `recv-${n.id}`,
                type: "receivable",
            }))
        ),
        ...mapItems(
            payableNotifications.map((n) => ({
                ...n,
                id: `pay-${n.id}`,
                type: "payable",
            }))
        ),
    ];

    const [data, setData] = useState(mergeData());
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef(null);

    const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousedown", handleClickOutside);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setData(mergeData());
    }, [lowStockNotifications, receivableNotifications, payableNotifications]);

    const handleMarkRead = (id) => {
        setData((prev) => prev.filter((item) => item.id !== id));
        const item = data.find((d) => d.id === id);
        if (item?.type === "stock") {
            router.post(
                route("notifications.stock.read"),
                { product_id: item.originalId || id },
                { preserveScroll: true, preserveState: true }
            );
        }
    };

    const handleMarkAllRead = () => {
        setData([]);
        router.post(
            route("notifications.stock.readAll"),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const badgeCount = data.length;

    const NotificationList = () => (
        <div className="flex flex-col gap-2 md:gap-3">
            {badgeCount === 0 && (
                <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                    Tidak ada notifikasi
                </div>
            )}
            {data.map((item) => (
                <div
                    className="flex items-start gap-2.5 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm transition-all group"
                    key={item.id}
                >
                    {item.icon}
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-700 dark:text-slate-200 truncate">
                            {item.title}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs truncate">
                            {item.subtitle} {item.time && `• ${item.time}`}
                        </div>
                    </div>
                    <button
                        onClick={() => handleMarkRead(item.id)}
                        className="flex-shrink-0 p-1.5 md:p-2 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                        title="Tandai dibaca"
                    >
                        <IconCircleCheck size={18} strokeWidth={1.5} />
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <>
            {!isMobile ? (
                <Menu className="relative z-50" as="div">
                    <Menu.Button className="relative flex items-center rounded-2xl px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-sm transition-all group">
                        {badgeCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-md bg-rose-500 text-white border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                                {badgeCount > 99 ? '99+' : badgeCount}
                            </span>
                        )}
                        <IconBell
                            strokeWidth={1.5}
                            size={22}
                            className="text-slate-700 dark:text-slate-400"
                        />
                    </Menu.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-[480px] max-w-[94vw] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl overflow-hidden">
                            <div className="flex justify-between items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                    Notifikasi
                                </h3>
                                {badgeCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                                    >
                                        Tandai semua dibaca
                                    </button>
                                )}
                            </div>
                            <div className="p-3 max-h-[480px] overflow-y-auto">
                                <NotificationList />
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            ) : (
                <div ref={notificationRef}>
                    <button
                        className="relative flex items-center rounded-xl p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-sm transition-all"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {badgeCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[9px] font-bold rounded-md bg-rose-500 text-white border-2 border-white dark:border-slate-900">
                                {badgeCount > 99 ? '99+' : badgeCount}
                            </span>
                        )}
                        <IconBell strokeWidth={1.5} size={20} className="text-slate-700 dark:text-slate-400" />
                    </button>

                    {/* Mobile Sidebar */}
                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className={`fixed top-0 right-0 z-50 w-full max-w-sm h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 ${
                            isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        <div className="flex justify-between items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                                Notifikasi
                            </h3>
                            <div className="flex items-center gap-2">
                                {badgeCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                                    >
                                        Semua
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <IconX size={20} strokeWidth={1.5} className="text-slate-600 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>
                        <div className="p-3 overflow-y-auto h-[calc(100vh-64px)]">
                            <NotificationList />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}