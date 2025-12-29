import { getFeedStock } from '@/lib/actions/feed'
import FeedClient from './FeedClient'
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    const feedStock = await getFeedStock()

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8">
            <DashboardHeader title="Stok Pakan" subtitle="Kelola persediaan pakan ternak" />
            <FeedClient initialData={feedStock} />
        </div>
    )
}
