import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function AuthenticatedUserLayout({ children }) {
    const { url } = usePage();
    

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Content Area */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </UserLayout>
    );
}
