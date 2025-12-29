import { getInvoices, getInvoiceSummary } from '@/lib/actions/invoice'
import InvoiceClient from './InvoiceClient'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
    const [invoices, summary] = await Promise.all([
        getInvoices(),
        getInvoiceSummary()
    ])

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8">
            <DashboardHeader title="Invoice" subtitle="Kelola invoice dan pembayaran" />
            <InvoiceClient initialInvoices={invoices} summary={summary} />
        </div>
    )
}
