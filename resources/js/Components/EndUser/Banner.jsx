import React from 'react';

export default function Banner({ image, title, subtitle, className = '' }) {
    return (
        <div className={`relative w-full overflow-hidden rounded-2xl shadow-lg group ${className}`}>
             <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
             {(title || subtitle) && (
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                     {title && <h2 className="text-white text-3xl md:text-5xl font-bold mb-3 tracking-tight drop-shadow-lg">{title}</h2>}
                     {subtitle && <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl drop-shadow-md">{subtitle}</p>}
                 </div>
             )}
        </div>
    );
}
