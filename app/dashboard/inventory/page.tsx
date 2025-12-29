import InventoryManagement from '@/components/dashboard/InventoryManagement';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8">
            <DashboardHeader title="Kelola Inventaris" subtitle="Manajemen data domba" />
            <InventoryManagement />
        </div>
    );
}
