import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-12 pb-20 md:pb-10 shadow-[0_-1px_6px_rgba(49,53,59,0.12)]">
            <div className="max-w-[1240px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Column 1: Blogpedia */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-base font-bold text-gray-900 mb-2">Blogpedia</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Tentang Blogpedia</a></li>
                            <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Hak Kekayaan Barang</a></li>
                            <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Karir</a></li>
                            <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Mitra Blog</a></li>
                        </ul>
                    </div>

                    {/* Column 2: Beli & Jual */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-3">Beli</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Pembayaran Tema</a></li>
                                <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Tukar Tambah Produk</a></li>
                                <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Blogpedia COD</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-3">Jual</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Pusat Bantuan Seller</a></li>
                                <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Mitra Toko</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Bantuan dan Panduan */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-base font-bold text-gray-900 mb-2">Bantuan dan Panduan</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Blogpedia Care</a></li>
                            <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Syarat dan Ketentuan</a></li>
                            <li><a href="#" className="text-[13px] text-gray-500 hover:text-primary-600 transition-colors">Kebijakan Privasi</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Image & Copyright */}
                    <div className="flex flex-col items-center lg:items-end gap-4 mt-[-16px]">
                        <img 
                            src="https://1.bp.blogspot.com/-I72hJV1waqA/YG9YMlg9hrI/AAAAAAAADQQ/zOSoYqijmfAP2x-Fm3RMrSQnTHjsumGcQCK4BGAYYCw/s1600/blogpedia_v_4-footer.jpg" 
                            alt="Footer Graphic" 
                            className="w-full max-w-[350px] lg:max-w-[550px] h-auto object-contain rounded-lg"
                        />
                        <div className="text-[13px] font-semibold text-gray-600 text-center lg:text-right w-full mt-4">
                            &copy; 2024 Nama Toko. All rights reserved. <br/>
                            <span className="font-normal text-gray-500">
                                Template inspired by <span className="text-primary-600 font-medium">Blogpedia</span>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
