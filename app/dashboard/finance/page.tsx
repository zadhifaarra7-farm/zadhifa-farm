import { getTransactions, getFinanceSummary } from '@/lib/actions/finance'
import FinanceClient from './FinanceClient'

export default async function FinancePage() {
    const [transactions, summary] = await Promise.all([
        getTransactions(),
        getFinanceSummary()
    ])

    return <FinanceClient initialTransactions={transactions} summary={summary} />
}
