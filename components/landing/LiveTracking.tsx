'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Activity, Thermometer, Droplets, Wind, Wifi, AlertCircle } from 'lucide-react';

// Simulated IoT Data Type
type SensorData = {
    temp: number;
    humidity: number;
    ammonia: number;
    status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
};

export default function LiveTracking() {
    const [data, setData] = useState<SensorData>({
        temp: 28.5,
        humidity: 65,
        ammonia: 12,
        status: 'OPTIMAL',
    });

    // Simulate Real-time Updates
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => ({
                temp: +(prev.temp + (Math.random() - 0.5)).toFixed(1),
                humidity: +(prev.humidity + (Math.random() * 2 - 1)).toFixed(0),
                ammonia: +(Math.max(10, Math.min(25, prev.ammonia + (Math.random() * 0.5 - 0.2)))).toFixed(1),
                status: prev.ammonia > 20 ? 'WARNING' : 'OPTIMAL',
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-surface-elevated/30 relative">
            <div className="container-custom px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-farm-500/10 border border-farm-500/20 text-farm-300 text-sm font-medium">
                            <Wifi className="w-4 h-4 animate-pulse" />
                            Live IoT System
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold">
                            Real-time <span className="text-gradient">Farm Intelligence</span>
                        </h2>

                        <p className="text-text-muted text-lg leading-relaxed">
                            We monitor every heartbeat of our farm. Our advanced IoT network tracks temperature,
                            humidity, and air quality 24/7 to ensure optimal growth conditions for your livestock.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="p-4 rounded-xl bg-surface border border-white/5">
                                <div className="text-3xl font-bold text-farm-400 mb-1">24/7</div>
                                <div className="text-sm text-text-muted">Continuous Monitoring</div>
                            </div>
                            <div className="p-4 rounded-xl bg-surface border border-white/5">
                                <div className="text-3xl font-bold text-gold-400 mb-1">0.1s</div>
                                <div className="text-sm text-text-muted">Data Latency</div>
                            </div>
                        </div>
                    </div>

                    {/* IoT Dashboard Component */}
                    <div className="relative">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-farm-500/20 blur-[100px] rounded-full" />

                        <Card className="relative z-10 p-6 md:p-8 border-farm-500/30">
                            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Activity className="text-farm-500" />
                                    Pen A1 - Etawa Prime
                                </h3>
                                <div className={`px-3 py-1 rounded text-xs font-bold ${data.status === 'OPTIMAL' ? 'bg-farm-500/20 text-farm-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {data.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Temperature */}
                                <div className="aspect-square rounded-2xl bg-surface/50 p-4 flex flex-col justify-between group hover:bg-surface transition-colors">
                                    <div className="flex justify-between items-start">
                                        <Thermometer className="text-farm-400 w-6 h-6" />
                                        <span className="text-xs text-text-muted">Temp</span>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
                                            {data.temp}°C
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                                                animate={{ width: `${(data.temp / 40) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Humidity */}
                                <div className="aspect-square rounded-2xl bg-surface/50 p-4 flex flex-col justify-between group hover:bg-surface transition-colors">
                                    <div className="flex justify-between items-start">
                                        <Droplets className="text-blue-400 w-6 h-6" />
                                        <span className="text-xs text-text-muted">Humid</span>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
                                            {data.humidity}%
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-blue-500"
                                                animate={{ width: `${data.humidity}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Air Quality */}
                                <div className="col-span-2 rounded-2xl bg-surface/50 p-4 flex items-center justify-between group hover:bg-surface transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-gold-500/10">
                                            <Wind className="text-gold-400 w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-text-muted">Air Quality (Ammonia)</div>
                                            <div className="text-xl font-bold">{data.ammonia} ppm</div>
                                        </div>
                                    </div>
                                    {data.ammonia > 15 && (
                                        <AlertCircle className="text-red-500 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </section>
    );
}
