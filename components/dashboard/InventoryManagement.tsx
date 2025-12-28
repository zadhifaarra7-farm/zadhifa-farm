'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { addGoat, updateGoat, deleteGoat, getAllGoats } from '@/lib/actions/goat';

type Goat = {
    id: string;
    registrationCode: string;
    breed: string;
    gender: string;
    currentWeight: number;
    basePrice: number;
    isAvailable: boolean;
    notes?: string | null;
};

export default function InventoryManagement() {
    const [goats, setGoats] = useState<Goat[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingGoat, setEditingGoat] = useState<Goat | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadGoats();
    }, []);

    const loadGoats = async () => {
        const data = await getAllGoats();
        setGoats(data as Goat[]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        if (editingGoat) {
            await updateGoat(editingGoat.id, formData);
        } else {
            await addGoat(formData);
        }

        setLoading(false);
        setShowForm(false);
        setEditingGoat(null);
        loadGoats();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Yakin hapus domba ini?')) {
            await deleteGoat(id);
            loadGoats();
        }
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Kelola Inventaris</h2>
                <Button onClick={() => { setShowForm(true); setEditingGoat(null); }} className="gap-2">
                    <Plus className="w-4 h-4" /> Tambah Domba
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg p-6 relative">
                        <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-text-muted hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold mb-6">{editingGoat ? 'Edit Domba' : 'Tambah Domba Baru'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-muted mb-1">Jenis/Ras</label>
                                    <select name="breed" defaultValue={editingGoat?.breed || 'Dorper'} className="input w-full">
                                        <option value="Dorper">Dorper</option>
                                        <option value="Garut">Garut</option>
                                        <option value="Etawa">Etawa</option>
                                        <option value="Kacang">Kacang</option>
                                        <option value="Boer">Boer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-1">Gender</label>
                                    <select name="gender" defaultValue={editingGoat?.gender || 'MALE'} className="input w-full">
                                        <option value="MALE">Jantan</option>
                                        <option value="FEMALE">Betina</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-muted mb-1">Berat (kg)</label>
                                    <input type="number" name="weight" defaultValue={editingGoat?.currentWeight || 30} className="input w-full" step="0.1" />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-1">Harga (Rp)</label>
                                    <input type="number" name="price" defaultValue={editingGoat?.basePrice || 3000000} className="input w-full" step="100000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1">Tanggal Lahir</label>
                                <input type="date" name="birthDate" className="input w-full" />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1">Catatan</label>
                                <textarea name="notes" defaultValue={editingGoat?.notes || ''} className="input w-full" rows={2} placeholder="Catatan tambahan..."></textarea>
                            </div>
                            {editingGoat && (
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" name="isAvailable" value="true" defaultChecked={editingGoat.isAvailable} />
                                        <span className="text-sm">Tersedia untuk dijual</span>
                                    </label>
                                </div>
                            )}
                            <Button type="submit" isLoading={loading} className="w-full">
                                {editingGoat ? 'Update' : 'Simpan'}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-farm-400">{goats.length}</div>
                    <div className="text-sm text-text-muted">Total</div>
                </Card>
                <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{goats.filter(g => g.gender === 'MALE').length}</div>
                    <div className="text-sm text-text-muted">Jantan</div>
                </Card>
                <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-pink-400">{goats.filter(g => g.gender === 'FEMALE').length}</div>
                    <div className="text-sm text-text-muted">Betina</div>
                </Card>
                <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-gold-400">{goats.filter(g => g.isAvailable).length}</div>
                    <div className="text-sm text-text-muted">Tersedia</div>
                </Card>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-surface-elevated border-b border-white/5">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-text-muted">Kode</th>
                                <th className="text-left p-4 text-sm font-medium text-text-muted">Jenis</th>
                                <th className="text-left p-4 text-sm font-medium text-text-muted">Gender</th>
                                <th className="text-left p-4 text-sm font-medium text-text-muted">Berat</th>
                                <th className="text-left p-4 text-sm font-medium text-text-muted">Harga</th>
                                <th className="text-left p-4 text-sm font-medium text-text-muted">Status</th>
                                <th className="text-left p-4 text-sm font-medium text-text-muted">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goats.map((goat) => (
                                <tr key={goat.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4 font-mono text-sm">{goat.registrationCode}</td>
                                    <td className="p-4">{goat.breed}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${goat.gender === 'MALE' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
                                            {goat.gender === 'MALE' ? 'Jantan' : 'Betina'}
                                        </span>
                                    </td>
                                    <td className="p-4">{goat.currentWeight} kg</td>
                                    <td className="p-4 text-gold-400">{formatRupiah(goat.basePrice)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${goat.isAvailable ? 'bg-farm-500/20 text-farm-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {goat.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingGoat(goat); setShowForm(true); }} className="p-2 hover:bg-white/10 rounded">
                                                <Pencil className="w-4 h-4 text-farm-400" />
                                            </button>
                                            <button onClick={() => handleDelete(goat.id)} className="p-2 hover:bg-white/10 rounded">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {goats.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-text-muted">
                                        Belum ada data domba. Klik "Tambah Domba" untuk mulai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
