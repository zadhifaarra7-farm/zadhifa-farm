'use client';

import { getCustomers, sendBroadcast, CustomerProfile } from '@/lib/actions/crm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Users, Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CustomerPage() {
    const [customers, setCustomers] = useState<CustomerProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        getCustomers().then(data => {
            setCustomers(data);
            setLoading(false);
        })
    }, []);

    const toggleSelect = (id: string) => {
        if (selected.includes(id)) setSelected(prev => prev.filter(x => x !== id));
        else setSelected(prev => [...prev, id]);
    }

    const handleBroadcast = async () => {
        if (selected.length === 0) return alert('Pilih customer dulu');
        const msg = prompt("Tulis pesan promo (misal: Diskon 10% Spesial Idul Adha!)");
        if (!msg) return;

        setSending(true);
        await sendBroadcast(msg, selected);
        alert(`Berhasil mengirim pesan ke ${selected.length} orang!`);
        setSending(false);
        setSelected([]);
    }

    if (loading) return <div className="p-8 text-white">Loading CRM...</div>

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center run-in">
                    <div>
                        <Link href="/dashboard" className="text-text-muted hover:text-white flex items-center gap-2 mb-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-farm-500" />
                            <div>
                                <h1 className="text-3xl font-bold">Customer Loyalty</h1>
                                <p className="text-text-muted">{customers.length} Active Buyers • Total LTV: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(customers.reduce((a, b) => a + b.totalSpent, 0))}</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleBroadcast}
                        disabled={sending || selected.length === 0}
                        className="btn-gold gap-2"
                    >
                        <MessageSquare className="w-4 h-4" />
                        {sending ? 'Sending...' : `Broadcast Promo (${selected.length})`}
                    </Button>
                </div>

                {/* Customer Table */}
                <Card className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-surface-elevated text-xs uppercase text-text-muted tracking-wider">
                                <th className="p-4 w-12 text-center">
                                    <input type="checkbox" onChange={(e) => {
                                        if (e.target.checked) setSelected(customers.map(c => c.id));
                                        else setSelected([]);
                                    }} />
                                </th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Total Orders</th>
                                <th className="p-4 text-right">Lifetime Value (LTV)</th>
                                <th className="p-4">Last Seen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {customers.map(c => (
                                <tr key={c.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => toggleSelect(c.id)}>
                                    <td className="p-4 text-center">
                                        <input type="checkbox" checked={selected.includes(c.id)} onChange={() => { }} className="accent-farm-500" />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-white group-hover:text-farm-400 transition-colors">
                                            {c.name}
                                        </div>
                                        <div className="text-xs text-text-muted">{c.email} | {c.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                                                c.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-white/10 text-white/50'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pl-8">
                                        {c.totalOrders}
                                    </td>
                                    <td className="p-4 text-right font-mono text-gold-400">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(c.totalSpent)}
                                    </td>
                                    <td className="p-4 text-xs text-text-muted">
                                        {new Date(c.lastPurchase).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    )
}
