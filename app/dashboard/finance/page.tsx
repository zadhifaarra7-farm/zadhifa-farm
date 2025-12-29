import { getTransactions, getFinanceSummary } from '@/lib/actions/finance'
import FinanceClient from './FinanceClient'
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
    const [transactions, summary] = await Promise.all([
        getTransactions(),
        getFinanceSummary()
    ])

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8">
            <DashboardHeader title="Keuangan" subtitle="Kelola pemasukan dan pengeluaran" />
            <FinanceClient initialTransactions={transactions} summary={summary} />
        </div>
    )
}
