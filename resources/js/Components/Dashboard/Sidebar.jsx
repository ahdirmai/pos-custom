import React from "react";
import { usePage } from "@inertiajs/react";
import { IconChevronLeft } from "@tabler/icons-react";
import LinkItem from "@/Components/Dashboard/LinkItem";
import LinkItemDropdown from "@/Components/Dashboard/LinkItemDropdown";
import Menu from "@/Utils/Menu";

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
    const { auth, storeProfile } = usePage().props;
    const menuNavigation = Menu();

    const storeName = storeProfile?.name || "KASIR";
    const storeLogo = storeProfile?.logo || null;
    const storeInitial =
        storeName?.charAt(0)?.toUpperCase() ||
        auth?.user?.name?.charAt(0)?.toUpperCase() ||
        "K";

    const userName = auth?.user?.name || "User";
    const userEmail = auth?.user?.email || "";
    const userAvatar = auth?.user?.avatar || null;

    return (
        <div
            className={`
                ${sidebarOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-[260px]"}
                md:translate-x-0 ${sidebarOpen ? "md:w-[260px]" : "md:w-[72px]"}
                fixed md:relative inset-y-0 left-0 z-40
                flex flex-col h-screen md:h-auto md:self-stretch md:min-h-full overflow-y-auto
                bg-white dark:bg-slate-900
                transition-all duration-300 ease-in-out
            `}
        >
            {/* Logo Header */}
            <div className={`flex items-center h-16 ${sidebarOpen ? "justify-between px-5" : "justify-center"}`}>
                {sidebarOpen ? (
                    <>
                        <div className="flex items-center gap-2.5">
                            {storeLogo ? (
                                <img
                                    src={storeLogo}
                                    alt={storeName}
                                    className="w-9 h-9 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        {storeInitial}
                                    </span>
                                </div>
                            )}
                            <span className="text-lg font-bold text-slate-800 dark:text-white truncate">
                                {storeName}
                            </span>
                        </div>
                        {toggleSidebar && (
                            <button
                                onClick={toggleSidebar}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                            >
                                <IconChevronLeft size={18} />
                            </button>
                        )}
                    </>
                ) : (
                    storeLogo ? (
                        <img
                            src={storeLogo}
                            alt={storeName}
                            className="w-9 h-9 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {storeInitial}
                            </span>
                        </div>
                    )
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
                {menuNavigation.map((section, index) => {
                    const hasPermission = section.details.some(
                        (detail) => detail.permissions === true
                    );
                    if (!hasPermission) return null;

                    return (
                        <div key={index} className="mb-1">
                            {/* Section Title */}
                            {sidebarOpen && (
                                <div className="px-5 py-2 mt-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-600">
                                        {section.title}
                                    </span>
                                </div>
                            )}

                            {/* Divider for collapsed mode */}
                            {!sidebarOpen && index > 0 && (
                                <div className="mx-3 my-2 border-t border-slate-200 dark:border-slate-700"></div>
                            )}

                            {/* Menu Items */}
                            <div
                                className={
                                    sidebarOpen
                                        ? "space-y-0.5"
                                        : "flex flex-col items-center gap-1"
                                }
                            >
                                {section.details.map((detail, idx) => {
                                    if (!detail.permissions) return null;

                                    if (detail.hasOwnProperty("subdetails")) {
                                        return (
                                            <LinkItemDropdown
                                                key={idx}
                                                title={detail.title}
                                                icon={detail.icon}
                                                data={detail.subdetails}
                                                access={detail.permissions}
                                                sidebarOpen={sidebarOpen}
                                            />
                                        );
                                    }

                                    return (
                                        <LinkItem
                                            key={idx}
                                            title={detail.title}
                                            icon={detail.icon}
                                            href={detail.href}
                                            access={detail.permissions}
                                            sidebarOpen={sidebarOpen}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* User Profile Footer */}
            <div className={`border-t border-slate-200/60 dark:border-slate-700 ${sidebarOpen ? "p-4" : "py-4 flex justify-center"}`}>
                {sidebarOpen ? (
                    <div className="flex items-center gap-3">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-700">
                                <span className="text-white font-semibold text-xs">
                                    {userName?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                {userName}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                {userEmail}
                            </p>
                        </div>
                    </div>
                ) : (
                    userAvatar ? (
                        <img
                            src={userAvatar}
                            alt={userName}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-700">
                            <span className="text-white font-semibold text-xs">
                                {userName?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
