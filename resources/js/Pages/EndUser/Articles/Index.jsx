import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import Pagination from '@/Components/EndUser/Pagination';

export default function Index({ articles }) {
    const { data, links } = articles;

    return (
        <UserLayout>
            <Head title="Artikel & Berita" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Header with visual accent */}
                 <div className="relative mb-6 inline-block">
                    <div className="absolute inset-0 bg-yellow-200 transform -skew-x-3 rounded-lg opacity-70"></div>
                    <h1 className="relative text-2xl font-bold text-gray-900 px-3 py-1 z-10">Artikel & Berita</h1>
                 </div>

                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                     {data.length > 0 ? (
                         <div className="flex flex-col divide-y divide-gray-100">
                            {data.map((article) => (
                                <Link 
                                    href={route('user.article.show', article.slug)}
                                    key={article.id} 
                                    className="group py-4 flex items-start justify-between hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2 first:pt-0 last:pb-0 cursor-pointer"
                                >
                                     <div className="flex-1 pr-4">
                                        <div className="text-[11px] text-gray-500 mb-1">In <span className="font-semibold text-gray-600">{article.category || 'Panduan'}</span></div>
                                        <h2 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                                             {article.title}
                                        </h2>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-2 hidden md:block">{article.excerpt}</p>
                                        <div className="text-xs text-gray-400 font-medium">
                                             {article.date} <span className="mx-1">•</span> Baca Selengkapnya
                                        </div>
                                     </div>
                                     <div className="flex-shrink-0 w-28 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden bg-gray-100 shadow-sm relative mt-0.5">
                                        {article.image ? (
                                            <img 
                                                src={article.image} 
                                                alt={article.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                     </div>
                                </Link>
                            ))}
                         </div>
                     ) : (
                         <div className="flex flex-col items-center justify-center h-64 text-center">
                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                 </svg>
                             </div>
                             <h3 className="text-lg font-medium text-gray-900">Belum ada artikel</h3>
                             <p className="text-sm text-gray-500 mt-1">Nantikan artikel menarik dari kami segera.</p>
                         </div>
                     )}
                 </div>

                 {/* Pagination */}
                 <Pagination links={links} />
            </div>
        </UserLayout>
    );
}
