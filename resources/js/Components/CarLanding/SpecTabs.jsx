import React, { useState } from "react";

const TAB_CONFIG = [
    { key: "performa", label: "Performa" },
    { key: "dimensi", label: "Dimensi" },
    { key: "fitur", label: "Fitur" },
    { key: "baterai_charging", label: "Baterai & Charging" },
];

export default function SpecTabs({ specs = {} }) {
    const availableTabs = TAB_CONFIG.filter(
        (t) => specs[t.key] && Object.keys(specs[t.key]).length > 0,
    );
    const [activeTab, setActiveTab] = useState(availableTabs[0]?.key ?? "performa");

    if (availableTabs.length === 0) return null;

    const activeData = specs[activeTab] ?? {};

    return (
        <div className="w-full">
            {/* Tab buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none mb-6">
                {availableTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-md text-[13px] font-semibold transition-colors whitespace-nowrap ${
                            activeTab === tab.key
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Spec rows */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {Object.entries(activeData).map(([key, value], index) => (
                    <div
                        key={key}
                        className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-5 py-4 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                    >
                        <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide sm:w-48 flex-shrink-0">
                            {key}
                        </span>
                        <span className="text-[14px] text-gray-800 leading-relaxed font-medium">
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
