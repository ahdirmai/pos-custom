import React from 'react';
import { Link } from '@inertiajs/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {links.map((link, i) => {
                    // Previous Button
                    if (link.label.includes('Previous')) {
                        return link.url ? (
                            <Link
                                key={i}
                                href={link.url}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Previous</span>
                                <IconChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span
                                key={i}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-400 cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                <IconChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </span>
                        );
                    }

                    // Next Button
                    if (link.label.includes('Next')) {
                        return link.url ? (
                            <Link
                                key={i}
                                href={link.url}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span className="sr-only">Next</span>
                                <IconChevronRight className="h-5 w-5" aria-hidden="true" />
                            </Link>
                        ) : (
                            <span
                                key={i}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-50 text-sm font-medium text-gray-400 cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                <IconChevronRight className="h-5 w-5" aria-hidden="true" />
                            </span>
                        );
                    }

                    // Page Numbers
                    return link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                link.active
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            key={i}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </nav>
        </div>
    );
}
