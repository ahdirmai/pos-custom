import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import { IconSearch, IconCalculator, IconTruck, IconBox, IconMapPin } from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function Test({ auth }) {
    const { flash } = usePage().props;
    const [result, setResult] = useState(null);
    const [destination, setDestination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    
    const { data, setData, post, processing, errors } = useForm({
        destination_postal_code: "",
        weight: "1000",
    });

    const submit = (e) => {
        e.preventDefault();
        setResult(null);
        setDestination(null);
        setCurrentPage(1);
        post(route("settings.shipping.check-rates"), {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash.rates) {
                    setResult(page.props.flash.rates);
                }
                if (page.props.flash.destination) {
                    setDestination(page.props.flash.destination);
                }
                if (page.props.flash.rates || page.props.flash.destination) {
                    toast.success("Ongkir berhasil dicek!");
                }
            },
            onError: () => toast.error("Gagal cek ongkir"),
        });
    };

    return (
        <>
            <Head title="Test Ongkir" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                        <IconCalculator className="text-primary-500" size={28} />
                        Testing Ongkir
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Halaman ini digunakan untuk menguji koneksi API Biteship dan melihat estimasi tarif pengiriman.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
                    <div className="lg:col-span-5 space-y-6">
                        <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                             <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                    Simulasi Pengiriman
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Kode Pos Tujuan"
                                    value={data.destination_postal_code}
                                    errors={errors.destination_postal_code}
                                    onChange={(e) => setData("destination_postal_code", e.target.value)}
                                    placeholder="Contoh: 12345"
                                    type="number"
                                    icon={<IconSearch size={18} />}
                                />

                                <Input
                                    label="Berat Paket (Gram)"
                                    value={data.weight}
                                    errors={errors.weight}
                                    onChange={(e) => setData("weight", e.target.value)}
                                    placeholder="1000"
                                    type="number"
                                    icon={<IconBox size={18} />}
                                />

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-50 mt-4"
                                >
                                    {processing ? "Memuat..." : "Cek Tarif"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-7">
                        {destination && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary-200 dark:border-primary-800 p-5 mb-6 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <IconMapPin size={100} className="text-primary-500" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <IconMapPin size={14} />
                                        Lokasi Tujuan
                                    </h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Provinsi</p>
                                            <p className="font-bold text-slate-800 dark:text-white">{destination.administrative_division_level_1_name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Kota/Kabupaten</p>
                                            <p className="font-bold text-slate-800 dark:text-white">{destination.administrative_division_level_2_name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Kecamatan</p>
                                            <p className="font-bold text-slate-800 dark:text-white">{destination.administrative_division_level_3_name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Kelurahan</p>
                                            <p className="font-bold text-slate-800 dark:text-white">{destination.administrative_division_level_4_name || '-'}</p>
                                        </div>
                                         <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Kode Pos</p>
                                            <p className="font-bold text-slate-800 dark:text-white">{destination.postal_code || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {result && result.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 dark:text-white mb-4">
                                    Hasil Pencarian ({result.length} Kurir)
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((rate, index) => (
                                        <div key={index} className="flex flex-col justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg dark:hover:shadow-primary-900/10 transition-all duration-200 group relative overflow-hidden">
                                            
                                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <IconTruck size={64} className="text-slate-800 dark:text-white" />
                                            </div>

                                            <div className="relative z-10 mb-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                                                        {rate.company === 'jne' ? (
                                                            <img src="https://biteship.com/static/images/couriers/jne.png" alt="JNE" className="w-full h-full object-contain p-1" />
                                                        ) : rate.company === 'sicepat' ? (
                                                            <img src="https://biteship.com/static/images/couriers/sicepat.png" alt="SiCepat" className="w-full h-full object-contain p-1" />
                                                        ) : rate.company === 'jnt' ? (
                                                            <img src="https://biteship.com/static/images/couriers/jnt.png" alt="J&T" className="w-full h-full object-contain p-1" />
                                                        ) : rate.company === 'grab' ? (
                                                            <img src="https://biteship.com/static/images/couriers/grab.png" alt="Grab" className="w-full h-full object-contain p-1" />
                                                        ) : rate.company === 'gojek' ? (
                                                            <img src="https://biteship.com/static/images/couriers/gojek.png" alt="Gojek" className="w-full h-full object-contain p-1" />
                                                        ) : (
                                                            <IconTruck size={20} className="text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-base leading-tight">
                                                            {rate.company}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-1">
                                                            {rate.courier_service_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                                    <span className="font-medium">Estimasi:</span>
                                                    <span className="text-slate-700 dark:text-slate-300">{rate.duration || '-'}</span>
                                                </div>
                                            </div>

                                            <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Ongkir</p>
                                                    <p className="font-extrabold text-xl text-primary-600 dark:text-primary-400">
                                                        Rp {rate.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {result.length > itemsPerPage && (
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-sm text-slate-500">
                                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, result.length)} dari {result.length} opsi
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            >
                                                Sebelumnya
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(Math.ceil(result.length / itemsPerPage), p + 1))}
                                                disabled={currentPage === Math.ceil(result.length / itemsPerPage)}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            >
                                                Selanjutnya
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : result !== null ? (
                            <div className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-slate-500 font-medium">Tidak ada kurir ditemukan</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center px-6">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3">
                                    <IconSearch className="text-slate-400" size={32} />
                                </div>
                                <p className="text-slate-500 font-medium">Silakan masukkan kode pos dan berat untuk melihat tarif.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}



Test.layout = (page) => <DashboardLayout children={page} />;
