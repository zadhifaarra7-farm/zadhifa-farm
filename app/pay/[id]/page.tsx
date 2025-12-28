'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Upload, CheckCircle, Copy } from 'lucide-react';
import { uploadProof } from '@/lib/actions/order';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full btn-gold" disabled={pending}>
            {pending ? 'Uploading...' : 'Kirim Bukti Transfer'}
        </Button>
    )
}

export default function PaymentPage({ params }: { params: { id: string } }) {
    // Mock data fetching would happen here or parent
    const [copied, setCopied] = useState(false);

    const copyRek = () => {
        navigator.clipboard.writeText('1234567890');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 space-y-6 border-gold-500/30">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Selesaikan Pembayaran</h1>
                    <p className="text-text-muted text-sm">Order ID: #{params.id}</p>
                </div>

                {/* Bank Info */}
                <div className="bg-surface-elevated p-4 rounded-xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-text-muted">Bank Transfer</span>
                        <span className="font-bold text-blue-400">BCA</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                        <span className="font-mono text-xl tracking-wider">123 456 7890</span>
                        <button onClick={copyRek}>
                            {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-text-muted hover:text-white" />}
                        </button>
                    </div>
                    <div className="text-center text-sm text-text-muted">
                        a.n PT Zadhifa Farm Indonesia
                    </div>
                </div>

                {/* Upload Form */}
                <form action={uploadProof}>
                    <input type="hidden" name="orderId" value={params.id} />
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 hover:bg-white/5 transition-colors text-center cursor-pointer relative">
                        <input type="file" name="proof" className="absolute inset-0 opacity-0 cursor-pointer" required accept="image/*" />
                        <div className="pointer-events-none">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-farm-500" />
                            <p className="text-sm font-medium">Klik untuk upload bukti transfer</p>
                            <p className="text-xs text-text-muted mt-1">JPG, PNG (Max 2MB)</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <SubmitButton />
                    </div>
                </form>

                <p className="text-xs text-center text-text-muted">
                    Verifikasi otomatis dalam 1x24 jam.
                </p>
            </Card>
        </div>
    );
}
