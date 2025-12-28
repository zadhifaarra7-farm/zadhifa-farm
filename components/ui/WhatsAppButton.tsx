'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const phoneNumber = '6287722076763'; // 087722076763 with country code
    const defaultMessage = `Halo Zadhifa Farm! 🐐

Saya tertarik untuk memesan domba dari website Anda.

Mohon info lebih lanjut mengenai:
- Ketersediaan stok
- Harga terbaru
- Proses pemesanan

Terima kasih! 🙏`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Chat via WhatsApp"
        >
            {/* Pulse animation */}
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />

            {/* Button */}
            <div className="relative flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <MessageCircle className="w-6 h-6 fill-current" />
                <span className="font-semibold hidden sm:inline">Pesan via WhatsApp</span>
            </div>

            {/* Tooltip for mobile */}
            <div className="absolute -top-12 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Klik untuk chat langsung
            </div>
        </a>
    );
}
