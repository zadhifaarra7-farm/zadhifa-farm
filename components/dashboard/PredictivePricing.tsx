'use client';

import { Card } from '@/components/ui/Card';
import { TrendingUp, Calendar, Brain } from 'lucide-react';

export default function PredictivePricing() {
    return (
        <Card variant="premium" className="p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[40px] pointer-events-none" />

            <div className="flex items-center gap-2 mb-6 text-gold-400">
                <Brain className="w-5 h-5" />
                <span className="text-sm font-bold tracking-widest uppercase">Prediksi Harga AI</span>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="text-sm text-text-muted mb-1">Tanggal Puncak Harga</div>
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <Calendar className="w-5 h-5 text-farm-400" />
                        15 Juni 2025
                        <span className="text-xs bg-surface border border-white/10 px-2 py-1 rounded font-normal text-text-muted">
                            H-2 Idul Adha
                        </span>
                    </div>
                </div>

                <div>
                    <div className="text-sm text-text-muted mb-1">Prediksi Kenaikan Pasar</div>
                    <div className="flex items-center gap-2 text-3xl font-bold text-white">
                        <TrendingUp className="w-6 h-6 text-farm-500" />
                        +42.5%
                    </div>
                    <div className="w-full bg-surface-elevated h-2 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-farm-600 to-gold-500 w-[75%]" />
                    </div>
                    <p className="text-xs text-text-muted mt-2 text-right">Tingkat Akurasi: 89%</p>
                </div>

                <div className="p-4 bg-surface/50 rounded-xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-text-muted">Harga Rata-rata/kg Saat Ini</span>
                        <span className="font-mono font-medium">Rp 95.000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-text-muted">Prediksi Harga Puncak</span>
                        <span className="font-mono font-bold text-gold-400">Rp 135.000</span>
                    </div>
                </div>

                <div className="text-xs text-center text-farm-500/60 bg-farm-500/5 py-2 rounded">
                    * Berdasarkan data historis pasar 5 tahun
                </div>
            </div>
        </Card>
    );
}
