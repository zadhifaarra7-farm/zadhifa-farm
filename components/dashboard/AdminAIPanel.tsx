'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, Calendar, TrendingUp, Tag } from 'lucide-react';

export default function AdminAIPanel() {
    const [promo, setPromo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generatePromo = () => {
        setLoading(true);
        // Simulate AI generation based on inventory surplus
        setTimeout(() => {
            setPromo("🎉 PROMO AGUSTUS: Diskon 10% untuk Domba Garut diatas 40kg! Stok melimpah di Kandang B.");
            setLoading(false);
        }, 1500);
    };

    return (
        <Card className="p-6 space-y-6 bg-gradient-to-br from-surface to-surface-elevated">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">AI Assistant Task</h3>
                    <p className="text-xs text-text-muted">Smart Marketing & Pricing</p>
                </div>
            </div>

            {/* Monthly Promo Generator */}
            <div className="space-y-3 border-b border-white/5 pb-6">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-farm-300">
                    <Calendar className="w-4 h-4" /> Monthly Promo
                </h4>
                <p className="text-xs text-text-muted">
                    Generate marketing copy based on current inventory surplus.
                </p>

                {promo && (
                    <div className="p-3 bg-farm-500/10 border border-farm-500/20 rounded-lg text-sm italic text-farm-300">
                        "{promo}"
                    </div>
                )}

                <Button
                    className="w-full btn-gold"
                    size="sm"
                    onClick={generatePromo}
                    isLoading={loading}
                >
                    {loading ? 'Analyzing Inventory...' : 'Generate New Promo'}
                </Button>
            </div>

            {/* Recommended Pricing (Dorper/Garut) */}
            <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-300">
                    <Tag className="w-4 h-4" /> AI Price Suggestions
                </h4>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs p-2 bg-white/5 rounded">
                        <span className="text-text-muted">Dorper Grade A</span>
                        <span className="font-mono text-green-400">Rp 15.5jt <span className="text-[10px] text-white/30">▲ 2%</span></span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 bg-white/5 rounded">
                        <span className="text-text-muted">Garut Jantan (Show)</span>
                        <span className="font-mono text-green-400">Rp 26.5jt <span className="text-[10px] text-white/30">▲ 5%</span></span>
                    </div>
                    <div className="flex justify-between items-center text-xs p-2 bg-white/5 rounded">
                        <span className="text-text-muted">Garut Potong (HORECA)</span>
                        <span className="font-mono text-yellow-400">Rp 4.8jt <span className="text-[10px] text-white/30">▼ 1%</span></span>
                    </div>
                </div>
                <Button variant="outline" className="w-full text-xs" size="sm">
                    Update All Prices
                </Button>
            </div>
        </Card>
    );
}
