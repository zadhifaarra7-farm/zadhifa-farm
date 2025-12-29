import { getInvoiceByNumber } from '@/lib/actions/invoice'
import { notFound } from 'next/navigation'
import InvoicePrint from './InvoicePrint'

export const dynamic = 'force-dynamic'

interface Props {
    params: { invoiceNumber: string }
}

export default async function InvoicePage({ params }: Props) {
    const invoice = await getInvoiceByNumber(params.invoiceNumber)

    if (!invoice) {
        notFound()
    }

    return <InvoicePrint invoice={invoice} />
}
