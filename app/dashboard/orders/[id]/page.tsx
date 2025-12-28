'use client';

import { getOrderById } from '@/lib/actions/order';
import { notFound } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

// Client Component to handle Print and Async Data fetching simply
export default function InvoicePage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrderById(params.id).then(data => {
            if (!data) {
                // Handle 404
                setLoading(false);
                return;
            }
            // Date conversion for serializable check
            const processed = {
                ...data,
                createdAt: new Date(data.createdAt),
                // prisma returns dates as strings if passed from server action? No, pure server action returns Date objects usually.
                // But if we pass specific serialization boundary... 
                // Let's assume standard Date object for now.
            };
            setOrder(processed);
            setLoading(false);
        });
    }, [params.id]);

    if (loading) return <div className="min-h-screen bg-[#0a0f0d] p-8 text-white">Loading Invoice...</div>;
    if (!order) return <div className="min-h-screen bg-[#0a0f0d] p-8 text-white">Invoice Not Found</div>;

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8 print:bg-white print:p-0">
            <div className="max-w-3xl mx-auto">
                {/* No Print Header */}
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <Link href="/dashboard/orders" className="text-text-muted hover:text-white flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Orders
                    </Link>
                    <Button className="btn-gold gap-2" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> Print Invoice
                    </Button>
                </div>

                {/* Invoice Paper */}
                <div className="bg-white text-black p-12 rounded-xl shadow-2xl print:shadow-none print:rounded-none">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-farm-900 tracking-tight">INVOICE</h1>
                            <p className="text-gray-500 font-mono mt-1">#{order.orderNumber}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-farm-600">Zadhifa Farm</h2>
                            <p className="text-sm text-gray-500 mt-1">Premium Livestock & Breeding</p>
                            <p className="text-sm text-gray-500">Bogor, Indonesia</p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Bill To</h3>
                            <div className="font-semibold text-lg">{order.user.name || 'Guest User'}</div>
                            <div className="text-gray-500">{order.user.phone}</div>
                            <div className="text-gray-500 mt-2 text-sm">{order.user.email}</div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Details</h3>
                            <div className="flex justify-between md:justify-end gap-8 mb-1">
                                <span className="text-gray-500">Date:</span>
                                <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between md:justify-end gap-8">
                                <span className="text-gray-500">Status:</span>
                                <span className="font-medium uppercase">{order.paymentStatus}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="w-full mb-12">
                        <thead>
                            <tr className="border-b-2 border-gray-900 text-left">
                                <th className="py-3 font-bold uppercase text-xs tracking-wider">Item Description</th>
                                <th className="py-3 text-right font-bold uppercase text-xs tracking-wider">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {order.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="py-4">
                                        <div className="font-bold">{item.goat.breed} Goat</div>
                                        <div className="text-sm text-gray-500">
                                            Registration: {item.goat.registrationCode} <br />
                                            Weight: {item.weightAtPurchase} kg
                                        </div>
                                    </td>
                                    <td className="py-4 text-right font-mono">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.priceAtPurchase)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Total */}
                    <div className="flex justify-end border-t border-gray-200 pt-8">
                        <div className="w-64">
                            <div className="flex justify-between text-gray-600 mb-2">
                                <span>Subtotal</span>
                                <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 mb-4">
                                <span>Tax (0%)</span>
                                <span>Rp 0</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-farm-900 border-t border-gray-900 pt-4">
                                <span>Total</span>
                                <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center text-sm text-gray-400">
                        <p>Thank you for trusting Zadhifa Farm. 100% Halal & Trusted.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
