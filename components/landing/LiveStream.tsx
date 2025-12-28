'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from 'lucide-react';

export default function LiveStream() {
    return (
        <section className="py-24 bg-surface relative overflow-hidden">
            <div className="container-custom px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Live <span className="text-gradient">Pen Cams</span>
                    </h2>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Transparency is our priority. Watch our livestock in real-time, 24/7.
                        See the cleanliness, activity, and care they receive at any moment.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { name: "Pen A1 - Etawa Breeding", status: "LIVE", viewers: 124 },
                        { name: "Pen B2 - Fattening", status: "LIVE", viewers: 85 },
                        { name: "Nursery - New Kids", status: "OFFLINE", viewers: 0 }
                    ].map((cam, i) => (
                        <Card key={i} className="group relative overflow-hidden aspect-video bg-black border-farm-800">
                            {/* Placeholder Static / Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-gray-900 to-black ${cam.status === 'LIVE' ? 'group-hover:opacity-50' : 'opacity-80'} transition-opacity`} />

                            {/* Simulated Feed Content (Placeholder) */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {cam.status === 'LIVE' ? (
                                    <div className="text-farm-500/20 text-6xl font-bold tracking-widest uppercase">Cam {i + 1}</div>
                                ) : (
                                    <div className="text-text-muted flex flex-col items-center gap-2">
                                        <span className="text-3xl">💤</span>
                                        <span>Resting Hours</span>
                                    </div>
                                )}
                            </div>

                            {/* Overlays */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-2 ${cam.status === 'LIVE' ? 'bg-red-600/90 text-white animate-pulse' : 'bg-gray-700/80 text-gray-300'
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${cam.status === 'LIVE' ? 'bg-white' : 'bg-gray-400'}`} />
                                    {cam.status}
                                </span>
                            </div>

                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs">
                                👁 {cam.viewers}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                                <h3 className="font-semibold text-white">{cam.name}</h3>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
