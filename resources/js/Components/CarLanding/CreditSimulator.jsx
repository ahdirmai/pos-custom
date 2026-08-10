import React, { useState, useMemo } from "react";
import { IconCalculator, IconShoppingCart } from "@tabler/icons-react";

const TENORS = [12, 24, 36, 48];

const formatRp = (val) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(val);

export default function CreditSimulator({ basePrice = 0, onBuyNow }) {
    const [dpPercent, setDpPercent] = useState(20);
    const [tenor, setTenor] = useState(36);

    const { dpAmount, loanAmount, monthlyInstallment } = useMemo(() => {
        const dp = Math.round((dpPercent / 100) * basePrice);
        const loan = basePrice - dp;
        // Simple flat-rate estimate: ~0.8% per month
        const monthly = loan > 0 ? Math.round((loan * 1.008 ** tenor) / tenor) : 0;
        return { dpAmount: dp, loanAmount: loan, monthlyInstallment: monthly };
    }, [dpPercent, tenor, basePrice]);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <IconCalculator size={22} className="text-gray-600" />
                </div>
                <div>
                    <h3 className="text-[16px] font-bold text-gray-900">Simulasi Kredit</h3>
                    <p className="text-[12px] text-gray-400">
                        Estimasi flat — bukan penawaran resmi bank
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* DP Slider */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[13px] font-semibold text-gray-700">
                            Uang Muka (DP)
                        </label>
                        <span className="text-[13px] font-bold text-gray-900">{dpPercent}%</span>
                    </div>
                    <input
                        type="range"
                        min={10}
                        max={70}
                        step={5}
                        value={dpPercent}
                        onChange={(e) => setDpPercent(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-primary-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                        <span>10%</span>
                        <span className="font-semibold text-gray-600">{formatRp(dpAmount)}</span>
                        <span>70%</span>
                    </div>
                </div>

                {/* Tenor */}
                <div>
                    <label className="text-[13px] font-semibold text-gray-700 block mb-2">
                        Tenor
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {TENORS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTenor(t)}
                                className={`py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                                    tenor === t
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {t} bln
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Result card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">
                            Harga Unit
                        </p>
                        <p className="text-[13px] font-bold text-gray-800">{formatRp(basePrice)}</p>
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">
                            Pokok Kredit
                        </p>
                        <p className="text-[13px] font-bold text-gray-800">
                            {formatRp(loanAmount)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-1">
                            Tenor
                        </p>
                        <p className="text-[13px] font-bold text-gray-800">{tenor} bulan</p>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-4 pt-4 text-center">
                    <p className="text-[12px] text-gray-500 mb-1">Estimasi Cicilan / Bulan</p>
                    <p className="text-[28px] font-black text-gray-900 tracking-tight">
                        {formatRp(monthlyInstallment)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                        *) Estimasi kasar flat-rate. Angka final bergantung kebijakan bank/leasing.
                    </p>
                </div>
            </div>

            <button
                onClick={onBuyNow}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-gray-900 hover:bg-gray-700 text-white font-bold text-[14px] transition-colors"
            >
                <IconShoppingCart size={18} />
                Beli Sekarang / Proses Pembelian
            </button>
        </div>
    );
}
