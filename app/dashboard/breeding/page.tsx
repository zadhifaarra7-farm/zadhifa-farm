'use client';

import { useState, useEffect } from 'react';
import { getBreedingStock, simulateMating } from '@/lib/actions/breeding';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dna, ArrowRight, Activity, Zap, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function BreedingPage() {
    const [stock, setStock] = useState<{ males: any[], females: any[] }>({ males: [], females: [] });
    const [sire, setSire] = useState<string>('');
    const [dam, setDam] = useState<string>('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBreedingStock().then(setStock);
    }, []);

    const handleSimulate = async () => {
        if (!sire || !dam) return;
        setLoading(true);
        const res = await simulateMating(sire, dam);
        setResult(res);
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="secondary" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Home className="w-4 h-4" />
                            Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4 text-purple-400 mb-8">
                    <Dna className="w-10 h-10" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Genetics Lab</h1>
                        <p className="text-text-muted">Simulate mating outcomes and optimize herd genetics.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Sire Selection */}
                    <Card className="p-6 space-y-4 border-blue-500/20">
                        <div className="flex justify-between">
                            <h3 className="text-xl font-bold text-blue-400">Sire (Pejantan)</h3>
                            <span className="text-xs bg-blue-500/10 px-2 py-1 rounded">{stock.males.length} Available</span>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {stock.males.map(m => (
                                <div
                                    key={m.id}
                                    onClick={() => setSire(m.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${sire === m.id ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    <div className="font-bold">{m.name}</div>
                                    <div className="text-xs text-text-muted">{m.breed} • {m.currentWeight}kg</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {m.tags.map((t: string) => <span key={t} className="text-[10px] bg-black/30 px-1 rounded">{t}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Mating Action */}
                    <div className="flex flex-col items-center justify-center space-y-4 pt-12 self-stretch">
                        <div className="w-px h-20 bg-gradient-to-b from-blue-500 to-pink-500 hidden md:block" />
                        <Button
                            className="bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90 w-full h-16 text-lg font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                            onClick={handleSimulate}
                            disabled={!sire || !dam || loading}
                        >
                            {loading ? 'Simulating...' : 'Simulate Mating'}
                            <Zap className="ml-2 w-5 h-5" />
                        </Button>
                        <div className="w-px h-20 bg-gradient-to-b from-purple-500 to-transparent hidden md:block" />
                    </div>

                    {/* Dam Selection */}
                    <Card className="p-6 space-y-4 border-pink-500/20">
                        <div className="flex justify-between">
                            <h3 className="text-xl font-bold text-pink-400">Dam (Indukan)</h3>
                            <span className="text-xs bg-pink-500/10 px-2 py-1 rounded">{stock.females.length} Available</span>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {stock.females.map(f => (
                                <div
                                    key={f.id}
                                    onClick={() => setDam(f.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${dam === f.id ? 'bg-pink-500/20 border-pink-500' : 'bg-white/5 border-transparent hover:bg-white/10'
                                        }`}
                                >
                                    <div className="font-bold">{f.name}</div>
                                    <div className="text-xs text-text-muted">{f.breed} • {f.currentWeight}kg</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {f.tags.map((t: string) => <span key={t} className="text-[10px] bg-black/30 px-1 rounded">{t}</span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Results - Animate In */}
                {result && result.success && (
                    <Card className="p-8 bg-gradient-to-br from-surface-elevated to-purple-900/10 border-purple-500/30 animate-in slide-in-from-bottom-4 zoom-in-95">
                        <h2 className="text-2xl font-bold text-center mb-8">🧬 Simulation Results</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-x divide-white/10">
                            <div>
                                <p className="text-text-muted text-sm uppercase">Predicted Breed</p>
                                <p className="text-xl font-bold text-white mt-2">{result.prediction.breed}</p>
                            </div>
                            <div>
                                <p className="text-text-muted text-sm uppercase">Potential Weight (Adult)</p>
                                <p className="text-4xl font-mono font-bold text-gold-400 mt-2">{result.prediction.potentialWeight} kg</p>
                                <p className="text-xs text-green-400 mt-1 flex justify-center items-center gap-1">
                                    <Activity className="w-3 h-3" /> Superior Genetics (+10%)
                                </p>
                            </div>
                            <div>
                                <p className="text-text-muted text-sm uppercase">Market Valuation</p>
                                <p className="text-xl font-bold text-white mt-2">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(result.prediction.marketValue)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <h4 className="text-sm text-text-muted mb-4 uppercase text-center">Inherited Traits Map</h4>
                            <div className="flex justify-center flex-wrap gap-2">
                                {result.prediction.inheritedTraits.map((t: string) => (
                                    <span key={t} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
