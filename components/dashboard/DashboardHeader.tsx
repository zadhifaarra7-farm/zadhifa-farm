'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
    title: string;
    subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: Props) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="secondary" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
                </div>
            </div>
            <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                    <Home className="w-4 h-4" />
                    Dashboard
                </Button>
            </Link>
        </div>
    );
}
