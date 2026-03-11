import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CheckoutIndex({ carts, subtotal, totalWeight, provinces = [], savedAddresses = [], initialVouchers = [], availableVouchers = [] }) {
    const { auth } = usePage().props;

    // Address Management State
    const [useMode, setUseMode] = useState(savedAddresses.length > 0 ? 'saved' : 'new'); // 'saved' or 'new'
    const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
    const [saveNewAddress, setSaveNewAddress] = useState(false);

    // Laravolt Region State
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        recipient_name: auth.user.name || '',
        phone_number: '',
        address: '',
        province_code: '',
        city_code: '',
        district_code: '',
        village_code: '',
        postal_code: '',
        shipping_courier: '',
        shipping_service: '',
        shipping_cost: 0,
        voucher_codes: [],
        paymentMethod: 'manual_transfer',
        payment_proof: null,
        save_address: false,
        address_label: ''
    });

    const [couriers, setCouriers] = useState([]);
    const [loadingRates, setLoadingRates] = useState(false);

    // Voucher State
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVouchers, setAppliedVouchers] = useState([]);
    const [checkingVoucher, setCheckingVoucher] = useState(false);

    useEffect(() => {
        if (initialVouchers && initialVouchers.length > 0) {
            const checkInitialVouchers = async () => {
                const applied = [];
                for (const code of initialVouchers) {
                    try {
                        const response = await axios.post(route('user.checkout.check-voucher'), {
                            code,
                            cart_ids: carts.map(c => c.id)
                        });
                        if (response.data.valid) {
                            applied.push(response.data.voucher);
                        }
                    } catch (error) {
                        console.error('Invalid initial voucher:', code);
                    }
                }
                setAppliedVouchers(applied);
                setFormData(prev => ({ ...prev, voucher_codes: applied.map(v => v.code) }));
            };
            checkInitialVouchers();
        }
    }, [initialVouchers]);

    // Laravolt Region Handlers
    const handleProvinceChange = async (provinceCode) => {
        setFormData({
            ...formData,
            province_code: provinceCode,
            city_code: '',
            district_code: '',
            village_code: '',
            postal_code: ''
        });
        setRegencies([]);
        setDistricts([]);
        setVillages([]);

        if (provinceCode) {
            try {
                const res = await axios.get(route('regions.regencies'), {
                    params: { province_id: provinceCode }
                });
                setRegencies(res.data);
            } catch (error) {
                console.error('Failed to fetch regencies', error);
            }
        }
    };

    const handleCityChange = async (cityCode) => {
        setFormData({
            ...formData,
            city_code: cityCode,
            district_code: '',
            village_code: '',
            postal_code: ''
        });
        setDistricts([]);
        setVillages([]);

        if (cityCode) {
            try {
                const res = await axios.get(route('regions.districts'), {
                    params: { regency_id: cityCode }
                });
                setDistricts(res.data);
            } catch (error) {
                console.error('Failed to fetch districts', error);
            }
        }
    };

    const handleDistrictChange = async (districtCode) => {
        setFormData({
            ...formData,
            district_code: districtCode,
            village_code: '',
            postal_code: ''
        });
        setVillages([]);

        if (districtCode) {
            try {
                const res = await axios.get(route('regions.villages'), {
                    params: { district_id: districtCode }
                });
                setVillages(res.data);
            } catch (error) {
                console.error('Failed to fetch villages', error);
            }
        }
    };

    const handleVillageChange = (villageCode) => {
        const selectedVillage = villages.find(v => v.code === villageCode);
        const postalCode = selectedVillage?.meta?.pos || '';
        setFormData({ ...formData, village_code: villageCode, postal_code: postalCode });
    };

    // Handle Saved Address Selection
    const handleSelectSavedAddress = (address) => {
        setSelectedSavedAddress(address);
        setFormData({
            ...formData,
            recipient_name: address.recipient_name,
            phone_number: address.phone_number,
            address: address.address,
            province_code: address.province_code,
            city_code: address.city_code,
            district_code: address.district_code,
            village_code: address.village_code,
            postal_code: address.postal_code
        });
    };

    const formatPrice = (value) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    // Check Rates when Postal Code changes (debounced or manual trigger?)
    // Let's us a button "Cek Ongkir" for explicit action to save API calls
    const checkRates = async () => {
        if (!formData.postal_code || formData.postal_code.length !== 5) {
            toast.error('Masukkan 5 digit kode pos');
            return;
        }

        setLoadingRates(true);
        setCouriers([]);

        try {
            const response = await axios.post(route('user.checkout.check-rates'), {
                postal_code: formData.postal_code
            });

            // Biteship response structure handling
            // Assuming response.data.rates is array of { courier_name, service_type, price, duration, ... }
            const rates = response.data.rates || [];
            if (rates.length === 0) {
                toast.error('Tidak ada pengiriman tersedia untuk rute ini.');
            } else {
                setCouriers(rates);
                toast.success('Pilihan pengiriman dimuat.');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Gagal cek ongkir');
        } finally {
            setLoadingRates(false);
        }
    };

    const handleApplyVoucher = async () => {
        if (!voucherCode) return;
        setCheckingVoucher(true);
        try {
            const response = await axios.post(route('user.checkout.check-voucher'), {
                code: voucherCode,
                cart_ids: carts.map(c => c.id)
            });
            if (response.data.valid) {
                const newVoucher = response.data.voucher;
                setAppliedVouchers(prev => {
                    const filtered = prev.filter(v => v.discount_target !== newVoucher.discount_target);
                    const updated = [...filtered, newVoucher];
                    setFormData(fd => ({ ...fd, voucher_codes: updated.map(v => v.code) }));
                    return updated;
                });
                setVoucherCode('');
                toast.success('Voucher berhasil digunakan!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Voucher tidak valid');
        } finally {
            setCheckingVoucher(false);
        }
    };

    const calculateVoucherDiscount = (voucher) => {
        let base = voucher.discount_target === 'shipping' ? formData.shipping_cost : subtotal;
        if (base <= 0) return 0;

        let discount = 0;
        if (voucher.discount_type === 'fixed') {
            discount = parseFloat(voucher.amount);
        } else {
            discount = base * (parseFloat(voucher.amount) / 100);
            if (voucher.max_discount && discount > parseFloat(voucher.max_discount)) {
                discount = parseFloat(voucher.max_discount);
            }
        }

        if (discount > base) discount = base;
        return discount;
    };

    const calculateTotalDiscount = () => {
        if (!appliedVouchers || appliedVouchers.length === 0) return 0;
        return appliedVouchers.reduce((acc, v) => acc + calculateVoucherDiscount(v), 0);
    };

    const discountAmount = calculateTotalDiscount();
    const grandTotal = (subtotal + formData.shipping_cost) - discountAmount;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.shipping_courier) {
            toast.error('Pilih metode pengiriman');
            return;
        }

        const payload = {
            ...formData,
            cart_ids: carts.map(c => c.id)
        };

        router.post(route('user.checkout.store'), payload, {
            onSuccess: () => {
                toast.success('Pesanan dibuat!');
            },
            onError: (errors) => {
                toast.error('Gagal membuat pesanan. Periksa input Anda.');
                console.log(errors);
            }
        });
    };

    if (!carts || carts.length === 0) {
        return (
            <UserLayout>
                <div className="text-center py-20">
                    <p>Keranjang kosong. <a href={route('user.products')} className="text-indigo-600">Belanja sekarang</a></p>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <Head title="Checkout" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout Pesanan</h1>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Shipping Info */}
                    <div className="flex-grow space-y-6">
                        {/* Address Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Informasi Pengiriman
                            </h2>

                            {/* Mode Toggle */}
                            {savedAddresses.length > 0 && (
                                <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setUseMode('saved')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${useMode === 'saved' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Pilih Alamat Tersimpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUseMode('new')}
                                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${useMode === 'new' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Alamat Baru
                                    </button>
                                </div>
                            )}

                            {/* Saved Addresses */}
                            {useMode === 'saved' && savedAddresses.length > 0 && (
                                <div className="space-y-3 mb-4">
                                    {savedAddresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => handleSelectSavedAddress(addr)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedSavedAddress?.id === addr.id
                                                ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    {addr.label && (
                                                        <span className="text-xs font-semibold text-indigo-600 uppercase">{addr.label}</span>
                                                    )}
                                                    <p className="font-medium text-gray-900">{addr.recipient_name}</p>
                                                    <p className="text-sm text-gray-600">{addr.phone_number}</p>
                                                    <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {addr.village?.name}, {addr.district?.name}, {addr.city?.name}, {addr.province?.name} {addr.postal_code}
                                                    </p>
                                                </div>
                                                {addr.is_primary && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Utama</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Cek Ongkir for saved address */}
                                    {selectedSavedAddress && (
                                        <div className="flex items-center gap-3 pt-2">
                                            <div className="flex-1 text-sm text-gray-600">
                                                Kode Pos: <span className="font-semibold text-gray-900">{formData.postal_code}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={checkRates}
                                                disabled={loadingRates}
                                                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {loadingRates ? 'Loading...' : 'Cek Ongkir'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* New Address Form */}
                            {useMode === 'new' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Nama Penerima</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                value={formData.recipient_name}
                                                onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="08..."
                                                value={formData.phone_number}
                                                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Laravolt Region Selectors */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Provinsi</label>
                                            <select
                                                required
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                value={formData.province_code}
                                                onChange={e => handleProvinceChange(e.target.value)}
                                            >
                                                <option value="">Pilih Provinsi</option>
                                                {provinces.map(prov => (
                                                    <option key={prov.code} value={prov.code}>{prov.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                                            <select
                                                required
                                                disabled={!formData.province_code}
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                                value={formData.city_code}
                                                onChange={e => handleCityChange(e.target.value)}
                                            >
                                                <option value="">{formData.province_code ? 'Pilih Kota/Kabupaten' : 'Pilih Provinsi Dulu'}</option>
                                                {regencies.map(city => (
                                                    <option key={city.code} value={city.code}>{city.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Kecamatan</label>
                                            <select
                                                required
                                                disabled={!formData.city_code}
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                                value={formData.district_code}
                                                onChange={e => handleDistrictChange(e.target.value)}
                                            >
                                                <option value="">{formData.city_code ? 'Pilih Kecamatan' : 'Pilih Kota Dulu'}</option>
                                                {districts.map(dist => (
                                                    <option key={dist.code} value={dist.code}>{dist.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Kelurahan/Desa</label>
                                            <select
                                                required
                                                disabled={!formData.district_code}
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                                                value={formData.village_code}
                                                onChange={e => handleVillageChange(e.target.value)}
                                            >
                                                <option value="">{formData.district_code ? 'Pilih Kelurahan/Desa' : 'Pilih Kecamatan Dulu'}</option>
                                                {villages.map(vill => (
                                                    <option key={vill.code} value={vill.code}>{vill.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                                        <textarea
                                            rows="2"
                                            required
                                            placeholder="Jalan, No. Rumah, RT/RW"
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1 relative">
                                        <label className="text-sm font-medium text-gray-700">Kode Pos (Wajib)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                required
                                                maxLength={5}
                                                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                value={formData.postal_code}
                                                onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={checkRates}
                                                disabled={loadingRates}
                                                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {loadingRates ? 'Loading...' : 'Cek Ongkir'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Save Address Option */}
                                    <div className="pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={formData.save_address}
                                                onChange={e => setFormData({ ...formData, save_address: e.target.checked })}
                                            />
                                            <span className="text-sm text-gray-600">Simpan alamat ini untuk penggunaan berikutnya</span>
                                        </label>
                                        {formData.save_address && (
                                            <input
                                                type="text"
                                                required
                                                placeholder="Label (Wajib, contoh: Rumah, Kantor)"
                                                className="mt-2 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                                value={formData.address_label}
                                                onChange={e => setFormData({ ...formData, address_label: e.target.value })}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Courier Selection */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Pilihan Kurir
                            </h2>

                            {couriers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                                    {couriers.map((rate, idx) => (
                                        <div
                                            key={`${rate.courier_name}-${rate.service_type}-${idx}`}
                                            onClick={() => setFormData({
                                                ...formData,
                                                shipping_courier: rate.courier_name,
                                                shipping_service: rate.service_type,
                                                shipping_cost: rate.price
                                            })}
                                            className={`p-3 border rounded-lg cursor-pointer transition-all ${formData.shipping_courier === rate.courier_name && formData.shipping_service === rate.service_type
                                                ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-800 uppercase">{rate.courier_name}</span>
                                                <span className="font-bold text-indigo-600">{formatPrice(rate.price)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{rate.service_type}</span>
                                                <span>{rate.duration || '-'} Hari</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">
                                    {loadingRates ? 'Sedang memuat harga...' : 'Masukkan kode pos lalu klik "Cek Ongkir" untuk melihat pilihan kurir.'}
                                </p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Metode Pembayaran
                            </h2>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="manual_transfer"
                                        checked
                                        readOnly
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">Transfer Bank Manual</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Transfer ke rekening BCA/Mandiri lalu upload bukti bayar.</p>
                                    </div>

                                </label>

                                {/* Payment Proof Upload */}
                                {formData.paymentMethod === 'manual_transfer' && (
                                    <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bukti Transfer (Opsional saat checkout)
                                        </label>
                                        <div className="flex items-center gap-4">
                                            {formData.payment_proof ? (
                                                <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img
                                                        src={URL.createObjectURL(formData.payment_proof)}
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, payment_proof: null })}
                                                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex-1 cursor-pointer">
                                                    <div className="flex flex-col items-center justify-center h-24 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-100 transition-colors">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                            <p className="text-xs text-gray-500">Upload JPG/PNG (Max 2MB)</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    if (file.size > 2 * 1024 * 1024) {
                                                                        toast.error('Ukuran file maksimal 2MB');
                                                                        return;
                                                                    }
                                                                    setFormData({ ...formData, payment_proof: file });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>

                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {carts.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="h-12 w-12 rounded-md bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                            <img src={item.product?.image} alt={item.product?.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.title}</p>
                                            <p className="text-xs text-gray-500">{item.qty} x {formatPrice(item.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.qty)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal Produk</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Ongkos Kirim</span>
                                    <span>{formData.shipping_cost > 0 ? formatPrice(formData.shipping_cost) : '-'}</span>
                                </div>
                                {appliedVouchers.map(v => (
                                    <div key={v.code} className="flex justify-between items-center text-sm text-red-600">
                                        <span>Voucher ({v.code})</span>
                                        <div className="flex items-center gap-2">
                                            <span>- {formatPrice(calculateVoucherDiscount(v))}</span>
                                            <button type="button" onClick={() => {
                                                const updated = appliedVouchers.filter(ap => ap.code !== v.code);
                                                setAppliedVouchers(updated);
                                                setFormData({ ...formData, voucher_codes: updated.map(up => up.code) });
                                            }} className="text-gray-400 hover:text-red-500 rounded p-1">&times;</button>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                                    <span className="text-base font-bold text-gray-900">Total Pembayaran</span>
                                    <span className="text-xl font-bold text-indigo-600">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            {/* Voucher Input */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 block">Pilih Voucher</label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-full text-sm rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        value={voucherCode}
                                        onChange={e => setVoucherCode(e.target.value)}
                                        disabled={appliedVouchers.length >= 2 || availableVouchers.length === 0}
                                    >
                                        <option value="">-- Pilih Voucher --</option>
                                        {availableVouchers.filter(v => subtotal >= parseFloat(v.min_spend)).map(v => {
                                            const isSelected = appliedVouchers.some(ap => ap.code === v.code);
                                            const isDisabled = isSelected;

                                            let labelText = `${v.name} (${v.code})`;
                                            if (isSelected) labelText += ' - Sudah Dipilih';

                                            return (
                                                <option key={v.id} value={v.code} disabled={isDisabled}>
                                                    {labelText}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={handleApplyVoucher}
                                        disabled={checkingVoucher || !voucherCode || appliedVouchers.length >= 2}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 disabled:opacity-50 whitespace-nowrap"
                                    >
                                        {checkingVoucher ? '...' : 'Gunakan'}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Buat Pesanan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
