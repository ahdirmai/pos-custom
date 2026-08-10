import React from "react";
import {
    IconRoute,
    IconUsers,
    IconBolt,
    IconBriefcase,
    IconGauge,
    IconBattery2,
    IconEngine,
    IconLeaf,
    IconShieldCheck,
    IconStar,
    IconCarSuv,
    IconChargingPile,
} from "@tabler/icons-react";

const ICON_MAP = {
    route: IconRoute,
    users: IconUsers,
    bolt: IconBolt,
    briefcase: IconBriefcase,
    gauge: IconGauge,
    battery: IconBattery2,
    engine: IconEngine,
    leaf: IconLeaf,
    shield: IconShieldCheck,
    star: IconStar,
    car: IconCarSuv,
    charging: IconChargingPile,
};

export default function SpecBadge({ icon, label, value, dark = false }) {
    const IconComponent = ICON_MAP[icon] ?? IconStar;

    if (dark) {
        return (
            <div className="flex flex-col items-center gap-2.5 p-5 border border-white/10 rounded-lg text-center">
                <IconComponent size={22} className="text-white/70" stroke={1.5} />
                <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-white leading-snug">{value}</span>
                    <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider leading-none">
                        {label}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-2.5 p-5 border border-gray-200 rounded-lg text-center">
            <IconComponent size={22} className="text-gray-500" stroke={1.5} />
            <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-gray-900 leading-snug">{value}</span>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider leading-none">
                    {label}
                </span>
            </div>
        </div>
    );
}
