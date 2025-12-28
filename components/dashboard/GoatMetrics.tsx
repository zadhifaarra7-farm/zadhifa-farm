'use client';

import { Card } from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';

export default function GoatMetrics() {
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
