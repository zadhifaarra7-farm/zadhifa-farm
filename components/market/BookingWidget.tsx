'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card'; // Assuming we have this or similar
import { createWhatsAppOrder } from '@/lib/actions/order';
import { MessageCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    goatId: string; // Registration Code
    goatName: string;
    price: number;
}

export default function BookingWidget({ goatId, goatName, price }: Props) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleOrder = async () => {
        if (!name || !phone) return alert('Mohon isi nama dan nomor WA');

        setIsLoading(true);

        // 1. Create Record
        const result = await createWhatsAppOrder(goatId, name, phone);

        if (result.success) {
            setSuccess(true);
            // 2. Redirect to WA
            setTimeout(() => {
                const message = encodeURIComponent(result.text || `Saya tertarik dengan ${goatName}`);
                window.open(`https://wa.me/${result.phone}?text=${message}`, '_blank');
            }, 1000);
        } else {
            alert('Gagal membuat pesanan: ' + result.error);
        }
        setIsLoading(false);
    };

    if (success) {
        return (
            <Card className="p-6 bg-farm-900/50 border-farm-500">
                <div className="text-center py-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-farm-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                        <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">Pesanan Dibuat!</h3>
                    <p className="text-text-muted">Mengalihkan ke WhatsApp...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 space-y-4 sticky top-24">
            <div className="border-b border-white/10 pb-4 mb-4">
                <p className="text-sm text-text-muted">Harga Saat Ini</p>
                <div className="text-3xl font-bold text-gold-400 font-mono">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)}
                </div>
                <p className="text-xs text-farm-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Stok Tersedia
                </p>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-xs uppercase text-text-muted font-bold tracking-wider mb-1 block">Nama Lengkap</label>
                    <input
                        type="text"
                        className="input w-full"
                        placeholder="Nama Pembeli"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-xs uppercase text-text-muted font-bold tracking-wider mb-1 block">Nomor WhatsApp</label>
                    <input
                        type="tel"
                        className="input w-full"
                        placeholder="0812..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
            </div>

            <Button
                onClick={handleOrder}
                isLoading={isLoading}
                className="w-full btn-gold gap-2 h-12 text-lg"
            >
                <MessageCircle className="w-5 h-5" />
                Beli via WhatsApp
            </Button>

            <p className="text-xs text-center text-text-muted opacity-70">
                Transaksi aman & amanah. Pembayaran dilakukan setelah konfirmasi via WA.
            </p>
        </Card>
    );
}
