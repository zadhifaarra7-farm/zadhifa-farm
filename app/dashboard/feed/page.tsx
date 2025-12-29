import { getFeedStock } from '@/lib/actions/feed'
import FeedClient from './FeedClient'

export default async function FeedPage() {
    const feedStock = await getFeedStock()

    return <FeedClient initialData={feedStock} />
}
