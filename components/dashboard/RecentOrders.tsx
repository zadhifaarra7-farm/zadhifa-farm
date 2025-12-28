'use client';

import { Card } from '@/components/ui/Card';
import { ShoppingBag, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    customer: string;
    amount: string;
    status: string;
    date: string;
    item: string;
}

export default function RecentOrders({ orders }: { orders: Order[] }) {
    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-farm-500" />
                    <h3 className="font-semibold text-lg">Recent Orders</h3>
                </div>
                <Link href="/dashboard/orders" className="text-xs text-farm-400 hover:text-farm-300 flex items-center">
                    View All <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-8 text-text-muted text-sm">
                        No orders yet.
                    </div>
                ) : (
                    orders.map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-farm-500/10 text-farm-500'}`}>
                                    {order.status === 'PENDING' ? <Clock className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{order.customer}</p>
                                    <p className="text-xs text-text-muted">{order.item} • {order.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-sm font-bold text-white">{order.amount}</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${order.status === 'PENDING'
                                    ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'
                                    : 'border-farm-500/30 text-farm-500 bg-farm-500/5'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
