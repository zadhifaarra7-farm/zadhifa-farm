'use client';

import { Button } from '@/components/ui/Button';

export default function LogoutButton() {
    const handleLogout = () => {
        document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/login';
    };

    return (
        <Button
            variant="ghost"
            className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleLogout}
        >
            Keluar
        </Button>
    );
}
