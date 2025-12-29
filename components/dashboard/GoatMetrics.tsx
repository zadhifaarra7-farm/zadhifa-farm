'use client';

import { Card } from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightData {
    date: string;
    avgWeight: number;
    count: number;
}

interface Props {
    data: WeightData[];
}

export default function GoatMetrics({ data }: Props) {
    // If no data, show placeholder
    if (!data || data.length === 0) {
        return (
            <Card className="p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-farm-500/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-farm-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Grafik Pertumbuhan</h3>
                <p className="text-sm text-text-muted max-w-xs">
                    Data pertumbuhan akan muncul setelah Anda menambahkan domba dan mencatat berat secara berkala.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-farm-500" />
                <h3 className="text-lg font-semibold">Grafik Pertumbuhan</h3>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#888', fontSize: 12 }}
                            unit=" kg"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1f1c',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px'
                            }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="avgWeight"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ fill: '#22c55e', strokeWidth: 2 }}
                            name="Rata-rata Berat"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
