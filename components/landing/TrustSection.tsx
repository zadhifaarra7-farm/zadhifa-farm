'use client';

import { ShieldCheck, Award, HeartHandshake, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrustSection() {
    const features = [
        {
            icon: <Award className="w-8 h-8 text-gold-500" />,
            title: "Premium Lineage",
            desc: "Silsilah Dorper & Garut tercatat resmi. Full Blood certification available."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-farm-500" />,
            title: "Disease Free",
            desc: "Jaminan bebas penyakit dengan pemeriksaan veterinari berkala & karantina ketat."
        },
        {
            icon: <FileCheck className="w-8 h-8 text-blue-500" />,
            title: "100% Halal",
            desc: "Proses pemeliharaan dan penyembelihan sesuai syariat Islam. Amanah & Jujur."
        },
        {
            icon: <HeartHandshake className="w-8 h-8 text-purple-500" />,
            title: "Trusted Partner",
            desc: "Dipercaya oleh Hotel Bintang 5 & Restoran Premium untuk suplai daging berkualitas."
        }
    ];

    return (
        <section className="py-24 bg-[#0a0f0d] border-t border-white/5 relative overflow-hidden">
            <div className="container-custom px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Quality You Can <span className="text-gradient-gold">Trust</span>
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Kami memegang teguh amanah. Kualitas daging terbaik, bebas penyakit,
                        dan transparansi total adalah janji kami.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-2xl bg-surface border border-white/5 hover:border-farm-500/30 transition-all hover:-translate-y-1 group"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* trust indicators / badges strip */}
                <div className="mt-16 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholders for actual visible logos if needed, represented by text for now */}
                    {['MUI Halal', 'Sertifikat Veteriner', 'ISO 9001', 'HACCP Certified'].map((cert, i) => (
                        <div key={i} className="text-xl font-bold font-serif text-white/40 border border-white/20 px-4 py-2 rounded">
                            [ {cert} ]
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
