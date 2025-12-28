import HeroSection from '@/components/landing/HeroSection';
import AIGoatFinder from '@/components/landing/AIGoatFinder';
import DigitalTwin from '@/components/landing/DigitalTwin';
import TrainingGallery from '@/components/landing/TrainingGallery';
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

            <DigitalTwin />

            <TrainingGallery />

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
