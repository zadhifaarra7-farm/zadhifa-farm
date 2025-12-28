'use client';

import { useState } from 'react';
import { Truck, MapPin, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ZONES = [
    { name: 'Jabodetabek (Free)', price: 0 },
    { name: 'Jawa Barat (Cianjur, Bandung)', price: 250000 },
    { name: 'Jawa Tengah', price: 750000 },
    { name: 'Jawa Timur', price: 1500000 },
    { name: 'Luar Pulau Jawa (Call US)', price: -1 },
];

export default function ShippingCalculator() {
    const [selectedZone, setSelectedZone] = useState(ZONES[0]);
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-surface p-4 rounded-xl border border-white/10 space-y-4">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2 text-farm-400">
                    <Truck className="w-5 h-5" />
                    <span className="font-semibold">Cek Ongkos Kirim</span>
                </div>
                <Button variant="ghost" size="sm" className="text-text-muted">
                    {open ? 'Tutup' : 'Buka'}
                </Button>
            </div>

            {open && (
                <div className="space-y-4 pt-2 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 gap-2">
                        {ZONES.map((zone) => (
                            <button
                                key={zone.name}
                                onClick={() => setSelectedZone(zone)}
                                className={`text-left text-sm p-3 rounded-lg border transition-all ${selectedZone.name === zone.name
                                        ? 'bg-farm-500/20 border-farm-500 text-white'
                                        : 'bg-black/20 border-transparent hover:bg-white/5 text-text-muted'
                                    }`}
                            >
                                {zone.name}
                            </button>
                        ))}
                    </div>

                    <div className="bg-black/40 p-4 rounded-lg flex justify-between items-center">
                        <span className="text-sm">Estimasi Ongkir:</span>
                        <span className="text-lg font-bold text-gold-400 font-mono">
                            {selectedZone.price === -1
                                ? 'Hubungi Admin'
                                : selectedZone.price === 0
                                    ? 'GRATIS'
                                    : `Rp ${selectedZone.price.toLocaleString('id-ID')}`
                            }
                        </span>
                    </div>

                    <p className="text-xs text-text-muted italic">
                        *Pengiriman menggunakan armada khusus ternak berstandar Animal Welfare.
                    </p>
                </div>
            )}
        </div>
    );
}
