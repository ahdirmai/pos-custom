import React, { useEffect, useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import Input from "@/Components/Dashboard/Input";
import InputSelect from "@/Components/Dashboard/InputSelect";
import Textarea from "@/Components/Dashboard/TextArea";
import toast from "react-hot-toast";
import { IconUsers, IconDeviceFloppy, IconArrowLeft } from "@tabler/icons-react";
import axios from "axios";

export default function Edit({ customer }) {
    const { errors, provinces = [], regencies = [], districts = [], villages = [] } = usePage().props;

    const { data, setData, post, processing } = useForm({
        id: customer.id,
        name: customer.name,
        no_telp: customer.no_telp,
        email: customer.account?.email || "", // Add email state
        address: customer.address,
        province_id: customer.province_id || "",
        regency_id: customer.regency_id || "",
        district_id: customer.district_id || "",
        village_id: customer.village_id || "",
        _method: "PUT",
    });

    const [regencyList, setRegencyList] = useState(regencies);
    const [districtList, setDistrictList] = useState(districts);
    const [villageList, setVillageList] = useState(villages);

    const fetchRegencies = async (provinceId) => {
        if (!provinceId) return setRegencyList([]);
        const res = await axios.get(route("regions.regencies"), {
            params: { province_id: provinceId },
        });
        setRegencyList(res.data);
    };

    const fetchDistricts = async (regencyId) => {
        if (!regencyId) return setDistrictList([]);
        const res = await axios.get(route("regions.districts"), {
            params: { regency_id: regencyId },
        });
        setDistrictList(res.data);
    };

    const fetchVillages = async (districtId) => {
        if (!districtId) return setVillageList([]);
        const res = await axios.get(route("regions.villages"), {
            params: { district_id: districtId },
        });
        setVillageList(res.data);
    };

    // Track previous selection to avoid clearing on initial mount
    const prevProvince = React.useRef(null);
    const prevRegency = React.useRef(null);
    const prevDistrict = React.useRef(null);

    useEffect(() => {
        if (data.province_id) {
            if (
                prevProvince.current &&
                prevProvince.current !== data.province_id
            ) {
                setData("regency_id", "");
                setData("district_id", "");
                setData("village_id", "");
                setDistrictList([]);
                setVillageList([]);
            }
            fetchRegencies(data.province_id);
        } else {
            setRegencyList([]);
            setDistrictList([]);
            setVillageList([]);
            setData("regency_id", "");
            setData("district_id", "");
            setData("village_id", "");
        }
        prevProvince.current = data.province_id;
    }, [data.province_id]);

    useEffect(() => {
        if (data.regency_id) {
            if (prevRegency.current && prevRegency.current !== data.regency_id) {
                setData("district_id", "");
                setData("village_id", "");
                setVillageList([]);
            }
            fetchDistricts(data.regency_id);
        } else {
            setDistrictList([]);
            setVillageList([]);
            setData("district_id", "");
            setData("village_id", "");
        }
        prevRegency.current = data.regency_id;
    }, [data.regency_id]);

    useEffect(() => {
        if (data.district_id) {
            if (
                prevDistrict.current &&
                prevDistrict.current !== data.district_id
            ) {
                setData("village_id", "");
            }
            fetchVillages(data.district_id);
        } else {
            setVillageList([]);
            setData("village_id", "");
        }
        prevDistrict.current = data.district_id;
    }, [data.district_id]);

    const submit = (e) => {
        e.preventDefault();
        post(route("customers.update", customer.id), {
            onSuccess: () => toast.success("Pelanggan berhasil diperbarui"),
            onError: () => toast.error("Gagal memperbarui pelanggan"),
        });
    };

    return (
        <>
            <Head title="Edit Pelanggan" />

            <div className="mb-6">
                <Link
                    href={route("customers.index")}
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-3"
                >
                    <IconArrowLeft size={16} />
                    Kembali ke Pelanggan
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <IconUsers size={28} className="text-primary-500" />
                    Edit Pelanggan
                </h1>
                <p className="text-sm text-slate-500 mt-1">{customer.name}</p>
            </div>

            <form onSubmit={submit}>
                <div className="max-w-3xl">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="text"
                                label="Nama Pelanggan"
                                placeholder="Nama lengkap"
                                errors={errors.name}
                                onChange={(e) => setData("name", e.target.value)}
                                value={data.name}
                            />
                            <Input
                                type="text"
                                label="No. Handphone"
                                placeholder="08xxxxxxxxxx"
                                errors={errors.no_telp}
                                onChange={(e) => setData("no_telp", e.target.value)}
                                value={data.no_telp}
                            />
                             <div className="col-span-1 md:col-span-2">
                                <Input
                                    type="email"
                                    label="Email Login"
                                    placeholder="Update email login"
                                    errors={errors.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    value={data.email}
                                />
                                <p className="text-sm text-slate-500 italic mt-1">
                                    *Mengubah email akan mengubah akun login user terkait.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputSelect
                                    label="Provinsi"
                                    placeholder="Pilih Provinsi"
                                    data={provinces}
                                    selected={provinces.find(p => p.code == data.province_id) || null}
                                    setSelected={(val) => setData("province_id", val ? val.code : "")}
                                    errors={errors.province_id}
                                    searchable={true}
                                    valueKey="code"
                                    displayKey="name"
                                />
                            </div>
                            <div>
                                <InputSelect
                                    label="Kota/Kabupaten"
                                    placeholder="Pilih Kota/Kabupaten"
                                    data={regencyList}
                                    selected={regencyList.find(r => r.code == data.regency_id) || null}
                                    setSelected={(val) => setData("regency_id", val ? val.code : "")}
                                    errors={errors.regency_id}
                                    searchable={true}
                                    valueKey="code"
                                    displayKey="name"
                                    disabled={!data.province_id}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputSelect
                                    label="Kecamatan"
                                    placeholder="Pilih Kecamatan"
                                    data={districtList}
                                    selected={districtList.find(d => d.code == data.district_id) || null}
                                    setSelected={(val) => setData("district_id", val ? val.code : "")}
                                    errors={errors.district_id}
                                    searchable={true}
                                    valueKey="code"
                                    displayKey="name"
                                    disabled={!data.regency_id}
                                />
                            </div>
                            <div>
                                <InputSelect
                                    label="Kelurahan"
                                    placeholder="Pilih Kelurahan"
                                    data={villageList}
                                    selected={villageList.find(v => v.code == data.village_id) || null}
                                    setSelected={(val) => setData("village_id", val ? val.code : "")}
                                    errors={errors.village_id}
                                    searchable={true}
                                    valueKey="code"
                                    displayKey="name"
                                    disabled={!data.district_id}
                                />
                            </div>
                        </div>
                        <Textarea
                            label="Alamat Detail"
                            placeholder="Alamat lengkap"
                            errors={errors.address}
                            onChange={(e) => setData("address", e.target.value)}
                            value={data.address}
                            rows={3}
                        />
                    </div>

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
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors disabled:opacity-50"
                        >
                            <IconDeviceFloppy size={18} />
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

Edit.layout = (page) => <DashboardLayout children={page} />;
