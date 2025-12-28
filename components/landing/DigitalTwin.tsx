'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { QrCode, Smartphone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DigitalTwin() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container-custom px-4 z-10 relative">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Phone/QR Visual */}
                    <div className="order-2 md:order-1 relative flex justify-center">
                        {/* Abstract Shapes */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-farm-600/20 to-gold-500/20 blur-[80px] rounded-full" />

                        <motion.div
                            initial={{ rotate: -5, y: 20 }}
                            whileInView={{ rotate: 0, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            <Card className="w-[300px] h-[600px] border-4 border-surface bg-[#0a0f0d] shadow-2xl rounded-[3rem] overflow-hidden flex flex-col relative">
                                {/* Phone Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-surface rounded-b-2xl z-20" />

                                {/* Digital Twin UI Mockup */}
                                <div className="flex-1 p-6 pt-12 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white p-1 rounded-xl">
                                            {/* Mock QR */}
                                            <div className="w-full h-full border-2 border-dashed border-black/20 pattern-dots" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-text-muted uppercase tracking-wider">Scanned ID</div>
                                            <div className="font-bold text-lg">ZF-2024-882</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-surface-elevated p-4 rounded-xl border border-white/5">
                                            <div className="text-xs text-text-muted mb-1">Breed</div>
                                            <div className="font-semibold">Etawa Super Grade A</div>
                                        </div>

                                        <div className="bg-surface-elevated p-4 rounded-xl border border-white/5">
                                            <div className="text-xs text-text-muted mb-1">Health Status</div>
                                            <div className="font-semibold text-farm-400 flex items-center gap-2">
                                                ● Excellent Condition
                                            </div>
                                        </div>

                                        <div className="bg-surface-elevated p-4 rounded-xl border border-white/5">
                                            <div className="text-xs text-text-muted mb-1">Weight History</div>
                                            <div className="h-24 flex items-end justify-between gap-1 pt-4">
                                                {[40, 55, 60, 75, 82].map((h, i) => (
                                                    <div key={i} style={{ height: `${h}%` }} className="w-full bg-farm-500/50 rounded-t-sm" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Buy Button */}
                                <div className="p-6 bg-surface-elevated border-t border-white/5">
                                    <div className="w-full py-3 bg-white text-black font-bold text-center rounded-xl">
                                        Adopt Now
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div className="order-1 md:order-2 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Every Goat Has a <br />
                            <span className="text-gradient-gold">Digital Twin</span>
                        </h2>

                        <p className="text-text-muted text-lg leading-relaxed">
                            Transparency found nowhere else. Scan the QR code on any livestock to instantly access
                            its complete digital ledger: lineage, vaccination history, daily weight logs, and more.
                            Immutable proof of quality.
                        </p>

                        <ul className="space-y-4">
                            {[
                                'Full Pedigree & Genetic Lineage',
                                'Vaccination & Medical Records',
                                'Growth & Nutrition Analytics',
                                'Ethical Sourcing Verification'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-farm-500/20 flex items-center justify-center">
                                        <CheckIcon className="w-3 h-3 text-farm-400" />
                                    </div>
                                    <span className="text-white/90">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Button className="gap-2 group">
                            <QrCode className="w-4 h-4" />
                            Try Demo Scan
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
}

function CheckIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
