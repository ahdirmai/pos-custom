import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedUserLayout from '@/Layouts/AuthenticatedUserLayout';
import AddressModal from '@/Components/EndUser/AddressModal';

export default function ProfileIndex({ user, provinces, addresses, orders, wishlist, pendingReviews }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [orderFilter, setOrderFilter] = useState('all');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    const tabs = [
        { id: 'profile', label: 'Profil', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )},
        { id: 'addresses', label: 'Alamat', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )},
        { id: 'orders', label: 'Pesanan', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        )},
        { id: 'wishlist', label: 'Wishlist', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        )},
        { id: 'reviews', label: 'Ulasan', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        )},
    ];

    const orderStatusColors = {
        pending: 'bg-amber-100 text-amber-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        completed: 'bg-green-100 text-green-700',
    };

    const filteredOrders = orderFilter === 'all' 
        ? orders 
        : orders.filter(o => o.status === orderFilter);

    return (
        <AuthenticatedUserLayout>
            <Head title="Profil Saya" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Mobile: Profile Header */}
                <div className="md:hidden mb-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img 
                                    src={user.avatar} 
                                    alt={user.name}
                                    className="w-16 h-16 rounded-full border-2 border-white/50 object-cover"
                                />
                                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">{user.name}</h1>
                                <p className="text-sm opacity-80">{user.email}</p>
                                <p className="text-xs opacity-60 mt-1">Bergabung sejak {user.joined_at}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile: Tab Pills */}
                <div className="md:hidden mb-6 -mx-4 px-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-white text-gray-600 border border-gray-200'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Desktop: Sidebar */}
                    <div className="hidden md:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
                            {/* Profile Card */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center">
                                <div className="relative inline-block">
                                    <img 
                                        src={user.avatar} 
                                        alt={user.name}
                                        className="w-20 h-20 rounded-full border-4 border-white/30 object-cover mx-auto"
                                    />
                                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                </div>
                                <h2 className="text-lg font-bold mt-3">{user.name}</h2>
                                <p className="text-sm opacity-80">{user.email}</p>
                                <p className="text-xs opacity-60 mt-1">Bergabung sejak {user.joined_at}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="p-3">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                        {tab.id === 'orders' && orders.filter(o => o.status === 'pending').length > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                {orders.filter(o => o.status === 'pending').length}
                                            </span>
                                        )}
                                        {tab.id === 'reviews' && pendingReviews.length > 0 && (
                                            <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                {pendingReviews.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>

                            {/* Logout */}
                            <div className="p-3 border-t border-gray-100">
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                {/* Personal Info */}
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900">Informasi Pribadi</h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
                                                <p className="text-gray-900 font-medium mt-1">{user.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                                                <p className="text-gray-900 font-medium mt-1">{user.email}</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">No. Telepon</label>
                                                <p className="text-gray-900 font-medium mt-1">{user.phone}</p>
                                            </div>
                                        </div>
                                        <button className="text-sm text-indigo-600 font-medium hover:underline">
                                            Edit Profil
                                        </button>
                                    </div>
                                </div>

                                {/* Security */}
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900">Keamanan Akun</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Password</p>
                                                    <p className="text-sm text-gray-500">Terakhir diubah 30 hari lalu</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                                Ubah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">Daftar Alamat</h3>
                                    <button 
                                        onClick={() => {
                                            setEditingAddress(null);
                                            setShowAddressModal(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Tambah
                                    </button>
                                </div>

                                {addresses.length > 0 ? addresses.map(addr => (
                                    <div key={addr.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                                                        {addr.label}
                                                    </span>
                                                    {addr.is_primary && (
                                                        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg">
                                                            Utama
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="font-semibold text-gray-900">{addr.recipient}</p>
                                                <p className="text-sm text-gray-600 mt-1">{addr.phone}</p>
                                                <p className="text-sm text-gray-600 mt-2">{addr.address}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {addr.city} {addr.postal_code && `- ${addr.postal_code}`}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setEditingAddress(addr);
                                                        setShowAddressModal(true);
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (confirm('Hapus alamat ini?')) {
                                                            router.delete(route('addresses.destroy', addr.id));
                                                        }
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 mb-2">Belum ada alamat tersimpan</p>
                                        <button
                                            onClick={() => {
                                                setEditingAddress(null);
                                                setShowAddressModal(true);
                                            }}
                                            className="text-indigo-600 font-medium hover:text-indigo-700"
                                        >
                                            Tambah alamat sekarang
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="space-y-4">
                                {/* Filter Pills */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                                    {[
                                        { id: 'all', label: 'Semua' },
                                        { id: 'pending', label: 'Belum Bayar' },
                                        { id: 'processing', label: 'Diproses' },
                                        { id: 'shipped', label: 'Dikirim' },
                                        { id: 'completed', label: 'Selesai' },
                                    ].map(filter => (
                                        <button
                                            key={filter.id}
                                            onClick={() => setOrderFilter(filter.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                                orderFilter === filter.id
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {filter.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Order Cards */}
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map(order => (
                                        <Link 
                                            key={order.id} 
                                            href={route('user.invoice', order.id)}
                                            className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all"
                                        >
                                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-500">{order.date}</span>
                                                    <span className="text-sm font-medium text-gray-900">{order.invoice}</span>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${orderStatusColors[order.status]}`}>
                                                    {order.status_label}
                                                </span>
                                            </div>
                                            <div className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex -space-x-2">
                                                        {order.items.slice(0, 3).map((item, idx) => (
                                                            <img 
                                                                key={idx}
                                                                src={item.image || 'https://via.placeholder.com/150'} 
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded-lg border-2 border-white object-cover"
                                                            />
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                                                +{order.items.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-900 truncate">
                                                            {order.items.map(i => i.name).join(', ')}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {order.items.length} produk
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Total</p>
                                                        <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                                                    </div>
                                                </div>
                                                {order.tracking && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                        <span className="text-sm text-gray-500">Resi: <span className="font-medium text-gray-900">{order.tracking}</span></span>
                                                        <button className="text-sm text-indigo-600 font-medium hover:underline">Lacak</button>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">Tidak ada pesanan</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900">Wishlist ({wishlist.length})</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {wishlist.map(item => (
                                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                                            <div className="relative aspect-square bg-gray-100">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="p-3">
                                                <p className="text-xs font-medium text-gray-900 line-clamp-2">{item.name}</p>
                                                <p className="text-sm font-bold text-indigo-600 mt-1">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900">Menunggu Ulasan ({pendingReviews.length})</h3>
                                
                                {pendingReviews.length > 0 ? (
                                    pendingReviews.map(review => (
                                        <div key={review.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={review.product_image} 
                                                    alt={review.product_name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{review.product_name}</p>
                                                    <p className="text-sm text-gray-500 mt-1">Dibeli: {review.purchased_at}</p>
                                                </div>
                                                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                                                    Tulis Ulasan
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">Tidak ada produk yang menunggu ulasan</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            <AddressModal 
                show={showAddressModal}
                onClose={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                }}
                address={editingAddress}
                provinces={provinces}
            />
        </AuthenticatedUserLayout>
    );
}
