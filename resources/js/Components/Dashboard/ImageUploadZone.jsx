import React, { useState, useRef } from 'react';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';

const ImageUploadZone = ({ 
    imagePreview, 
    onImageChange, 
    onImageRemove, 
    error,
    title = "Gambar Produk",
    icon: Icon = IconPhoto 
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const dummyEvent = { target: { files: [file] } };
            onImageChange(dummyEvent);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                        {Icon && <Icon size={20} className="text-blue-500" />}
                        {title}
                    </h3>
                    {imagePreview && (
                        <button
                            type="button"
                            onClick={onImageRemove}
                            className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors font-medium"
                        >
                            <IconX size={14} /> Hapus
                        </button>
                    )}
                </div>

                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()} 
                    className={`
                        relative group aspect-square rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-300
                        ${isDragging 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]' 
                            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400'}
                        ${error ? 'border-red-400 bg-red-50/30' : ''}
                    `}
                >
                    {imagePreview ? (
                        <>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <IconUpload className="text-white mb-2 animate-bounce" size={32} />
                                <p className="text-white text-xs font-medium bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-sm">
                                    {isDragging ? 'Lepas untuk Ganti' : 'Klik atau Seret untuk Ganti'}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${isDragging ? 'scale-110 bg-blue-100 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <IconUpload size={32} />
                            </div>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                {isDragging ? 'Lepas Sekarang' : `Tarik ${title.toLowerCase()} ke sini`}
                            </p>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageChange}
                />

                {error && (
                    <p className="mt-3 text-xs text-red-500 font-medium flex items-center gap-1">
                        <IconX size={14} /> {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ImageUploadZone;