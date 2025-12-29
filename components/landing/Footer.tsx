'use client';

import { motion } from 'framer-motion';
import { Instagram, Phone, MapPin, Mail, Heart } from 'lucide-react';

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const socialLinks = [
    {
        name: 'Instagram',
        icon: Instagram,
        href: 'https://www.instagram.com/zadhifafarm?igsh=YXFnbWdiNzBvY2Ex',
        color: 'from-pink-500 to-purple-500',
        hoverColor: 'hover:text-pink-400'
    },
    {
        name: 'TikTok',
        icon: TikTokIcon,
        href: 'https://www.tiktok.com/@zadhifafarm_?_r=1&_t=ZS-92cd5kfFqPR',
        color: 'from-gray-800 to-black',
        hoverColor: 'hover:text-white'
    }
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-[#0a0f0d] to-transparent" />

            {/* Main Footer Content */}
            <div className="relative z-10 border-t border-white/5">
                <div className="container-custom px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Brand Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-farm-400 to-farm-600 flex items-center justify-center text-2xl">
                                    🐑
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Zadhifa Farm</h3>
                                    <p className="text-sm text-farm-400">Dari Hati, Untuk Rasa Berkualitas Premium</p>
                                </div>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed">
                                Ternak premium masa depan dari peternakan modern Indonesia.
                            </p>
                        </motion.div>

                        {/* Contact Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                        >
                            <h4 className="text-lg font-semibold text-white">Hubungi Kami</h4>
                            <div className="space-y-3">
                                <a
                                    href="https://wa.me/6287722076763"
                                    className="flex items-center gap-3 text-text-muted hover:text-farm-400 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-farm-500/10 flex items-center justify-center group-hover:bg-farm-500/20 transition-colors">
                                        <Phone className="w-5 h-5 text-farm-400" />
                                    </div>
                                    <span className="text-sm">087722076763</span>
                                </a>
                                <div className="flex items-center gap-3 text-text-muted">
                                    <div className="w-10 h-10 rounded-lg bg-farm-500/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-farm-400" />
                                    </div>
                                    <span className="text-sm">Indonesia</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Social Media Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <h4 className="text-lg font-semibold text-white">Ikuti Kami</h4>
                            <p className="text-text-muted text-sm">Dapatkan update terbaru dari peternakan kami</p>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                                            <social.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {social.name}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="border-t border-white/5">
                    <div className="container-custom px-4 py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <h4 className="text-xl font-semibold text-white mb-2">📍 Lokasi Kami</h4>
                                <p className="text-text-muted text-sm">Kunjungi peternakan kami langsung</p>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <iframe
                                    src="https://maps.google.com/maps?q=Zadhifa+Farm&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="350"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0f0d]/50 to-transparent" />
                            </div>
                            <div className="text-center">
                                <a
                                    href="https://maps.app.goo.gl/C4jU2RvAyucA2byw5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-farm-500/10 border border-farm-500/20 text-farm-400 hover:bg-farm-500/20 transition-colors"
                                >
                                    <MapPin className="w-5 h-5" />
                                    <span>Buka di Google Maps</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5">
                    <div className="container-custom px-4 py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
                            <p>© {new Date().getFullYear()} Zadhifa Farm. All rights reserved.</p>
                            <p className="flex items-center gap-1">
                                Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Indonesia
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
