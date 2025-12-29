'use client';

import { motion } from 'framer-motion';
import { Target, Heart, Shield, Users, Sparkles } from 'lucide-react';

const missions = [
    {
        icon: Target,
        title: "Karkas Unggul",
        description: "Menghasilkan karkas yang unggul"
    },
    {
        icon: Heart,
        title: "Perawatan Terbaik",
        description: "Memastikan setiap domba dirawat dengan baik agar menghasilkan domba yang sehat"
    },
    {
        icon: Shield,
        title: "Kejujuran",
        description: "Mengutamakan kejujuran dalam silsilah dan kondisi ternak"
    },
    {
        icon: Users,
        title: "Hubungan Erat",
        description: "Membangun hubungan erat dan transparan dengan sesama peternak dan konsumen"
    }
];

export default function VisionMission() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d] via-[#0d1610] to-[#0a0f0d]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-farm-500/5 rounded-full blur-[150px]" />

            <div className="container-custom px-4 relative z-10">
                {/* Slogan */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                        <span className="text-gold-400 text-sm font-medium">Filosofi Kami</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                            "Dari Hati, Untuk Rasa Berkualitas Premium"
                        </span>
                    </h2>
                </motion.div>

                {/* Vision */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center mb-20"
                >
                    <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-farm-500/10 via-surface/80 to-farm-500/5 border border-farm-500/20 backdrop-blur-sm">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-farm-400 to-farm-600 flex items-center justify-center">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            Visi Kami
                        </h3>
                        <p className="text-lg md:text-xl text-text-muted leading-relaxed">
                            Menjadi peternak yang menghasilkan{' '}
                            <span className="text-farm-400 font-semibold">domba berkualitas premium</span>{' '}
                            yang menyajikan{' '}
                            <span className="text-gold-400 font-semibold">daging terbaik</span>{' '}
                            bagi meja makan Nusantara.
                        </p>
                    </div>
                </motion.div>

                {/* Mission */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center mb-12"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Misi Kami</h3>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Komitmen kami dalam menghasilkan produk ternak terbaik
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {missions.map((mission, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="group p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-farm-500/30 transition-all duration-300 hover:bg-surface/80"
                        >
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-farm-400/20 to-farm-600/20 flex items-center justify-center mb-4 group-hover:from-farm-400/30 group-hover:to-farm-600/30 transition-colors">
                                <mission.icon className="w-7 h-7 text-farm-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">{mission.title}</h4>
                            <p className="text-sm text-text-muted leading-relaxed">{mission.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
