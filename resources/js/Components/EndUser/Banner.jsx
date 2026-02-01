import React from 'react';

export default function Banner({ image, title, subtitle, className = '' }) {
    return (
        <div className={`relative w-full overflow-hidden rounded-lg shadow-md ${className}`}>
             <img src={image} alt={title} className="w-full h-full object-cover" />
             {(title || subtitle) && (
                 <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-4">
                     {title && <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">{title}</h2>}
                     {subtitle && <p className="text-white text-md md:text-xl">{subtitle}</p>}
                 </div>
             )}
        </div>
    );
}
