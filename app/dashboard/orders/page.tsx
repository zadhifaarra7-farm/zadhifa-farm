import { getOrdersForAdmin } from '@/lib/actions/order';
import OrderManagementPage from '@/components/dashboard/OrderManagement';

export default async function Page() {
    const orders = await getOrdersForAdmin();
    return <OrderManagementPage initialOrders={orders} />;
}
