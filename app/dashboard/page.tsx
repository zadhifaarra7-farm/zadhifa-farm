import GoatMetrics from '@/components/dashboard/GoatMetrics';
import InventoryTable from '@/components/dashboard/InventoryTable';
import PredictivePricing from '@/components/dashboard/PredictivePricing';
import AdminAIPanel from '@/components/dashboard/AdminAIPanel';
import RecentOrders from '@/components/dashboard/RecentOrders';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Calendar, Bell, Users, Dna, Package } from 'lucide-react';
import { getDashboardStats, getRecentAlerts, getRecentOrders } from '@/lib/actions/dashboard';
import { getInventory } from '@/lib/actions/inventory';

export default async function Dashboard() {
    // Fetch real data from Server Actions
    const stats = await getDashboardStats();
    const alerts = await getRecentAlerts();
    const inventory = await getInventory();
    const recentOrders = await getRecentOrders();

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8 space-y-8">

            {/* Header */}
            <header className="flex justify-between items-center bg-surface-elevated/50 p-6 rounded-2xl border border-white/5 backdrop-blur-md sticky top-4 z-40">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-text-muted bg-clip-text text-transparent">
                        Pusat Kontrol Peternakan
                    </h1>
                    <p className="text-sm text-text-muted">Selamat datang, Admin</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" className="p-2 rounded-full relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </Button>
                    <Button variant="secondary" className="gap-2">
                        <Calendar className="w-4 h-4" /> Jadwal
                    </Button>
                    <Button className="gap-2">
                        <ShieldCheck className="w-4 h-4" /> Status Sistem
                    </Button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Ternak', value: stats.totalGoats, trend: '+5 bulan ini', color: 'from-blue-500' },
                    { label: 'Skor Kesehatan', value: stats.healthScore, trend: 'Stabil', color: 'from-farm-500' },
                    { label: 'Stok Pakan', value: stats.feedStock, trend: '-5%', color: 'from-gold-500' },
                    { label: 'Pendapatan Tahun Ini', value: stats.revenueYear, trend: '+22%', color: 'from-purple-500' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6 relative overflow-hidden group hover:border-white/20">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.color} to-transparent opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />
                        <div className="text-sm text-text-muted mb-2">{stat.label}</div>
                        <div className="text-3xl font-bold font-mono">{stat.value}</div>
                        <div className="text-xs text-farm-400 mt-2 font-medium">{stat.trend}</div>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 h-[600px]">
                {/* Left Col - 2/3 width */}
                <div className="lg:col-span-2 flex flex-col gap-8 h-full">
                    <div className="flex-1 min-h-0">
                        <GoatMetrics />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Inventory Management Card */}
                        <Card className="p-6 flex flex-col justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                            <Link href="/dashboard/inventory" className="h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-farm-500/10 rounded-xl text-farm-400 group-hover:bg-farm-500 group-hover:text-white transition-colors">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <span className="bg-surface border border-white/10 px-2 py-1 rounded text-xs text-text-muted">BARU</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Kelola Stok</h3>
                                    <p className="text-sm text-text-muted">Tambah / Edit Kambing</p>
                                </div>
                            </Link>
                        </Card>

                        {/* CRM Card */}
                        <Card className="p-6 flex flex-col justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                            <Link href="/dashboard/customers" className="h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Pelanggan</h3>
                                    <p className="text-sm text-text-muted">Lihat Data & Promo</p>
                                </div>
                            </Link>
                        </Card>

                        {/* Breeding Card */}
                        <Card className="p-6 flex flex-col justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                            <Link href="/dashboard/breeding" className="h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                        <Dna className="w-6 h-6" />
                                    </div>
                                    <span className="bg-surface border border-white/10 px-2 py-1 rounded text-xs text-text-muted">BETA</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Lab Genetik</h3>
                                    <p className="text-sm text-text-muted">Simulasi Perkawinan</p>
                                </div>
                            </Link>
                        </Card>
                    </div>

                    <InventoryTable data={inventory} />
                </div>

                {/* Right Col - 1/3 width */}
                <div className="flex flex-col gap-8 h-full">
                    {/* Admin Actions */}
                    <AdminAIPanel />

                    <PredictivePricing />

                    <div className="flex-1 min-h-0">
                        <RecentOrders orders={recentOrders} />
                    </div>

                    {/* Recent Alerts */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-farm-500" />
                                <span className="text-lg">Notifikasi Terbaru</span>
                            </h3>
                            <Button variant="ghost" size="sm" className="text-text-muted">Hapus</Button>
                        </div>
                        <div className="space-y-4">
                            {alerts.map((alert, i) => (
                                <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-surface border border-white/5">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${alert.type === 'CRITICAL' ? 'bg-red-500 animate-pulse' :
                                        alert.type === 'WARNING' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm">{alert.msg}</p>
                                        <p className="text-xs text-text-muted mt-1">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
