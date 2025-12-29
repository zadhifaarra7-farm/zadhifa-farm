'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import { addTransaction, deleteTransaction } from '@/lib/actions/finance'

const INCOME_CATEGORIES = ['Penjualan Domba', 'Penjualan Susu', 'Jasa Breeding', 'Lainnya']
const EXPENSE_CATEGORIES = ['Pakan', 'Obat & Vaksin', 'Gaji Karyawan', 'Perawatan Kandang', 'Operasional', 'Lainnya']

interface TransactionFormProps {
    onSuccess: () => void
}

function TransactionForm({ onSuccess }: TransactionFormProps) {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        type: 'INCOME' as 'INCOME' | 'EXPENSE',
        category: '',
        amount: '',
        description: '',
        reference: ''
    })

    const categories = formData.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const result = await addTransaction({
                type: formData.type,
                category: formData.category,
                amount: parseFloat(formData.amount),
                description: formData.description || undefined,
                reference: formData.reference || undefined
            })
            if (result.success) {
                setFormData({ type: 'INCOME', category: '', amount: '', description: '', reference: '' })
                onSuccess()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-text-muted mb-2">Tipe Transaksi *</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'INCOME', category: '' })}
                            className={`flex-1 py-3 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${formData.type === 'INCOME'
                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                : 'bg-surface border-white/10 text-text-muted hover:border-white/20'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Pemasukan
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'EXPENSE', category: '' })}
                            className={`flex-1 py-3 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${formData.type === 'EXPENSE'
                                ? 'bg-red-500/20 border-red-500 text-red-400'
                                : 'bg-surface border-white/10 text-text-muted hover:border-white/20'
                                }`}
                        >
                            <TrendingDown className="w-4 h-4" />
                            Pengeluaran
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-text-muted mb-2">Kategori *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        required
                    >
                        <option value="">Pilih kategori</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-text-muted mb-2">Jumlah (Rp) *</label>
                    <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        placeholder="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-text-muted mb-2">Referensi/Nota</label>
                    <input
                        type="text"
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        placeholder="No. nota atau order ID"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-text-muted mb-2">Keterangan</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        placeholder="Deskripsi transaksi"
                    />
                </div>
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
            </Button>
        </form>
    )
}

interface Transaction {
    id: string
    type: string
    category: string
    amount: number
    description: string | null
    date: Date
    reference: string | null
}

interface FinanceSummary {
    totalIncome: number
    totalExpense: number
    netProfit: number
}

interface FinanceClientProps {
    initialTransactions: Transaction[]
    summary: FinanceSummary
}

export default function FinanceClient({ initialTransactions, summary }: FinanceClientProps) {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
    const [showForm, setShowForm] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleDelete = (id: string) => {
        if (!confirm('Yakin ingin menghapus transaksi ini?')) return
        startTransition(async () => {
            const result = await deleteTransaction(id)
            if (result.success) {
                setTransactions(prev => prev.filter(item => item.id !== id))
            }
        })
    }

    const handleSuccess = () => {
        setShowForm(false)
        window.location.reload()
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
    }

    return (
        <div className="min-h-screen bg-[#0a0f0d] p-8 space-y-8">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Keuangan</h1>
                        <p className="text-sm text-text-muted">Kelola pemasukan dan pengeluaran</p>
                    </div>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Transaksi
                </Button>
            </header>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-6 border-green-500/20">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                        Total Pemasukan
                    </div>
                    <div className="text-2xl font-bold text-green-400">{formatCurrency(summary.totalIncome)}</div>
                </Card>
                <Card className="p-6 border-red-500/20">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                        Total Pengeluaran
                    </div>
                    <div className="text-2xl font-bold text-red-400">{formatCurrency(summary.totalExpense)}</div>
                </Card>
                <Card className="p-6 border-farm-500/20">
                    <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                        <Wallet className="w-4 h-4 text-farm-400" />
                        Laba Bersih
                    </div>
                    <div className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-farm-400' : 'text-red-400'}`}>
                        {formatCurrency(summary.netProfit)}
                    </div>
                </Card>
            </div>

            {/* Add Form */}
            {showForm && (
                <Card className="p-6">
                    <h2 className="text-lg font-bold mb-4">Tambah Transaksi Baru</h2>
                    <TransactionForm onSuccess={handleSuccess} />
                </Card>
            )}

            {/* Transactions Table */}
            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Riwayat Transaksi</h2>
                {transactions.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                        <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada transaksi</p>
                        <p className="text-sm">Klik &quot;Tambah Transaksi&quot; untuk mulai</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Tanggal</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Tipe</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Kategori</th>
                                    <th className="text-right py-3 px-4 text-text-muted font-medium">Jumlah</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Keterangan</th>
                                    <th className="text-right py-3 px-4 text-text-muted font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(item => (
                                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4 text-text-muted">
                                            {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="py-3 px-4">
                                            {item.type === 'INCOME' ? (
                                                <span className="flex items-center gap-1 text-green-400">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                    Masuk
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-400">
                                                    <ArrowDownRight className="w-4 h-4" />
                                                    Keluar
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{item.category}</td>
                                        <td className={`py-3 px-4 text-right font-mono ${item.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                                            {item.type === 'INCOME' ? '+' : '-'}{formatCurrency(item.amount)}
                                        </td>
                                        <td className="py-3 px-4 text-text-muted">{item.description || '-'}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isPending}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    )
}
