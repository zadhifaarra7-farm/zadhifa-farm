import { getOrdersForAdmin } from '@/lib/actions/order';
import OrderManagementPage from '@/components/dashboard/OrderManagement';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const orders = await getOrdersForAdmin();

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8">
            <DashboardHeader title="Pesanan" subtitle="Kelola order dan pengiriman" />
            <OrderManagementPage initialOrders={orders} />
        </div>
    );
}
