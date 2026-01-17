import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            {/* Container untuk menengahkan teks */}
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        APP MADE BY ACHMAD BUKHORI
                    </h1>
                    
                    <div className="inline-block px-6 py-3 bg-green-500 text-white text-xl font-semibold rounded-full shadow-lg">
                        WA 082322226900
                    </div>
                </div>
            </div>
        </>
    );
}