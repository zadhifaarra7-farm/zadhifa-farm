'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, Calculator, Calendar, Check, Star } from 'lucide-react';
import { searchGoats } from '@/lib/actions/ai-finder';

type Purpose = 'QURBAN' | 'AQIQAH' | 'BREEDING' | 'HORECA';

export default function AIGoatFinder() {
    const [step, setStep] = useState<'form' | 'results'>('form');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    // Form State
    const [budget, setBudget] = useState(5000000);
    const [purpose, setPurpose] = useState<Purpose>('QURBAN');
    const [date, setDate] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        try {
            const matches = await searchGoats({
                budget,
                purpose,
                eventDate: date ? new Date(date) : undefined
            });

            setTimeout(() => {
                setResults(matches);
                setLoading(false);
                setStep('results');
            }, 1500);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-farm-500/10 rounded-full blur-[100px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px]" />

            <div className="container-custom px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Asisten <span className="text-gradient">Cerdas AI</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-text-muted max-w-2xl mx-auto"
                    >
                        Biarkan algoritma cerdas kami menemukan ternak yang sempurna sesuai budget,
                        tujuan, dan preferensi kualitas Anda dalam hitungan detik.
                    </motion.p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        {step === 'form' ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card variant="premium" className="p-8 md:p-12 backdrop-blur-xl">
                                    <div className="grid md:grid-cols-2 gap-12">
                                        {/* Left Col: Preferences */}
                                        <div className="space-y-8">
                                            <div>
                                                <label className="block text-sm font-medium text-farm-300 mb-3 flex items-center gap-2">
                                                    <Calculator className="w-4 h-4" /> Budget Anda
                                                </label>
                                                <div className="text-2xl font-bold text-white mb-4 font-mono">
                                                    {formatRupiah(budget)}
                                                </div>
                                                <input
                                                    type="range"
                                                    min="2000000"
                                                    max="25000000"
                                                    step="500000"
                                                    value={budget}
                                                    onChange={(e) => setBudget(Number(e.target.value))}
                                                    className="w-full accent-farm-500"
                                                />
                                                <div className="flex justify-between text-xs text-text-muted mt-2">
                                                    <span>Rp 2jt</span>
                                                    <span>Rp 25jt+</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-farm-300 mb-3 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" /> Tanggal Acara
                                                </label>
                                                <input
                                                    type="date"
                                                    className="input w-full"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Right Col: Purpose Selection */}
                                        <div className="space-y-6">
                                            <label className="block text-sm font-medium text-farm-300 mb-2">Tujuan</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {(['QURBAN', 'AQIQAH', 'BREEDING', 'HORECA'] as Purpose[]).map((p) => (
                                                    <div
                                                        key={p}
                                                        onClick={() => setPurpose(p)}
                                                        className={`
                              cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between group
                              ${purpose === p
                                                                ? 'bg-farm-500/10 border-farm-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                                                                : 'bg-surface border-white/5 hover:border-farm-500/30'
                                                            }
                            `}
                                                    >
                                                        <span className="font-medium tracking-wide text-xs md:text-sm">
                                                            {p === 'HORECA' ? 'HOTEL/RESTO' : p === 'BREEDING' ? 'TERNAK' : p}
                                                        </span>
                                                        <div className={`
                              w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                              ${purpose === p ? 'bg-farm-500 border-farm-500' : 'border-farm-700 group-hover:border-farm-500'}
                            `}>
                                                            {purpose === p && <Check className="w-2 h-2 text-white" />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button
                                                onClick={handleSearch}
                                                isLoading={loading}
                                                className="w-full mt-4 btn-gold"
                                                size="lg"
                                            >
                                                {loading ? 'Menganalisis...' : 'Cari Kambing Ideal'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-semibold">Rekomendasi Terbaik</h3>
                                    <Button variant="outline" onClick={() => setStep('form')} size="sm">
                                        Ubah Pencarian
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {results.map((goat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 relative h-full flex flex-col">
                                                {/* Match Badge */}
                                                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md border border-farm-500/50 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-gold-400 fill-current" />
                                                    <span className="text-sm font-bold text-farm-300">{goat.match}% Cocok</span>
                                                </div>

                                                {/* Image Placeholder */}
                                                <div className="h-48 bg-surface-elevated relative overflow-hidden shrink-0">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                                    <div className="w-full h-full bg-farm-900/20 group-hover:scale-105 transition-transform duration-700" />
                                                </div>

                                                <div className="p-6 flex flex-col flex-1">
                                                    <h4 className="text-xl font-bold mb-2">{goat.name}</h4>
                                                    <div className="flex gap-2 mb-4">
                                                        <span className="px-2 py-1 bg-farm-500/10 text-farm-300 text-xs rounded border border-farm-500/20">{goat.breed}</span>
                                                        <span className="px-2 py-1 bg-surface text-text-muted text-xs rounded border border-white/5">{goat.weight} kg</span>
                                                    </div>

                                                    <div className="flex items-end justify-between mt-auto">
                                                        <div>
                                                            <p className="text-xs text-text-muted mb-1">Harga Estimasi</p>
                                                            <p className="text-lg font-bold text-gold-400">{formatRupiah(goat.price)}</p>
                                                        </div>
                                                        <Button size="sm" className="rounded-lg">Lihat</Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}

                                    {results.length === 0 && (
                                        <div className="col-span-3 text-center py-12 text-text-muted">
                                            Tidak ada kambing yang cocok. Coba sesuaikan budget Anda.
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
