import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    let goatCount = 'Loading...';
    let error = null;
    let envCheck = {
        hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
        tursoUrlLen: process.env.TURSO_DATABASE_URL?.length,
        hasAuth: !!process.env.TURSO_AUTH_TOKEN
    };

    try {
        const count = await prisma.goat.count();
        goatCount = count.toString();
    } catch (e: any) {
        error = e.message + (e.stack ? '\n' + e.stack : '');
    }

    return (
        <div className="p-10 text-white bg-slate-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Database Debug Status</h1>

            <div className="bg-slate-800 p-4 rounded mb-4">
                <h2 className="text-lg font-bold text-blue-400">Environment Variables</h2>
                <pre className="mt-2 font-mono text-sm">{JSON.stringify(envCheck, null, 2)}</pre>
            </div>

            <div className="bg-slate-800 p-4 rounded mb-4">
                <h2 className="text-lg font-bold text-blue-400">Connection Test</h2>
                {error ? (
                    <div className="text-red-400 mt-2">
                        <p className="font-bold">❌ CONNECTION FAILED:</p>
                        <pre className="whitespace-pre-wrap mt-2 font-mono text-xs bg-black/50 p-2 rounded">{error}</pre>
                    </div>
                ) : (
                    <div className="text-green-400 mt-2">
                        <p className="font-bold">✅ SUCCESS</p>
                        <p className="text-xl">Goat Count: {goatCount}</p>
                    </div>
                )}
            </div>

            <div className="bg-slate-800 p-4 rounded mb-4">
                <h2 className="text-lg font-bold text-blue-400">Schema Check</h2>
                <p className="text-sm text-gray-400">If count is not showing or error says "no such table", schema migration failed.</p>
            </div>
        </div>
    );
}
