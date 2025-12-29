import { getFeedStock } from '@/lib/actions/feed'
import FeedClient from './FeedClient'

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    const feedStock = await getFeedStock()

    return <FeedClient initialData={feedStock} />
}
