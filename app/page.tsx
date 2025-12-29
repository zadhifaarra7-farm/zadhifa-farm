import HeroSection from '@/components/landing/HeroSection';
import AIGoatFinder from '@/components/landing/AIGoatFinder';
import DigitalTwin from '@/components/landing/DigitalTwin';
import TrainingGallery from '@/components/landing/TrainingGallery';
import VisionMission from '@/components/landing/VisionMission';
import Footer from '@/components/landing/Footer';
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

            <VisionMission />

            <AIGoatFinder />

            <DigitalTwin />

            <TrainingGallery />

            <Footer />

            {/* Floating WhatsApp Button */}
            <WhatsAppButton />
        </main>
    );
}

