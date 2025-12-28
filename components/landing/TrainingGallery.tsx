'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Users, Award, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const trainingImages = [
    { src: '/training-1.jpg', caption: 'Kunjungan ke Barokah Farm' },
    { src: '/training-2.jpg', caption: 'Pelatihan Tim Zadhifa Farm' },
    { src: '/training-3.jpg', caption: 'Penyerahan Penghargaan' },
    { src: '/training-4.jpg', caption: 'Tim Inti Zadhifa Farm' },
    { src: '/training-5.jpg', caption: 'Kunjungan Pejabat Daerah' },
    { src: '/training-6.jpg', caption: 'Foto Bersama Peserta Pelatihan' },
    { src: '/training-7.jpg', caption: 'Semangat Tim Pelatihan' },
    { src: '/training-8.jpg', caption: 'Pelatihan Pengembangan Kelompok Ternak' },
    { src: '/training-9.jpg', caption: 'Study Banding Ternak Domba' },
    { src: '/training-10.jpg', caption: 'Sesi Materi Pelatihan' },
];

export default function TrainingGallery() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    // Duplicate images for seamless infinite scroll
    const duplicatedImages = [...trainingImages, ...trainingImages];

    return (
        <section id="dokumentasi" className="section relative overflow-hidden">
            <div className="container-custom">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6">
                        <GraduationCap className="w-4 h-4" />
                        Dokumentasi Kegiatan
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Pelatihan & <span className="text-gold-400">Kemitraan</span>
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Zadhifa Farm aktif dalam pengembangan kapasitas dan menjalin kemitraan dengan berbagai pihak untuk kemajuan peternakan domba Indonesia.
                    </p>
                </motion.div>
            </div>

            {/* Auto-scrolling Marquee */}
            <div className="relative overflow-hidden py-4">
                {/* Gradient fade on edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0f0d] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0f0d] to-transparent z-10 pointer-events-none" />

                <div className="flex animate-marquee hover:pause-animation">
                    {duplicatedImages.map((image, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-72 mx-3 cursor-pointer group"
                            onClick={() => setSelectedImage(i % trainingImages.length)}
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                                <Image
                                    src={image.src}
                                    alt={image.caption}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-sm font-medium text-white">{image.caption}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="container-custom mt-12">
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="text-center p-4 rounded-xl bg-surface-elevated/30 border border-white/5">
                        <Users className="w-8 h-8 text-farm-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold">10+</div>
                        <div className="text-xs text-text-muted">Mitra Peternakan</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-surface-elevated/30 border border-white/5">
                        <GraduationCap className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold">5+</div>
                        <div className="text-xs text-text-muted">Pelatihan</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-surface-elevated/30 border border-white/5">
                        <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold">3+</div>
                        <div className="text-xs text-text-muted">Kab/Kota</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-surface-elevated/30 border border-white/5">
                        <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold">2+</div>
                        <div className="text-xs text-text-muted">Penghargaan</div>
                    </div>
                </motion.div>
            </div>

            {/* Lightbox */}
            {selectedImage !== null && (
                <motion.div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedImage(null)}
                >
                    <motion.div
                        className="relative max-w-4xl max-h-[90vh] w-full"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={trainingImages[selectedImage].src}
                            alt={trainingImages[selectedImage].caption}
                            width={1200}
                            height={800}
                            className="object-contain w-full h-full rounded-xl"
                        />
                        <p className="text-center text-white mt-4 text-lg font-medium">
                            {trainingImages[selectedImage].caption}
                        </p>
                        <button
                            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            ✕
                        </button>

                        {/* Navigation buttons */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(selectedImage === 0 ? trainingImages.length - 1 : selectedImage - 1);
                            }}
                        >
                            ←
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(selectedImage === trainingImages.length - 1 ? 0 : selectedImage + 1);
                            }}
                        >
                            →
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </section>
    );
}
