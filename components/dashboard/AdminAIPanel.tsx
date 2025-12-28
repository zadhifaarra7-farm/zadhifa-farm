'use client';

import { Card } from '@/components/ui/Card';
import { Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminAIPanel() {
    const openWhatsApp = () => {
        window.open('https://wa.me/6287722076763', '_blank');
    };

    return (
        <Card className="p-6 space-y-6 bg-gradient-to-br from-surface to-surface-elevated">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Aksi Cepat</h3>
                    <p className="text-xs text-text-muted">Kelola peternakan Anda</p>
                </div>
            </div>

            <div className="space-y-3">
                <Button
                    className="w-full btn-gold gap-2"
                    size="sm"
                    onClick={openWhatsApp}
                >
                    <MessageCircle className="w-4 h-4" />
                    Buka WhatsApp Business
                </Button>

                <p className="text-xs text-center text-text-muted">
                    Gunakan WhatsApp untuk menerima pesanan dan berkomunikasi dengan pelanggan
                </p>
            </div>
        </Card>
    );
}
