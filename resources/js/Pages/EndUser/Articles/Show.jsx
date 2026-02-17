import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Show({ article, relatedArticles }) {
    return (
        <UserLayout>
            <Head title={article.title} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Breadcrumb - Optional but good for navigation */}
                <nav className="text-sm font-medium text-gray-500 mb-6 flex items-center gap-2">
                    <Link href={route('user.index')} className="hover:text-indigo-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={route('user.articles')} className="hover:text-indigo-600 transition-colors">Artikel</Link>
                    <span>/</span>
                    <span className="text-gray-900 line-clamp-1">{article.title}</span>
                </nav>

                {/* Article Header */}
                <header className="mb-8 md:mb-12 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-4 tracking-wide uppercase">
                        {article.category}
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span className="font-medium text-gray-900">{article.author}</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span>{article.date}</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg mb-10 border border-gray-100">
                    <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-[300px] md:h-[500px] object-cover"
                    />
                </div>

                {/* Content Container */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <article className="lg:w-2/3">
                        <div 
                            className="prose prose-lg prose-indigo max-w-none text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                        
                        {/* Tags */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                {article.tags && article.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium hover:bg-gray-200 transition-colors cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Author Bio / Share (Optional Placeholder) */}
                        <div className="mt-10 p-6 bg-gray-50 rounded-xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                                {article.author ? article.author.charAt(0) : 'S'}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">Ditulis oleh {article.author}</div>
                                <div className="text-xs text-gray-500">Tim Konten Shabrina Official</div>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                </button>
                                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar / Related Posts */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-1 h-6 bg-yellow-400 rounded-full mr-3"></span>
                                Artikel Terkait
                            </h3>
                            <div className="flex flex-col space-y-4">
                                {relatedArticles.map((related) => (
                                    <Link 
                                        key={related.id} 
                                        href={route('user.article.show', related.slug)}
                                        className="group bg-white rounded-xl p-3 flex items-start space-x-4 border border-gray-100 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
                                            <img 
                                                src={related.image} 
                                                alt={related.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                             <div className="text-[10px] uppercase font-bold text-indigo-500 mb-1">{related.category}</div>
                                             <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                 {related.title}
                                             </h4>
                                             <div className="text-xs text-gray-400 mt-1">{related.date}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* CTA Banner Implementation (Optional) */}
                            <div className="mt-8 bg-indigo-900 rounded-2xl p-6 text-center text-white relative overflow-hidden group cursor-pointer">
                                <div className="absolute inset-0 bg-indigo-600 opacity-50 transform rotate-12 scale-150 group-hover:rotate-6 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <h4 className="font-bold text-lg mb-2">Ingin Gamis Premium?</h4>
                                    <p className="text-indigo-100 text-sm mb-4">Dapatkan koleksi terbaru dengan harga penawaran spesial.</p>
                                    <Link href={route('user.products')} className="inline-block bg-white text-indigo-900 font-bold py-2 px-6 rounded-full text-sm hover:bg-yellow-400 hover:text-gray-900 transition-all">
                                        Belanja Sekarang
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </UserLayout>
    );
}
