'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password');

        // Simple client-side check for demo
        if (password === 'admin123') {
            // Set cookie via API route or just redirect for demo
            document.cookie = 'admin_session=true; path=/';
            router.push('/dashboard');
        } else {
            setError('Invalid password');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4">
            <Card className="w-full max-w-md p-8 border-gold-500/20">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                        Admin Access
                    </h1>
                    <p className="text-text-muted mt-2">Zadhifa Farm Command Center</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-farm-300 mb-2">
                            Security Code
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="input w-full text-center tracking-widest text-lg"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <Button className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400" disabled={loading}>
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
