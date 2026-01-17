import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import Textarea from "@/Components/Dashboard/TextArea";
import toast from "react-hot-toast";
import {
    IconUsers,
    IconDeviceFloppy,
    IconArrowLeft,
} from "@tabler/icons-react";
import axios from "axios";

export default function Create() {
    // Mengambil props dari backend (pastikan controller mengirim 'provinces')
    const { errors, provinces = [] } = usePage().props;

    // State form menggunakan Inertia useForm
    const { data, setData, post, processing } = useForm({
        name: "",
        no_telp: "",
        address: "",
        province_id: "",
        regency_id: "",
        district_id: "",
        village_id: "",
    });

    // State lokal untuk menampung opsi dropdown wilayah
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // --- LOGIC FETCH DATA WILAYAH ---

    // 1. Handle Ganti Provinsi
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        
        // Reset state di bawahnya & set nilai baru
        setData(currentData => ({
            ...currentData,
            province_id: provinceId,
            regency_id: "",
            district_id: "",
            village_id: ""
        }));

        // Reset opsi dropdown anak
        setRegencies([]);
        setDistricts([]);
        setVillages([]);

        // Fetch Kota/Kabupaten jika provinsi dipilih
        if (provinceId) {
            try {
                const res = await axios.get(route("regions.regencies"), {
                    params: { province_id: provinceId },
                });
                setRegencies(res.data);
            } catch (error) {
                console.error("Gagal mengambil data kabupaten", error);
            }
        }
    };

    // 2. Handle Ganti Kota/Kabupaten
    const handleRegencyChange = async (e) => {
        const regencyId = e.target.value;

        setData(currentData => ({
            ...currentData,
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
                console.error("Gagal mengambil data kecamatan", error);
            }
        }
    };

    // 3. Handle Ganti Kecamatan
    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;

        setData(currentData => ({
            ...currentData,
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
                console.error("Gagal mengambil data kelurahan", error);
            }
        }
    };

    // 4. Handle Ganti Kelurahan
    const handleVillageChange = (e) => {
        setData("village_id", e.target.value);
    };

    // --- SUBMIT FORM ---
    const submit = (e) => {
        e.preventDefault();
        post(route("customers.store"), {
            onSuccess: () => toast.success("Pelanggan berhasil ditambahkan"),
            onError: () => toast.error("Gagal menyimpan data, periksa kembali inputan."),
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Tambah Pelanggan" />

            <div className="mb-6">
                <Link
                    href={route("customers.index")}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-3 transition-colors"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Pelanggan
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <IconUsers size={28} className="text-primary-500" />
                    Tambah Pelanggan Baru
                </h1>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-4xl">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                        
                        {/* Section Informasi Pribadi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                type="text"
                                label="Nama Pelanggan Baru"
                                placeholder="Masukkan nama lengkap"
                                errors={errors.name}
                                onChange={(e) => setData("name", e.target.value)}
                                value={data.name}
                            />
                            <Input
                                type="number"
                                label="No. Handphone / WA"
                                placeholder="08xxxxxxxxxx"
                                errors={errors.no_telp}
                                onChange={(e) => setData("no_telp", e.target.value)}
                                value={data.no_telp}
                            />
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800" />

                        {/* Section Wilayah Domisili */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                                Alamat Domisili
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Provinsi */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Provinsi
                                    </label>
                                    <select
                                        value={data.province_id}
                                        onChange={handleProvinceChange}
                                        className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm focus:border-primary-500 focus:ring-primary-500"
                                    >
                                        <option value="">Pilih Provinsi</option>
                                        {provinces.map((prov) => (
                                            <option key={prov.code} value={prov.code}>
                                                {prov.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.province_id && (
                                        <p className="text-xs text-red-500 mt-1">{errors.province_id}</p>
                                    )}
                                </div>

                                {/* Kota/Kabupaten */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Kota/Kabupaten
                                    </label>
                                    <select
                                        value={data.regency_id}
                                        onChange={handleRegencyChange}
                                        className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!data.province_id}
                                    >
                                        <option value="">Pilih Kota/Kabupaten</option>
                                        {regencies.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.regency_id && (
                                        <p className="text-xs text-red-500 mt-1">{errors.regency_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kecamatan */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Kecamatan
                                    </label>
                                    <select
                                        value={data.district_id}
                                        onChange={handleDistrictChange}
                                        className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!data.regency_id}
                                    >
                                        <option value="">Pilih Kecamatan</option>
                                        {districts.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district_id && (
                                        <p className="text-xs text-red-500 mt-1">{errors.district_id}</p>
                                    )}
                                </div>

                                {/* Kelurahan */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Kelurahan / Desa
                                    </label>
                                    <select
                                        value={data.village_id}
                                        onChange={handleVillageChange}
                                        className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!data.district_id}
                                    >
                                        <option value="">Pilih Kelurahan</option>
                                        {villages.map((item) => (
                                            <option key={item.code} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.village_id && (
                                        <p className="text-xs text-red-500 mt-1">{errors.village_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Alamat Lengkap */}
                            <Textarea
                                label="Alamat Lengkap (Jalan, RT/RW, No. Rumah)"
                                placeholder="Cth: Jl. Mawar No. 12, RT 05 RW 02"
                                errors={errors.address}
                                onChange={(e) => setData("address", e.target.value)}
                                value={data.address}
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <Link
                            href={route("customers.index")}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors disabled:opacity-50 shadow-lg shadow-primary-500/20"
                        >
                            <IconDeviceFloppy size={18} />
                            {processing ? "Menyimpan..." : "Simpan Data"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

Create.layout = (page) => <DashboardLayout children={page} />;
