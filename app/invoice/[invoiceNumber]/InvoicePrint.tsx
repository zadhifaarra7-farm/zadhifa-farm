'use client'

import { Printer, Download, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Invoice {
    id: string
    invoiceNumber: string
    buyerName: string
    buyerPhone: string
    buyerEmail: string | null
    items: string
    subtotal: number
    tax: number
    discount: number
    total: number
    status: string
    paymentMethod: string | null
    paidAt: Date | null
    notes: string | null
    createdAt: Date
}

interface Props {
    invoice: Invoice
}

export default function InvoicePrint({ invoice }: Props) {
    const items = JSON.parse(invoice.items || '[]')

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const handlePrint = () => {
        window.print()
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return (
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">LUNAS</span>
                    </div>
                )
            case 'CANCELLED':
                return (
                    <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        <span className="font-bold">DIBATALKAN</span>
                    </div>
                )
            default:
                return (
                    <div className="flex items-center gap-2 text-yellow-600">
                        <Clock className="w-5 h-5" />
                        <span className="font-bold">MENUNGGU PEMBAYARAN</span>
                    </div>
                )
        }
    }

    return (
        <>
            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-container {
                        padding: 0 !important;
                        max-width: 100% !important;
                    }
                    .invoice-card {
                        box-shadow: none !important;
                        border: 1px solid #e5e7eb !important;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
                {/* Action Buttons - Hidden on Print */}
                <div className="no-print max-w-3xl mx-auto px-4 mb-6">
                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            <Printer className="w-5 h-5" />
                            Cetak Invoice
                        </button>
                    </div>
                </div>

                {/* Invoice Container */}
                <div className="print-container max-w-3xl mx-auto px-4">
                    <div className="invoice-card bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 print:bg-green-600">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">INVOICE</h1>
                                    <p className="text-green-100 font-mono text-lg">{invoice.invoiceNumber}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold mb-1">🐑 Zadhifa Farm</div>
                                    <p className="text-green-100 text-sm font-medium mb-1">Dari Hati, Untuk Rasa Berkualitas Premium</p>
                                    <div className="text-green-100 text-xs opacity-90 leading-relaxed">
                                        Jl. Barunagri, RT.01/RW.12, Sukajaya, Kec. Lembang<br />
                                        Kab. Bandung Barat, Jawa Barat 40931<br />
                                        WhatsApp: +62 877 2207 6763
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="px-8 py-4 border-b bg-gray-50 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Tanggal: <span className="font-medium text-gray-900">{formatDate(invoice.createdAt)}</span>
                            </div>
                            {getStatusBadge(invoice.status)}
                        </div>

                        {/* Buyer Info */}
                        <div className="p-8 border-b">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Ditagihkan Kepada</h2>
                            <div className="text-gray-900">
                                <p className="text-xl font-bold">{invoice.buyerName}</p>
                                <p className="text-gray-600">{invoice.buyerPhone}</p>
                                {invoice.buyerEmail && <p className="text-gray-600">{invoice.buyerEmail}</p>}
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="p-8">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Detail Pesanan</h2>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 font-semibold text-gray-700">Produk</th>
                                        <th className="text-center py-3 font-semibold text-gray-700">Berat</th>
                                        <th className="text-right py-3 font-semibold text-gray-700">Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: any, index: number) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-4">
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="text-sm text-gray-500">{item.breed}</div>
                                            </td>
                                            <td className="py-4 text-center text-gray-600">{item.weight} kg</td>
                                            <td className="py-4 text-right font-mono font-medium">{formatCurrency(item.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="mt-6 pt-6 border-t-2 border-gray-200">
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between py-2 text-green-600">
                                        <span>Diskon</span>
                                        <span className="font-mono">-{formatCurrency(invoice.discount)}</span>
                                    </div>
                                )}
                                {invoice.tax > 0 && (
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Pajak</span>
                                        <span className="font-mono">{formatCurrency(invoice.tax)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-4 mt-2 border-t-2 border-gray-900">
                                    <span className="text-xl font-bold">TOTAL</span>
                                    <span className="text-xl font-bold font-mono text-green-600">{formatCurrency(invoice.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="px-8 py-6 bg-gray-50 border-t">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Informasi Pembayaran</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg border">
                                    <p className="text-sm text-gray-500 mb-1">Bank BCA</p>
                                    <p className="text-xl font-mono font-bold">1390404430</p>
                                    <p className="text-sm text-gray-600">a.n Mahardhika Fawzan Dwipayana</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border">
                                    <p className="text-sm text-gray-500 mb-1">Konfirmasi via WhatsApp</p>
                                    <p className="text-xl font-mono font-bold">087722076763</p>
                                    <p className="text-sm text-gray-600">Kirim bukti transfer</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 bg-gray-900 text-white text-center">
                            <p className="text-sm mb-1">Terima kasih telah berbelanja di Zadhifa Farm</p>
                            <p className="text-xs text-gray-400">Invoice ini sah dan dibuat secara otomatis oleh sistem</p>
                        </div>
                    </div>
                </div>

                {/* Back Link - Hidden on Print */}
                <div className="no-print max-w-3xl mx-auto px-4 mt-6 text-center">
                    <a href="/" className="text-green-600 hover:text-green-700 font-medium">
                        ← Kembali ke Zadhifa Farm
                    </a>
                </div>
            </div>
        </>
    )
}
