import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-10 pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Tentang Kami</h3>
                        <p className="mt-4 text-base text-gray-500">
                           Toko Online Terpercaya yang menyediakan berbagai macam kebutuhan Anda dengan kualitas terbaik.
                        </p>
                    </div>
                    <div>
                         <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Layanan Pelanggan</h3>
                         <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Bantuan</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Metode Pembayaran</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Pengiriman</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Pengembalian Barang</a></li>
                         </ul>
                    </div>
                    <div>
                         <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Ikuti Kami</h3>
                         <ul className="mt-4 space-y-4">
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Facebook</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Instagram</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Twitter</a></li>
                         </ul>
                    </div>
                     <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Hubungi Kami</h3>
                        <p className="mt-4 text-base text-gray-500">
                           Email: support@toko.com<br/>
                           Phone: +62 812 3456 7890
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; 2024 Nama Toko. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
