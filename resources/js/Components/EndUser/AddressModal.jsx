import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function AddressModal({ show, onClose, address = null, provinces = [] }) {
    const [formData, setFormData] = useState({
        label: '',
        recipient_name: '',
        phone_number: '',
        address: '',
        province_code: '',
        city_code: '',
        district_code: '',
        village_code: '',
        postal_code: '',
        is_primary: false,
    });

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Pre-fill form when editing
    useEffect(() => {
        if (address) {
            setFormData({
                label: address.label || '',
                recipient_name: address.recipient_name || '',
                phone_number: address.phone_number || '',
                address: address.address || '',
                province_code: address.province_code || '',
                city_code: address.city_code || '',
                district_code: address.district_code || '',
                village_code: address.village_code || '',
                postal_code: address.postal_code || '',
                is_primary: address.is_primary || false,
            });

            // Load cascading data for editing
            if (address.province_code) {
                loadCities(address.province_code);
            }
            if (address.city_code) {
                loadDistricts(address.city_code);
            }
            if (address.district_code) {
                loadVillages(address.district_code);
            }
        }
    }, [address]);

    const loadCities = async (provinceCode) => {
        try {
            const response = await axios.get(`/api/laravolt/cities/${provinceCode}`);
            setCities(response.data);
        } catch (error) {
            console.error('Failed to load cities:', error);
        }
    };

    const loadDistricts = async (cityCode) => {
        try {
            const response = await axios.get(`/api/laravolt/districts/${cityCode}`);
            setDistricts(response.data);
        } catch (error) {
            console.error('Failed to load districts:', error);
        }
    };

    const loadVillages = async (districtCode) => {
        try {
            const response = await axios.get(`/api/laravolt/villages/${districtCode}`);
            setVillages(response.data);
        } catch (error) {
            console.error('Failed to load villages:', error);
        }
    };

    const handleProvinceChange = (e) => {
        const code = e.target.value;
        setFormData(prev => ({
            ...prev,
            province_code: code,
            city_code: '',
            district_code: '',
            village_code: '',
        }));
        setCities([]);
        setDistricts([]);
        setVillages([]);
        if (code) loadCities(code);
    };

    const handleCityChange = (e) => {
        const code = e.target.value;
        setFormData(prev => ({
            ...prev,
            city_code: code,
            district_code: '',
            village_code: '',
        }));
        setDistricts([]);
        setVillages([]);
        if (code) loadDistricts(code);
    };

    const handleDistrictChange = (e) => {
        const code = e.target.value;
        setFormData(prev => ({
            ...prev,
            district_code: code,
            village_code: '',
        }));
        setVillages([]);
        if (code) loadVillages(code);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const url = address 
            ? route('user.addresses.update', address.id) 
            : route('user.addresses.store');

        const method = address ? 'put' : 'post';

        router[method](url, formData, {
            onSuccess: () => {
                onClose();
                setFormData({
                    label: '',
                    recipient_name: '',
                    phone_number: '',
                    address: '',
                    province_code: '',
                    city_code: '',
                    district_code: '',
                    village_code: '',
                    postal_code: '',
                    is_primary: false,
                });
            },
            onError: (errors) => {
                setErrors(errors);
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {address ? 'Edit Alamat' : 'Tambah Alamat Baru'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-4">
                        {/* Label Alamat */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Label Alamat <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                placeholder="Rumah, Kantor, dll"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label}</p>}
                        </div>

                        {/* Recipient Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Penerima <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.recipient_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, recipient_name: e.target.value }))}
                                placeholder="Nama lengkap penerima"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {errors.recipient_name && <p className="text-red-500 text-sm mt-1">{errors.recipient_name}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Telepon <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone_number}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                                placeholder="08xxxxxxxxxx"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                        </div>

                        {/* Province */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Provinsi <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.province_code}
                                onChange={handleProvinceChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Pilih Provinsi</option>
                                {provinces.map(prov => (
                                    <option key={prov.code} value={prov.code}>{prov.name}</option>
                                ))}
                            </select>
                            {errors.province_code && <p className="text-red-500 text-sm mt-1">{errors.province_code}</p>}
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kota/Kabupaten <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.city_code}
                                onChange={handleCityChange}
                                disabled={!formData.province_code}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                            >
                                <option value="">Pilih Kota/Kabupaten</option>
                                {cities.map(city => (
                                    <option key={city.code} value={city.code}>{city.name}</option>
                                ))}
                            </select>
                            {errors.city_code && <p className="text-red-500 text-sm mt-1">{errors.city_code}</p>}
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kecamatan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.district_code}
                                onChange={handleDistrictChange}
                                disabled={!formData.city_code}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                            >
                                <option value="">Pilih Kecamatan</option>
                                {districts.map(dist => (
                                    <option key={dist.code} value={dist.code}>{dist.name}</option>
                                ))}
                            </select>
                            {errors.district_code && <p className="text-red-500 text-sm mt-1">{errors.district_code}</p>}
                        </div>

                        {/* Village */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kelurahan/Desa <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.village_code}
                                onChange={(e) => setFormData(prev => ({ ...prev, village_code: e.target.value }))}
                                disabled={!formData.district_code}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                            >
                                <option value="">Pilih Kelurahan/Desa</option>
                                {villages.map(vill => (
                                    <option key={vill.code} value={vill.code}>{vill.name}</option>
                                ))}
                            </select>
                            {errors.village_code && <p className="text-red-500 text-sm mt-1">{errors.village_code}</p>}
                        </div>

                        {/* Full Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alamat Lengkap <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>

                        {/* Postal Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kode Pos
                            </label>
                            <input
                                type="text"
                                value={formData.postal_code}
                                onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                                placeholder="12345"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                        </div>

                        {/* Set as Primary */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_primary"
                                checked={formData.is_primary}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_primary: e.target.checked }))}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="is_primary" className="text-sm text-gray-700">
                                Jadikan alamat utama
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Menyimpan...' : address ? 'Perbarui' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
