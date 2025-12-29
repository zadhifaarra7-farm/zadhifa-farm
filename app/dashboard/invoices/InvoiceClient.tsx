'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileText, Clock, CheckCircle, XCircle, Search, Eye, Printer } from 'lucide-react'
import { updateInvoiceStatus } from '@/lib/actions/invoice'

interface Invoice {
    id: string
    invoiceNumber: string
    orderId: string | null
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

interface InvoiceSummary {
    pending: number
    paid: number
    cancelled: number
    totalRevenue: number
}

interface InvoiceClientProps {
    initialInvoices: Invoice[]
    summary: InvoiceSummary
}

export default function InvoiceClient({ initialInvoices, summary }: InvoiceClientProps) {
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
    const [isPending, startTransition] = useTransition()

    const filteredInvoices = invoices.filter(inv => {
        const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter
        const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.buyerPhone.includes(searchQuery)
        return matchesStatus && matchesSearch
    })

    const handleStatusChange = (id: string, newStatus: string) => {
        startTransition(async () => {
            const result = await updateInvoiceStatus(id, newStatus)
            if (result.success) {
                setInvoices(prev => prev.map(inv =>
                    inv.id === id ? { ...inv, status: newStatus, paidAt: newStatus === 'PAID' ? new Date() : inv.paidAt } : inv
                ))
            }
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><Clock className="w-3 h-3" /> Menunggu</span>
            case 'PAID':
                return <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30"><CheckCircle className="w-3 h-3" /> Lunas</span>
            case 'CANCELLED':
                return <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30"><XCircle className="w-3 h-3" /> Batal</span>
            default:
                return <span className="px-2 py-1 rounded-full text-xs bg-white/10">{status}</span>
        }
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-6 border-yellow-500/20">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        Menunggu Bayar
                    </div>
                    <div className="text-3xl font-bold text-yellow-400">{summary.pending}</div>
                </Card>
                <Card className="p-6 border-green-500/20">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Lunas
                    </div>
                    <div className="text-3xl font-bold text-green-400">{summary.paid}</div>
                </Card>
                <Card className="p-6 border-red-500/20">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                        <XCircle className="w-4 h-4 text-red-400" />
                        Dibatalkan
                    </div>
                    <div className="text-3xl font-bold text-red-400">{summary.cancelled}</div>
                </Card>
                <Card className="p-6 border-farm-500/20">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                        <FileText className="w-4 h-4 text-farm-400" />
                        Total Revenue
                    </div>
                    <div className="text-2xl font-bold text-farm-400">{formatCurrency(summary.totalRevenue)}</div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-2">
                        {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map(status => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === 'ALL' ? 'Semua' : status === 'PENDING' ? 'Menunggu' : status === 'PAID' ? 'Lunas' : 'Batal'}
                            </Button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Cari invoice..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg text-white focus:border-farm-500 focus:outline-none"
                        />
                    </div>
                </div>
            </Card>

            {/* Invoice Table */}
            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Daftar Invoice</h2>
                {filteredInvoices.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada invoice</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">No. Invoice</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Tanggal</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Pembeli</th>
                                    <th className="text-right py-3 px-4 text-text-muted font-medium">Total</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Status</th>
                                    <th className="text-right py-3 px-4 text-text-muted font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map(inv => (
                                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4 font-mono text-farm-400">{inv.invoiceNumber}</td>
                                        <td className="py-3 px-4 text-text-muted">
                                            {new Date(inv.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-medium">{inv.buyerName}</div>
                                            <div className="text-xs text-text-muted">{inv.buyerPhone}</div>
                                        </td>
                                        <td className="py-3 px-4 text-right font-mono font-bold">{formatCurrency(inv.total)}</td>
                                        <td className="py-3 px-4">{getStatusBadge(inv.status)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedInvoice(inv)}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                {inv.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(inv.id, 'PAID')}
                                                            disabled={isPending}
                                                            className="text-green-400 hover:text-green-300"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(inv.id, 'CANCELLED')}
                                                            disabled={isPending}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Invoice Detail Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInvoice(null)}>
                    <Card className="max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold">Invoice Detail</h2>
                                <p className="text-farm-400 font-mono">{selectedInvoice.invoiceNumber}</p>
                            </div>
                            {getStatusBadge(selectedInvoice.status)}
                        </div>

                        <div className="space-y-4 border-t border-white/10 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-text-muted">Pembeli</p>
                                    <p className="font-medium">{selectedInvoice.buyerName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted">No. HP</p>
                                    <p>{selectedInvoice.buyerPhone}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-text-muted mb-2">Items</p>
                                <div className="bg-surface rounded-lg p-3 space-y-2">
                                    {JSON.parse(selectedInvoice.items).map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between">
                                            <span>{item.name} ({item.breed}) - {item.weight}kg</span>
                                            <span className="font-mono">{formatCurrency(item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Subtotal</span>
                                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                                </div>
                                {selectedInvoice.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-400">
                                        <span>Diskon</span>
                                        <span>-{formatCurrency(selectedInvoice.discount)}</span>
                                    </div>
                                )}
                                {selectedInvoice.tax > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">Pajak</span>
                                        <span>{formatCurrency(selectedInvoice.tax)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="text-farm-400">{formatCurrency(selectedInvoice.total)}</span>
                                </div>
                            </div>

                            {selectedInvoice.paidAt && (
                                <div className="text-sm text-text-muted">
                                    Dibayar: {new Date(selectedInvoice.paidAt).toLocaleString('id-ID')}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 mt-6">
                            <Button variant="secondary" onClick={() => setSelectedInvoice(null)} className="flex-1">
                                Tutup
                            </Button>
                            <Button className="flex-1 gap-2" onClick={() => window.print()}>
                                <Printer className="w-4 h-4" />
                                Cetak
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
