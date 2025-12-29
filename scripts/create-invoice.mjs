// Simple script to create Invoice table in Turso
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
}

async function main() {
    console.log('=== CREATE INVOICE TABLE ===');
    console.log('Connecting to Turso:', url);

    const client = createClient({ url, authToken });

    try {
        const sqlPath = join(process.cwd(), 'scripts', 'create-invoice-table.sql');
        const sql = readFileSync(sqlPath, 'utf-8');

        const statements = sql.split(';').filter(s => s.trim());

        for (const stmt of statements) {
            if (stmt.trim()) {
                console.log('Running:', stmt.substring(0, 50) + '...');
                await client.execute(stmt);
            }
        }

        console.log('✅ Invoice table created successfully!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
