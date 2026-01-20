import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Index({ articles }) {
    return (
        <UserLayout>
            <Head title="Artikel & Berita" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <h1 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terbaru</h1>

                 <div className="space-y-6 max-w-3xl mx-auto">
                    {articles.map((article) => (
                        <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center text-xs text-gray-500 mb-2">
                                        <span>{article.date}</span>
                                        <span className="mx-2">•</span>
                                        <span>Tips & Trik</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{article.title}</h2>
                                    <p className="text-gray-600 line-clamp-2 md:line-clamp-3">{article.excerpt}</p>
                                </div>
                                <div className="mt-4">
                                    <span className="text-indigo-600 font-medium text-sm flex items-center">
                                        Baca Selengkapnya
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                           <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </UserLayout>
    );
}
