import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import InputSelect from "@/Components/Dashboard/InputSelect";
import {
    IconUserPlus,
    IconX,
    IconLoader2,
    IconCheck,
    IconDeviceFloppy
} from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function AddCustomerModal({ isOpen, onClose, onSuccess }) {
    // Mengambil data provinces dari props global Inertia
    const { provinces = [] } = usePage().props;

    // State untuk data form
    const [form, setForm] = useState({
        name: "",
        no_telp: "",
        address: "",
        province_id: "",
        regency_id: "",
        district_id: "",
        village_id: "",
    });

    // State untuk menampung list wilayah
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- LOGIC FETCH WILAYAH ---

    const handleProvinceChange = async (selectedProvince) => {
        const provinceId = selectedProvince ? selectedProvince.code : "";
        setForm(prev => ({
            ...prev,
            province_id: provinceId,
            regency_id: "",
            district_id: "",
            village_id: ""
        }));
        setRegencies([]);
        setDistricts([]);
        setVillages([]);

        if (provinceId) {
            try {
                const res = await axios.get(route("regions.regencies"), {
                    params: { province_id: provinceId },
                });
                setRegencies(res.data);
            } catch (error) {
                console.error("Gagal ambil kabupaten", error);
            }
        }
    };

    const handleRegencyChange = async (selectedRegency) => {
        const regencyId = selectedRegency ? selectedRegency.code : "";
        setForm(prev => ({
            ...prev,
            regency_id: regencyId,
            district_id: "",
            village_id: ""
        }));
        setDistricts([]);
        setVillages([]);

        if (regencyId) {
            try {
                const res = await axios.get(route("regions.districts"), {
                    params: { regency_id: regencyId },
                });
                setDistricts(res.data);
            } catch (error) {
                console.error("Gagal ambil kecamatan", error);
            }
        }
    };

    const handleDistrictChange = async (selectedDistrict) => {
        const districtId = selectedDistrict ? selectedDistrict.code : "";
        setForm(prev => ({
            ...prev,
            district_id: districtId,
            village_id: ""
        }));
        setVillages([]);

        if (districtId) {
            try {
                const res = await axios.get(route("regions.villages"), {
                    params: { district_id: districtId },
                });
                setVillages(res.data);
            } catch (error) {
                console.error("Gagal ambil kelurahan", error);
            }
        }
    };

    const handleVillageChange = (selectedVillage) => {
        setForm(prev => ({ ...prev, village_id: selectedVillage ? selectedVillage.code : "" }));
        if (errors.village_id) {
            setErrors((prev) => ({ ...prev, village_id: null }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // --- SUBMIT ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            // Menggunakan endpoint store yang sama, pastikan backend handle JSON response
            // Jika Anda punya route khusus ajax, ganti 'customers.store' dengan route itu.
            const response = await axios.post(route("customers.store"), form, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Memberitahu Laravel ini AJAX
                    'Accept': 'application/json'
                }
            });
            
            // Handle response sukses
            toast.success("Pelanggan berhasil ditambahkan");
            
            // Reset form
            setForm({
                name: "", no_telp: "", address: "",
                province_id: "", regency_id: "", district_id: "", village_id: ""
            });
            
            setIsSubmitting(false);
            
            // Kirim data balik ke parent (misal untuk auto-select)
            // Backend biasanya return: { message: '...', data: customerObj }
            // Sesuaikan 'response.data.data' dengan struktur return controller Anda
            const newCustomer = response.data.data || response.data; 
            onSuccess?.(newCustomer);
            
            onClose();

        } catch (err) {
            console.error("Add customer error:", err);
            setIsSubmitting(false);

            if (err.response && err.response.status === 422) {
                // Validation Error dari Laravel
                setErrors(err.response.data.errors);
                toast.error("Mohon periksa inputan Anda");
            } else {
                toast.error("Gagal menambahkan pelanggan. Coba lagi.");
            }
        }
    };

    const handleClose = () => {
        setForm({
            name: "", no_telp: "", address: "",
            province_id: "", regency_id: "", district_id: "", village_id: ""
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            {/* 
               Ubah max-w-md menjadi max-w-2xl agar muat 2 kolom dropdown 
               Tambahkan my-auto agar vertikal center
            */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <IconUserPlus size={22} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">
                                Tambah Pelanggan
                            </h3>
                            <p className="text-xs text-primary-100 font-medium">
                                Isi data pelanggan baru
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                    >
                        <IconX size={20} />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Baris 1: Nama & HP */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Nama Pelanggan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nama lengkap"
                                className={`w-full h-11 px-4 rounded-xl border ${
                                    errors.name
                                        ? "border-red-500 focus:ring-red-500/20"
                                        : "border-slate-200 dark:border-slate-700 focus:ring-primary-500/20"
                                } bg-white dark:bg-slate-800 text-sm focus:border-primary-500 focus:ring-4 transition-all`}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                No. Telepon / WA <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="no_telp"
                                value={form.no_telp}
                                onChange={handleChange}
                                placeholder="08xxxxxxxxxx"
                                className={`w-full h-11 px-4 rounded-xl border ${
                                    errors.no_telp
                                        ? "border-red-500 focus:ring-red-500/20"
                                        : "border-slate-200 dark:border-slate-700 focus:ring-primary-500/20"
                                } bg-white dark:bg-slate-800 text-sm focus:border-primary-500 focus:ring-4 transition-all`}
                            />
                            {errors.no_telp && <p className="mt-1 text-xs text-red-500">{errors.no_telp}</p>}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800"></div>

                    {/* Baris 2: Provinsi & Kota */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <InputSelect
                                label="Provinsi"
                                placeholder="Pilih Provinsi"
                                data={provinces}
                                selected={provinces.find(p => p.code == form.province_id) || null}
                                setSelected={handleProvinceChange}
                                errors={errors.province_id}
                                searchable={true}
                                valueKey="code"
                                displayKey="name"
                            />
                        </div>
                        <div>
                            {form.province_id ? (
                                <InputSelect
                                    label="Kota/Kabupaten"
                                    placeholder="Pilih Kota/Kabupaten"
                                    data={regencies}
                                    selected={regencies.find(r => r.code == form.regency_id) || null}
                                    setSelected={handleRegencyChange}
                                    errors={errors.regency_id}
                                    searchable={true}
                                    valueKey="code"
                                    displayKey="name"
                                />
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Kota/Kabupaten
                                    </label>
                                    <div className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm flex items-center text-slate-400">
                                        Pilih Provinsi Dulu
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Baris 3: Kec & Kel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            {form.regency_id ? (
                                <InputSelect
                                    label="Kecamatan"
                                    placeholder="Pilih Kecamatan"
                                    data={districts}
                                    selected={districts.find(d => d.code == form.district_id) || null}
                                    setSelected={handleDistrictChange}
                                    errors={errors.district_id}
                                    searchable={true}
                                    valueKey="code"
                                    displayKey="name"
                                />
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Kecamatan
                                    </label>
                                    <div className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm flex items-center text-slate-400">
                                        Pilih Kota/Kab Dulu
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            {form.district_id ? (
                                <InputSelect
                                    label="Kelurahan"
                                    placeholder="Pilih Kelurahan"
                                    data={villages}
                                    selected={villages.find(v => v.code == form.village_id) || null}
                                    setSelected={handleVillageChange}
                                    errors={errors.village_id}
                                    searchable={true}
                                    valueKey="code"
                                    displayKey="name"
                                />
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Kelurahan
                                    </label>
                                    <div className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm flex items-center text-slate-400">
                                        Pilih Kecamatan Dulu
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Alamat */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Alamat Lengkap <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Nama Jalan, RT/RW, No. Rumah..."
                            rows={2}
                            className={`w-full px-4 py-3 rounded-xl border ${
                                errors.address
                                    ? "border-red-500 focus:ring-red-500/20"
                                    : "border-slate-200 dark:border-slate-700 focus:ring-primary-500/20"
                            } bg-white dark:bg-slate-800 text-sm focus:border-primary-500 focus:ring-4 transition-all resize-none`}
                        />
                        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 h-11 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-primary-500/20 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <IconLoader2 size={20} className="animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <IconDeviceFloppy size={20} />
                                    Simpan Data
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Komponen tombol kecil tambahan (opsional)
export function AddCustomerButton({ onClick, className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`h-12 px-4 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700
                text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30
                font-medium flex items-center gap-2 transition-colors ${className}`}
            title="Tambah pelanggan baru"
        >
            <IconUserPlus size={18} />
            <span className="hidden sm:inline">Tambah</span>
        </button>
    );
}