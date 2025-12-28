import HeroSection from '@/components/landing/HeroSection';
import AIGoatFinder from '@/components/landing/AIGoatFinder';
import LiveTracking from '@/components/landing/LiveTracking';
import LiveStream from '@/components/landing/LiveStream';
import DigitalTwin from '@/components/landing/DigitalTwin';
import TrustSection from '@/components/landing/TrustSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Zadhifa Farm | Premium Livestock of The Future',
    description: 'AI-Powered goat farming platform bridging tradition with technology.',
};

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0a0f0d]">
            <HeroSection />

            <AIGoatFinder />

            <LiveTracking />

            <LiveStream />

            <DigitalTwin />

            <TrustSection />

            {/* Footer / Contact placeholder */}
            <footer className="py-12 border-t border-white/5 text-center text-text-muted">
                <p>© 2024 Zadhifa Farm. Artificial Intelligence + Traditional Care.</p>
            </footer>
        </main>
    );
}
