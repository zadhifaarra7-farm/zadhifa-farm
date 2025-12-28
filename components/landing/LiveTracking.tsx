'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Wifi, Thermometer, Droplets, Wind, Activity } from 'lucide-react';

export default function LiveTracking() {
    return (
        <section id="tracking" className="section relative overflow-hidden">
            <div className="container-custom">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        <Wifi className="w-4 h-4" />
                        Pemantauan IoT
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Monitoring <span className="text-farm-400">Real-Time</span>
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Pantau kondisi kandang dan ternak Anda secara langsung melalui sensor IoT.
                    </p>
                </motion.div>

                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-8 text-center">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="p-4 rounded-xl bg-surface-elevated/50">
                                <Thermometer className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">--°C</div>
                                <div className="text-xs text-text-muted">Suhu</div>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-elevated/50">
                                <Droplets className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">--%</div>
                                <div className="text-xs text-text-muted">Kelembaban</div>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-elevated/50">
                                <Wind className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">-- ppm</div>
                                <div className="text-xs text-text-muted">Amonia</div>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-elevated/50">
                                <Activity className="w-8 h-8 text-farm-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">--</div>
                                <div className="text-xs text-text-muted">Aktivitas</div>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            Sensor belum terhubung
                        </div>

                        <p className="text-sm text-text-muted mt-4">
                            Hubungi admin untuk pemasangan sensor IoT di kandang Anda
                        </p>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
