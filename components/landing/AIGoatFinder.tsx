'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, Calculator, Calendar, Check, Star, ShoppingCart, X, User, Phone, FileText } from 'lucide-react';
import { searchGoats } from '@/lib/actions/ai-finder';
import { createOrderById } from '@/lib/actions/order';

type Purpose = 'QURBAN' | 'AQIQAH' | 'BREEDING' | 'HORECA';

interface Goat {
    id: string;
    name: string;
    breed: string;
    weight: number;
    price: number;
    match: number;
    image?: string;
}

export default function AIGoatFinder() {
    const [step, setStep] = useState<'form' | 'results' | 'checkout'>('form');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Goat[]>([]);
    const [selectedGoats, setSelectedGoats] = useState<Goat[]>([]);

    // Form State
    const [budget, setBudget] = useState(5000000);
    const [purpose, setPurpose] = useState<Purpose>('QURBAN');
    const [date, setDate] = useState('');

    // Checkout Form State
    const [buyerName, setBuyerName] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');
    const [checkingOut, setCheckingOut] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setSelectedGoats([]); // Reset selection
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

    const toggleGoatSelection = (goat: Goat) => {
        if (selectedGoats.find(g => g.id === goat.id)) {
            setSelectedGoats(prev => prev.filter(g => g.id !== goat.id));
        } else {
            setSelectedGoats(prev => [...prev, goat]);
        }
    };

    const isSelected = (goatId: string) => selectedGoats.some(g => g.id === goatId);

    const totalPrice = selectedGoats.reduce((sum, g) => sum + g.price, 0);

    const handleCheckout = async () => {
        if (!buyerName || !buyerPhone) {
            alert('Mohon isi nama dan nomor WhatsApp');
            return;
        }

        setCheckingOut(true);

        try {
            // For now, process first selected goat (can extend for multiple)
            // In real implementation, would create cart order
            for (const goat of selectedGoats) {
                const result = await createOrderById(goat.id, buyerName, buyerPhone);
                if (result.success && result.text) {
                    // Open WhatsApp with order message
                    const waUrl = `https://wa.me/${result.phone}?text=${encodeURIComponent(result.text)}`;
                    window.open(waUrl, '_blank');
                }
            }

            // Reset after checkout
            setSelectedGoats([]);
            setBuyerName('');
            setBuyerPhone('');
            setStep('results');
            alert('Order berhasil! Silahkan lanjutkan di WhatsApp untuk konfirmasi.');
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Terjadi kesalahan. Silahkan coba lagi.');
        }

        setCheckingOut(false);
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <section id="ai-finder" className="py-24 relative overflow-hidden">
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
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-lg text-text-muted">Rp</span>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={budget.toLocaleString('id-ID')}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '');
                                                            const num = parseInt(value) || 0;
                                                            setBudget(Math.min(num, 100000000));
                                                        }}
                                                        className="input text-2xl font-bold font-mono flex-1 text-center"
                                                        placeholder="5.000.000"
                                                    />
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1000000"
                                                    max="50000000"
                                                    step="500000"
                                                    value={budget}
                                                    onChange={(e) => setBudget(Number(e.target.value))}
                                                    className="w-full accent-farm-500"
                                                />
                                                <div className="flex justify-between text-xs text-text-muted mt-2">
                                                    <span>Rp 1jt</span>
                                                    <span>Rp 50jt+</span>
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
                                                {loading ? 'Menganalisis...' : 'Cari Domba Ideal'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : step === 'results' ? (
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
                                            key={goat.id || i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-500 relative h-full flex flex-col ${isSelected(goat.id) ? 'ring-2 ring-farm-500' : ''}`}>
                                                {/* Selection Checkbox */}
                                                <div
                                                    className="absolute top-4 left-4 z-20 cursor-pointer"
                                                    onClick={() => toggleGoatSelection(goat)}
                                                >
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected(goat.id)
                                                        ? 'bg-farm-500 border-farm-500'
                                                        : 'bg-black/50 border-white/30 hover:border-farm-400'
                                                        }`}>
                                                        {isSelected(goat.id) && <Check className="w-4 h-4 text-white" />}
                                                    </div>
                                                </div>

                                                {/* Match Badge */}
                                                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md border border-farm-500/50 px-3 py-1 rounded-full flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-gold-400 fill-current" />
                                                    <span className="text-sm font-bold text-farm-300">{goat.match}% Cocok</span>
                                                </div>

                                                {/* Goat Image */}
                                                <div className="h-48 bg-surface-elevated relative overflow-hidden shrink-0">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                                    {goat.image ? (
                                                        <img
                                                            src={goat.image}
                                                            alt={goat.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-farm-900/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                                            <span className="text-6xl">🐑</span>
                                                        </div>
                                                    )}
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
                                                        <Button
                                                            size="sm"
                                                            className={`rounded-lg ${isSelected(goat.id) ? 'bg-farm-500' : ''}`}
                                                            onClick={() => toggleGoatSelection(goat)}
                                                        >
                                                            {isSelected(goat.id) ? 'Dipilih' : 'Pilih'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}

                                    {results.length === 0 && (
                                        <div className="col-span-3 text-center py-12 text-text-muted">
                                            Tidak ada domba yang cocok. Coba sesuaikan budget Anda.
                                        </div>
                                    )}
                                </div>

                                {/* Cart Summary - Fixed Bottom */}
                                {selectedGoats.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="fixed bottom-0 left-0 right-0 bg-surface-elevated/95 backdrop-blur-lg border-t border-white/10 p-4 z-50"
                                    >
                                        <div className="container-custom flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-farm-400">
                                                    <ShoppingCart className="w-5 h-5" />
                                                    <span className="font-bold">{selectedGoats.length} dipilih</span>
                                                </div>
                                                <div className="hidden md:block text-text-muted">|</div>
                                                <div className="text-lg font-bold text-gold-400">
                                                    Total: {formatRupiah(totalPrice)}
                                                </div>
                                            </div>
                                            <Button
                                                className="btn-gold gap-2"
                                                onClick={() => setStep('checkout')}
                                            >
                                                <FileText className="w-4 h-4" />
                                                Checkout
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            // Checkout Step
                            <motion.div
                                key="checkout"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-2xl mx-auto"
                            >
                                <Card className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-farm-400" />
                                            Checkout
                                        </h3>
                                        <Button variant="ghost" size="sm" onClick={() => setStep('results')}>
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-surface rounded-lg p-4 mb-6">
                                        <h4 className="font-semibold mb-3">Ringkasan Pesanan</h4>
                                        <div className="space-y-2">
                                            {selectedGoats.map(goat => (
                                                <div key={goat.id} className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <div>
                                                        <span className="font-medium">{goat.name}</span>
                                                        <span className="text-xs text-text-muted ml-2">({goat.breed} - {goat.weight}kg)</span>
                                                    </div>
                                                    <span className="font-mono text-gold-400">{formatRupiah(goat.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center pt-4 font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-gold-400">{formatRupiah(totalPrice)}</span>
                                        </div>
                                    </div>

                                    {/* Buyer Info Form */}
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2 flex items-center gap-2">
                                                <User className="w-4 h-4" /> Nama Lengkap *
                                            </label>
                                            <input
                                                type="text"
                                                value={buyerName}
                                                onChange={(e) => setBuyerName(e.target.value)}
                                                className="input w-full"
                                                placeholder="Masukkan nama Anda"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2 flex items-center gap-2">
                                                <Phone className="w-4 h-4" /> Nomor WhatsApp *
                                            </label>
                                            <input
                                                type="tel"
                                                value={buyerPhone}
                                                onChange={(e) => setBuyerPhone(e.target.value)}
                                                className="input w-full"
                                                placeholder="08xxxxxxxxxx"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <Button
                                        className="w-full btn-gold gap-2"
                                        size="lg"
                                        onClick={handleCheckout}
                                        isLoading={checkingOut}
                                    >
                                        {checkingOut ? 'Memproses...' : 'Buat Invoice & Order via WhatsApp'}
                                    </Button>

                                    <p className="text-xs text-text-muted text-center mt-4">
                                        Invoice akan otomatis dibuat dan dikirim ke admin untuk diproses
                                    </p>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
