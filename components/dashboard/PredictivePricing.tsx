'use client';

import { Card } from '@/components/ui/Card';
import { Brain, Calendar, TrendingUp } from 'lucide-react';

export default function PredictivePricing() {
    return (
        <Card variant="premium" className="p-6 relative overflow-hidden">
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
                        H-2 Idul Adha
                    </div>
                </div>

                <div>
                    <div className="text-sm text-text-muted mb-1">Estimasi Kenaikan</div>
                    <div className="flex items-center gap-2 text-3xl font-bold text-white">
                        <TrendingUp className="w-6 h-6 text-farm-500" />
                        ~40%
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                        *Berdasarkan tren umum menjelang hari raya
                    </p>
                </div>

                <div className="text-xs text-center text-farm-500/60 bg-farm-500/5 py-2 rounded">
                    Fitur prediksi detail akan aktif saat data cukup
                </div>
            </div>
        </Card>
    );
}
