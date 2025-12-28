import { getGoatById } from '@/lib/actions/inventory';
import BookingWidget from '@/components/market/BookingWidget';
import { ArrowLeft, Ruler, Weight, Activity, Tag, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function GoatDetailPage({ params }: PageProps) {
    const goat = await getGoatById(params.id);

    if (!goat) {
        notFound();
    }

    // Use the first image or a placeholder
    const heroImage = goat.mediaUrls && goat.mediaUrls.length > 0
        ? goat.mediaUrls[0]
        : null;

    return (
        <main className="min-h-screen bg-[#0a0f0d] pt-24 pb-12">
            <div className="container-custom px-4">
                {/* Breadcrumb */}
                <Link href="/" className="inline-flex items-center text-text-muted hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Farm
                </Link>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* LEFT: Image & Gallery */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface-elevated relative group">
                            {heroImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={heroImage}
                                    alt={goat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                                    <span className="text-white/20 text-lg font-mono">[ No Image Available ]</span>
                                </div>
                            )}

                            {/* Badges Overlay */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                {goat.tags.map((tag: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                        {tag.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-surface border border-white/5">
                                <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Breed</div>
                                <div className="text-lg font-bold text-white">{goat.breed}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-surface border border-white/5">
                                <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Weight</div>
                                <div className="text-lg font-bold text-white">{goat.currentWeight} kg</div>
                            </div>
                            <div className="p-4 rounded-xl bg-surface border border-white/5">
                                <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Gender</div>
                                <div className="text-lg font-bold text-white">{goat.gender}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-surface border border-white/5">
                                <div className="text-text-muted text-xs uppercase tracking-wider mb-1">Age</div>
                                <div className="text-lg font-bold text-white">{goat.age}</div>
                            </div>
                        </div>

                        {/* Description / Story */}
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-2xl font-bold mb-4">About {goat.name}</h3>
                            <p className="text-text-muted leading-relaxed">
                                {goat.notes || "A premium specimen from Zadhifa Farm, raised with intensive care and monitoring. Suitable for breeding or high-quality meat production."}
                            </p>

                            <h4 className="text-xl font-bold mt-8 mb-4">Farm Data & Health</h4>
                            <ul className="space-y-2 text-text-muted">
                                <li className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-farm-500" />
                                    Status Kesehatan: <span className="text-white font-medium">{goat.healthStatus}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-blue-500" />
                                    Lokasi Kandang: <span className="text-white font-medium">{goat.pen?.name || 'Unknown'}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-gold-500" />
                                    Jaminan: <span className="text-white font-medium">Sertifikat Sehat & Layak</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT: Booking Widget */}
                    <div className="lg:col-span-1">
                        <BookingWidget
                            goatId={goat.registrationCode}
                            goatName={goat.name}
                            price={goat.dynamicPrice || goat.basePrice}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
