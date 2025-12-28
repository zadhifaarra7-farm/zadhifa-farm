import HeroSection from '@/components/landing/HeroSection';
import AIGoatFinder from '@/components/landing/AIGoatFinder';
import LiveTracking from '@/components/landing/LiveTracking';
import DigitalTwin from '@/components/landing/DigitalTwin';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Zadhifa Farm | Ternak Premium Masa Depan',
    description: 'Platform peternakan domba berbasis AI yang menggabungkan tradisi dengan teknologi.',
};

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0a0f0d]">
            <HeroSection />

            <AIGoatFinder />

            <LiveTracking />

            <DigitalTwin />

            {/* Bank Info Section */}
            <section className="py-16 bg-surface border-t border-white/5">
                <div className="container-custom px-4 text-center">
                    <h3 className="text-2xl font-bold mb-6">Informasi Pembayaran</h3>
                    <div className="max-w-md mx-auto bg-surface-elevated border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                                BCA
                            </div>
                            <span className="text-lg font-semibold">Bank Central Asia</span>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-xs text-text-muted mb-1">Nomor Rekening</p>
                                <p className="text-2xl font-mono font-bold text-gold-400 tracking-wider">1390404430</p>
                            </div>
                            <div className="bg-black/30 rounded-xl p-4">
                                <p className="text-xs text-text-muted mb-1">Atas Nama</p>
                                <p className="text-lg font-semibold">Mahardhika Fawzan Dwipayana</p>
                            </div>
                        </div>
                        <p className="text-xs text-text-muted mt-4">
                            Setelah transfer, kirim bukti pembayaran via WhatsApp
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="container-custom px-4 text-center text-text-muted">
                    <p className="mb-4">© 2024 Zadhifa Farm. Ternak Premium Masa Depan.</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span>📞</span>
                        <a href="https://wa.me/6287722076763" className="text-farm-400 hover:text-farm-300 transition-colors">
                            087722076763
                        </a>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Button */}
            <WhatsAppButton />
        </main>
    );
}
