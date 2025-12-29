'use client'

import { useState, useTransition } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Plus, Trash2, Package, Leaf, Droplets, Pill } from 'lucide-react'
import Link from 'next/link'
import { addFeedStock, deleteFeedStock } from '@/lib/actions/feed'

const FEED_TYPES = [
    { value: 'RUMPUT', label: 'Rumput', icon: Leaf, color: 'text-green-400' },
    { value: 'KONSENTRAT', label: 'Konsentrat', icon: Package, color: 'text-yellow-400' },
    { value: 'HIJAUAN', label: 'Hijauan', icon: Droplets, color: 'text-blue-400' },
    { value: 'MINERAL', label: 'Mineral/Vitamin', icon: Pill, color: 'text-purple-400' },
]

interface FeedFormProps {
    onSuccess: () => void
}

function FeedForm({ onSuccess }: FeedFormProps) {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: '',
        type: 'RUMPUT',
        quantity: '',
        pricePerUnit: '',
        supplier: '',
        notes: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const result = await addFeedStock({
                name: formData.name,
                type: formData.type,
                quantity: parseFloat(formData.quantity),
                pricePerUnit: formData.pricePerUnit ? parseFloat(formData.pricePerUnit) : undefined,
                supplier: formData.supplier || undefined,
                notes: formData.notes || undefined
            })
            if (result.success) {
                setFormData({ name: '', type: 'RUMPUT', quantity: '', pricePerUnit: '', supplier: '', notes: '' })
                onSuccess()
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-text-muted mb-2">Nama Pakan *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        placeholder="Contoh: Rumput Gajah"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-text-muted mb-2">Jenis Pakan *</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                    >
                        {FEED_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-text-muted mb-2">Jumlah (kg) *</label>
                    <input
                        type="number"
                        step="0.1"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        placeholder="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-text-muted mb-2">Harga per kg</label>
                    <input
                        type="number"
                        value={formData.pricePerUnit}
                        onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        placeholder="Rp 0"
                    />
                </div>
                <div>
                    <label className="block text-sm text-text-muted mb-2">Supplier</label>
                    <input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        placeholder="Nama supplier"
                    />
                </div>
                <div>
                    <label className="block text-sm text-text-muted mb-2">Catatan</label>
                    <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-white focus:border-farm-500 focus:outline-none"
                        placeholder="Catatan tambahan"
                    />
                </div>
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Menyimpan...' : 'Tambah Stok Pakan'}
            </Button>
        </form>
    )
}

interface FeedStock {
    id: string
    name: string
    type: string
    quantity: number
    unit: string
    pricePerUnit: number | null
    supplier: string | null
    notes: string | null
    createdAt: Date
}

interface FeedClientProps {
    initialData: FeedStock[]
}

export default function FeedClient({ initialData }: FeedClientProps) {
    const [feedStock, setFeedStock] = useState<FeedStock[]>(initialData)
    const [showForm, setShowForm] = useState(false)
    const [isPending, startTransition] = useTransition()

    const totalStock = feedStock.reduce((sum, item) => sum + item.quantity, 0)

    const handleDelete = (id: string) => {
        if (!confirm('Yakin ingin menghapus stok ini?')) return
        startTransition(async () => {
            const result = await deleteFeedStock(id)
            if (result.success) {
                setFeedStock(prev => prev.filter(item => item.id !== id))
            }
        })
    }

    const handleSuccess = () => {
        setShowForm(false)
        // Refresh data via revalidation
        window.location.reload()
    }

    const getTypeInfo = (type: string) => {
        return FEED_TYPES.find(t => t.value === type) || FEED_TYPES[0]
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
                        <h1 className="text-2xl font-bold">Stok Pakan</h1>
                        <p className="text-sm text-text-muted">Kelola stok pakan ternak</p>
                    </div>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Stok
                </Button>
            </header>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card className="p-6">
                    <div className="text-sm text-text-muted mb-1">Total Stok</div>
                    <div className="text-2xl font-bold text-farm-400">{(totalStock / 1000).toFixed(2)} Ton</div>
                </Card>
                {FEED_TYPES.map(type => {
                    const TypeIcon = type.icon
                    const typeTotal = feedStock.filter(f => f.type === type.value).reduce((s, i) => s + i.quantity, 0)
                    return (
                        <Card key={type.value} className="p-6">
                            <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                                <TypeIcon className={`w-4 h-4 ${type.color}`} />
                                {type.label}
                            </div>
                            <div className="text-2xl font-bold">{typeTotal.toLocaleString()} kg</div>
                        </Card>
                    )
                })}
            </div>

            {/* Add Form */}
            {showForm && (
                <Card className="p-6">
                    <h2 className="text-lg font-bold mb-4">Tambah Stok Pakan Baru</h2>
                    <FeedForm onSuccess={handleSuccess} />
                </Card>
            )}

            {/* Feed Stock Table */}
            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Daftar Stok Pakan</h2>
                {feedStock.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada stok pakan</p>
                        <p className="text-sm">Klik &quot;Tambah Stok&quot; untuk mulai</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Nama</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Jenis</th>
                                    <th className="text-right py-3 px-4 text-text-muted font-medium">Jumlah</th>
                                    <th className="text-right py-3 px-4 text-text-muted font-medium">Harga/kg</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Supplier</th>
                                    <th className="text-left py-3 px-4 text-text-muted font-medium">Tanggal</th>
                                    <th className="text-right py-3 px-4 text-text-muted font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedStock.map(item => {
                                    const typeInfo = getTypeInfo(item.type)
                                    const TypeIcon = typeInfo.icon
                                    return (
                                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-3 px-4 font-medium">{item.name}</td>
                                            <td className="py-3 px-4">
                                                <span className={`flex items-center gap-2 ${typeInfo.color}`}>
                                                    <TypeIcon className="w-4 h-4" />
                                                    {typeInfo.label}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-mono">{item.quantity.toLocaleString()} {item.unit}</td>
                                            <td className="py-3 px-4 text-right font-mono">
                                                {item.pricePerUnit ? `Rp ${item.pricePerUnit.toLocaleString()}` : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-text-muted">{item.supplier || '-'}</td>
                                            <td className="py-3 px-4 text-text-muted">
                                                {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                            </td>
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
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    )
}
