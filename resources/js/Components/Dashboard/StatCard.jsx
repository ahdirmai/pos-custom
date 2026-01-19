import React from 'react';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

export default function StatCard({ title, value, subtitle, icon: Icon, gradient, trend }) {
    return (
        <div
            className={`
            relative overflow-hidden rounded-2xl p-5
            bg-gradient-to-br ${gradient}
            text-white shadow-lg
        `}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <Icon
                    size={128}
                    strokeWidth={0.5}
                    className="transform translate-x-8 -translate-y-8"
                />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-white/20">
                        <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium opacity-90">
                        {title}
                    </span>
                </div>

                <p className="text-3xl font-bold">{value}</p>

                {subtitle && (
                    <p className="mt-2 text-sm opacity-80 flex items-center gap-1">
                        {trend === "up" && <IconArrowUpRight size={14} />}
                        {trend === "down" && <IconArrowDownRight size={14} />}
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
