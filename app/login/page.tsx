'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { login } from '@/lib/actions/auth';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full btn-gold" disabled={pending}>
            {pending ? 'Verifying...' : 'Access Dashboard'}
        </Button>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] p-4">
            <Card className="w-full max-w-md p-8 border-gold-500/20">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                        Admin Access
                    </h1>
                    <p className="text-text-muted mt-2">Zadhifa Farm Command Center</p>
                </div>

                <form action={login} className="space-y-6">
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

                    <SubmitButton />
                </form>
            </Card>
        </div>
    );
}
