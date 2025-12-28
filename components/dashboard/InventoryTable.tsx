'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface InventoryItem {
    id: string;
    name: string;
    breed: string;
    currentWeight: number;
    age: string;
    status: string;
    pen: string;
    rawId: string;
}

interface Props {
    data: InventoryItem[];
}

export default function InventoryTable({ data }: Props) {
    const [filter, setFilter] = useState('ALL');

    const statusLabels: { [key: string]: string } = {
        'EXCELLENT': 'Sangat Baik',
        'GOOD': 'Baik',
        'FAIR': 'Cukup',
        'HEALTHY': 'Sehat',
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold">Inventaris Ternak</h3>
                    <p className="text-sm text-text-muted">Total {data.length} ekor</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Link href="/dashboard/inventory">
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" /> Tambah
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-text-muted text-sm uppercase tracking-wider">
                            <th className="py-4 px-4 font-medium">ID / Nama</th>
                            <th className="py-4 px-4 font-medium">Jenis</th>
                            <th className="py-4 px-4 font-medium">Fisik</th>
                            <th className="py-4 px-4 font-medium">Lokasi</th>
                            <th className="py-4 px-4 font-medium">Status</th>
                            <th className="py-4 px-4 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((goat) => (
                            <tr key={goat.rawId} className="hover:bg-white/5 transition-colors group">
                                <td className="py-4 px-4">
                                    <div className="font-bold text-white max-w-[140px] truncate">{goat.name}</div>
                                    <div className="text-xs text-text-muted font-mono">{goat.id}</div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="px-2 py-1 bg-surface rounded text-sm border border-white/5">
                                        {goat.breed}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="text-sm font-medium">{goat.currentWeight} kg</div>
                                    <div className="text-xs text-text-muted">{goat.age}</div>
                                </td>
                                <td className="py-4 px-4 text-sm text-text-muted">
                                    {goat.pen}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`
                     inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap
                     ${goat.status === 'EXCELLENT' || goat.status === 'GOOD' || goat.status === 'HEALTHY'
                                            ? 'bg-farm-500/10 text-farm-400 border-farm-500/20'
                                            : 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                                        }
                   `}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${goat.status === 'EXCELLENT' || goat.status === 'GOOD' || goat.status === 'HEALTHY' ? 'bg-farm-500' : 'bg-gold-500'}`} />
                                        {statusLabels[goat.status] || goat.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
