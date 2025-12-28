'use client';

import { motion } from 'framer-motion';
import { QrCode, Shield, FileCheck, Heart } from 'lucide-react';

export default function DigitalTwin() {
    const features = [
        { icon: QrCode, label: 'Kode Unik QR', desc: 'Scan untuk info lengkap' },
        { icon: Shield, label: 'Jaminan Keaslian', desc: 'Terverifikasi digital' },
        { icon: FileCheck, label: 'Riwayat Lengkap', desc: 'Vaksin & kesehatan' },
        { icon: Heart, label: 'Status Kesehatan', desc: 'Update real-time' },
    ];

    return (
        <section id="digital-twin" className="section relative">
            <div className="container-custom">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Visual */}
                    <motion.div
                        className="order-2 md:order-1 relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-surface-elevated to-surface rounded-3xl border border-white/10 p-8 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-farm-500/10 border-2 border-dashed border-farm-500/30 flex items-center justify-center">
                                    <QrCode className="w-16 h-16 text-farm-500/50" />
                                </div>
                                <p className="text-text-muted text-sm">
                                    QR Code akan dibuat otomatis<br />saat Anda menambah domba
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        className="order-1 md:order-2 space-y-8"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Setiap Domba Punya <br />
                            <span className="text-gradient-gold">Identitas Digital</span>
                        </h2>

                        <p className="text-text-muted text-lg">
                            Setiap domba akan memiliki kode registrasi unik dan QR code yang dapat di-scan untuk melihat informasi lengkap.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    className="p-4 rounded-xl bg-surface-elevated/50 border border-white/5"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <feature.icon className="w-6 h-6 text-farm-400 mb-2" />
                                    <div className="font-medium text-sm">{feature.label}</div>
                                    <div className="text-xs text-text-muted">{feature.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
