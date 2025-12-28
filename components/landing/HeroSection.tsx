'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Leaf, Play } from 'lucide-react';

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Video Background with Parallax */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-farm-950/80 via-farm-950/60 to-farm-950 z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0f0d_100%)] z-10" />

                {/* Placeholder for Video - using animated gradient for now */}
                <div className="w-full h-full bg-hero-pattern animate-pulse-slow opacity-60" />

                {/* Optional: Actual Video Tag (commented out until asset provided) */}
                {/* <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/videos/hero-farm.mp4" type="video/mp4" />
        </video> */}
            </motion.div>

            {/* Content */}
            <div className="container-custom relative z-20 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-farm-500/30 text-farm-300 mb-6"
                    >
                        <Leaf className="w-4 h-4 text-farm-400" />
                        <span className="text-sm font-medium tracking-wide">Premium Livestock Platform</span>
                    </motion.div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                        The Future of <br />
                        <span className="text-gradient-gold font-display italic">Modern Farming</span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Experience the fusion of traditional care and advanced technology.
                        From AI-driven selections to real-time farm tracking, discover livestock quality without compromise.
                    </p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Button size="lg" className="w-full sm:w-auto group">
                            Temukan Kambing
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>

                        <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 group">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-farm-500/20 transition-colors">
                                <Play className="w-4 h-4 fill-current" />
                            </div>
                            Lihat Live Farm
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="pt-4"
                    >
                        <a href="/dashboard" className="text-sm text-farm-500 hover:text-farm-400 underline decoration-farm-500/30 underline-offset-4">
                            Farmers / Admin Access
                        </a>
                    </motion.div>

                    {/* Stats / Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 mt-16"
                    >
                        {[
                            { label: 'Total Livestock', value: '1,200+' },
                            { label: 'Happy Customers', value: '850+' },
                            { label: 'Premium Breeds', value: '8' },
                            { label: 'Success Rate', value: '99%' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-farm-400/80 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-farm-500/60 uppercase tracking-widest">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-farm-500/0 via-farm-500/50 to-farm-500/0" />
            </motion.div>
        </div>
    );
}
