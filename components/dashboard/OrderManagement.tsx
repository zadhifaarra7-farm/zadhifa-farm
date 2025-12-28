'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateOrderStatus, exportOrdersToCSV } from '@/lib/actions/order';
import { ArrowLeft, CheckCircle, Truck, XCircle, Search, Filter, Download, Eye } from 'lucide-react';
import Link from 'next/link';

// Types (simplified)
interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    createdAt: Date;
    user: { name: string | null; phone: string | null; };
    items: { goat: { breed: string; name: string } }[];
}

export default function OrderManagementPage({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filter, setFilter] = useState('ALL');

    const handleUpdate = async (id: string, status: string, payment?: string) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status, paymentStatus: payment || o.paymentStatus } : o));

        const res = await updateOrderStatus(id, status, payment);
        if (!res.success) alert('Failed to update');
    };

    const handleExport = async () => {
        const csv = await exportOrdersToCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter || o.paymentStatus === filter);

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link href="/dashboard" className="text-text-muted hover:text-white flex items-center gap-2 mb-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold">Order Management</h1>
                        <p className="text-text-muted">Track and manage commerce activities.</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport} className="gap-2 border-farm-500/50 text-farm-400 hover:bg-farm-500/10">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                        <div className="h-8 w-px bg-white/10 mx-2" />
                        <Button variant="outline" onClick={() => setFilter('ALL')} className={filter === 'ALL' ? 'bg-white/10' : ''}>All</Button>
                        <Button variant="outline" onClick={() => setFilter('VERIFYING')} className={filter === 'VERIFYING' ? 'bg-blue-500/10 text-blue-400' : ''}>Verifying</Button>
                        <Button variant="outline" onClick={() => setFilter('PAID')} className={filter === 'PAID' ? 'bg-green-500/10' : ''}>Paid</Button>
                    </div>
                </div>

                {/* Orders Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-surface-elevated text-xs uppercase text-text-muted tracking-wider">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Item (Goat)</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-sm text-farm-300">{order.orderNumber}</td>
                                        <td className="p-4">
                                            <div className="font-medium">{order.user.name || 'Guest'}</div>
                                            <div className="text-xs text-text-muted">{order.user.phone}</div>
                                        </td>
                                        <td className="p-4">
                                            {order.items[0]?.goat.breed} <br />
                                            <span className="text-xs text-text-muted">{order.items[0]?.goat.name}</span>
                                        </td>
                                        <td className="p-4 font-mono">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.totalAmount)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                order.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    'bg-green-500/10 text-green-500 border-green-500/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentStatus === 'PAID' ? 'text-green-400' :
                                                order.paymentStatus === 'VERIFYING' ? 'text-blue-400 animate-pulse' : 'text-red-400'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/dashboard/orders/${order.id}`}>
                                                    <Button size="sm" variant="outline" className="h-8 text-xs">
                                                        Invoice
                                                    </Button>
                                                </Link>
                                                <Link href={`/dashboard/orders/${order.id}/delivery-note`}>
                                                    <Button size="sm" variant="outline" className="h-8 text-xs bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
                                                        DO
                                                    </Button>
                                                </Link>

                                                {order.paymentStatus === 'VERIFYING' && (
                                                    <Button size="sm" onClick={() => handleUpdate(order.id, 'CONFIRMED', 'PAID')} className="bg-blue-600 hover:bg-blue-700 text-xs h-8">
                                                        <Eye className="w-3 h-3 mr-1" /> Verify Proof
                                                    </Button>
                                                )}

                                                {order.paymentStatus !== 'PAID' && order.paymentStatus !== 'VERIFYING' && (
                                                    <Button size="sm" onClick={() => handleUpdate(order.id, 'CONFIRMED', 'PAID')} className="bg-green-600 hover:bg-green-700 text-xs h-8">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Paid
                                                    </Button>
                                                )}
                                                {order.status === 'CONFIRMED' && (
                                                    <Button size="sm" onClick={() => handleUpdate(order.id, 'SHIPPED')} className="bg-blue-600 hover:bg-blue-700 text-xs h-8">
                                                        <Truck className="w-3 h-3 mr-1" /> Ship
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filtered.length === 0 && (
                            <div className="p-12 text-center text-text-muted">
                                No orders found matching the filter.
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
