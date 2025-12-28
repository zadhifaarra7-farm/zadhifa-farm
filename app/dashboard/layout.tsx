import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/actions/auth';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
        redirect('/login');
    }

    return (
        <section>
            {children}
        </section>
    );
}
