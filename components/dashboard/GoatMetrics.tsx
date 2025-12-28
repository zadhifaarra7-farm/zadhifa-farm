'use client';

import { Card } from '@/components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ArrowUpRight } from 'lucide-react';

const data = [
    { month: 'Jan', weight: 45, projected: 45 },
    { month: 'Feb', weight: 52, projected: 50 },
    { month: 'Mar', weight: 61, projected: 58 },
    { month: 'Apr', weight: 68, projected: 65 },
    { month: 'Mei', weight: 74, projected: 72 },
    { month: 'Jun', weight: null, projected: 82 },
    { month: 'Jul', weight: null, projected: 90 },
];

export default function GoatMetrics() {
    return (
        <Card className="p-6 h-full">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold mb-1">Grafik Pertumbuhan</h3>
                    <p className="text-sm text-text-muted">Rata-rata Pertambahan Harian (ADG)</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-farm-400 flex items-center gap-1">
                        +18.5% <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-text-muted">vs bulan lalu</p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="month" stroke="#6b7c74" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#6b7c74" fontSize={12} tickLine={false} axisLine={false} unit="kg" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#121a16', border: '1px solid #22c55e30', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="projected"
                            stroke="#fbbf24"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="url(#colorProjected)"
                            name="Proyeksi (AI)"
                        />
                        <Area
                            type="monotone"
                            dataKey="weight"
                            stroke="#22c55e"
                            strokeWidth={3}
                            fill="url(#colorWeight)"
                            name="Berat Aktual"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-4 mt-4 text-sm text-text-muted justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-farm-500" />
                    Pertumbuhan Aktual
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gold-500 border border-dashed border-white/50" />
                    Proyeksi AI
                </div>
            </div>
        </Card>
    );
}
