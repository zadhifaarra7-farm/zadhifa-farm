'use client';

import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/actions/order';
import { Button } from '@/components/ui/Button';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DeliveryNotePage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        getOrderById(params.id).then(setOrder);
    }, [params.id]);

    if (!order) return <div className="p-8 text-white">Loading Surat Jalan...</div>;

    const items = order.items.map((item: any) => ({
        id: item.goat.registrationCode,
        name: item.goat.name,
        breed: item.goat.breed,
        weight: item.weightAtPurchase,
        pen: item.goat.penId || 'N/A'
    }));

    return (
        <div className="bg-white min-h-screen text-black p-8 font-serif">
            {/* No-Print Controls */}
            <div className="print:hidden mb-8 flex justify-between">
                <Link href="/dashboard/orders">
                    <Button variant="outline" className="text-black border-black/20 hover:bg-black/5">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </Link>
                <Button onClick={() => window.print()} className="bg-black text-white hover:bg-black/80">
                    <Printer className="w-4 h-4 mr-2" /> Print Surat Jalan (Driver)
                </Button>
            </div>

            {/* Header */}
            <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-wider">Surat Jalan</h1>
                    <p className="text-sm mt-1">No: DO-{order.orderNumber}</p>
                    <p className="text-sm">Tgl: {new Date().toLocaleDateString('id-ID')}</p>
                </div>
                <div className="text-right">
                    <h2 className="font-bold text-xl">Zadhifa Farm Indonesia</h2>
                    <p className="text-sm text-gray-600">
                        Jl. Peternakan Modern No. 88<br />
                        Cianjur, Jawa Barat<br />
                        Tel: +62 812 3456 7890
                    </p>
                </div>
            </div>

            {/* Recipient */}
            <div className="border border-black p-4 mb-8 grid grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold uppercase text-xs mb-2">Penerima:</h3>
                    <p className="font-bold text-lg">{order.user.name || 'Jemaah / Guest'}</p>
                    <p>{order.user.phone}</p>
                    <p className="italic text-gray-500 mt-2">{order.deliveryNotes || 'Alamat sesuai shareloc WhatsApp'}</p>
                </div>
                <div>
                    <h3 className="font-bold uppercase text-xs mb-2">Instruksi Driver:</h3>
                    <p className="text-sm">
                        1. Pastikan hewan dalam kondisi sehat sebelum naik.<br />
                        2. Cek suhu amonia kandang angkut.<br />
                        3. Hubungi penerima 1 jam sebelum sampai.
                    </p>
                </div>
            </div>

            {/* Items */}
            <table className="w-full text-left border-collapse mb-8">
                <thead>
                    <tr className="border-y border-black font-bold uppercase text-xs">
                        <th className="py-2">No</th>
                        <th className="py-2">ID Ternak</th>
                        <th className="py-2">Jenis</th>
                        <th className="py-2">Berat (kg)</th>
                        <th className="py-2">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: any, idx: number) => (
                        <tr key={item.id} className="border-b border-gray-300">
                            <td className="py-3">{idx + 1}</td>
                            <td className="py-3 font-mono">{item.id}</td>
                            <td className="py-3">{item.breed} ({item.name})</td>
                            <td className="py-3">{item.weight} kg</td>
                            <td className="py-3 text-gray-500">Sehat / Layak Kirim</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-8 mt-16 text-center">
                <div className="mt-8">
                    <p className="mb-16 text-xs uppercase">Dibuat Oleh (Admin)</p>
                    <div className="border-t border-black w-1/2 mx-auto"></div>
                </div>
                <div className="mt-8">
                    <p className="mb-16 text-xs uppercase">Driver / Pengirim</p>
                    <div className="border-t border-black w-1/2 mx-auto"></div>
                </div>
                <div className="mt-8">
                    <p className="mb-16 text-xs uppercase">Penerima</p>
                    <div className="border-t border-black w-1/2 mx-auto"></div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 2cm; }
                    body { background: white; }
                }
            `}</style>
        </div>
    );
}
