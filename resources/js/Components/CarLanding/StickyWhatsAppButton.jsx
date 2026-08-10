import React from 'react';

export default function StickyWhatsAppButton({ whatsappNumber, message = '' }) {
    const cleanNumber = whatsappNumber?.replace(/\D/g, '') ?? '';
    const encodedMessage = encodeURIComponent(message || 'Halo, saya ingin informasi lebih lanjut tentang VinFast Limo Green.');
    const href = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    if (!cleanNumber) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat WhatsApp Sales"
            className="fixed bottom-[88px] right-4 z-[60] lg:bottom-6 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-[0_6px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_28px_rgba(37,211,102,0.55)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        >
            {/* WhatsApp SVG icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-7 h-7"
                fill="currentColor"
            >
                <path d="M16.003 2.667C8.639 2.667 2.667 8.639 2.667 16c0 2.349.636 4.64 1.844 6.641L2.667 29.333l6.891-1.811A13.27 13.27 0 0 0 16.003 29.333c7.364 0 13.33-5.972 13.33-13.333 0-7.364-5.966-13.333-13.33-13.333zm0 24.267a11.08 11.08 0 0 1-5.648-1.549l-.403-.24-4.093 1.075 1.094-4.003-.264-.41A11.047 11.047 0 0 1 4.934 16c0-6.107 4.966-11.067 11.069-11.067 6.101 0 11.063 4.96 11.063 11.067 0 6.107-4.962 11.067-11.063 11.067zm6.078-8.276c-.333-.168-1.97-.974-2.276-1.085-.305-.111-.527-.168-.749.168-.221.336-.856 1.085-1.05 1.307-.194.224-.389.252-.722.084-.333-.168-1.407-.519-2.681-1.655-.99-.883-1.659-1.974-1.853-2.31-.194-.336-.021-.518.146-.685.151-.151.333-.392.5-.588.167-.196.222-.336.333-.56.111-.224.056-.42-.028-.588-.084-.168-.748-1.808-1.028-2.476-.271-.65-.545-.562-.748-.572-.193-.01-.416-.012-.638-.012-.221 0-.582.084-.887.42-.305.336-1.163 1.138-1.163 2.774 0 1.637 1.191 3.216 1.358 3.44.167.224 2.345 3.582 5.684 5.024.794.342 1.414.547 1.897.7.798.254 1.524.218 2.098.132.64-.095 1.97-.806 2.248-1.585.278-.779.278-1.447.195-1.585-.083-.14-.305-.224-.638-.392z" />
            </svg>
        </a>
    );
}
