import InventoryManagement from '@/components/dashboard/InventoryManagement';
import InventoryTable from "@/components/dashboard/InventoryTable";
import { getInventory } from "@/lib/actions/inventory";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    return (
        <div className="p-6">
            <InventoryManagement />
        </div>
    );
}
