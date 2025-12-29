const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('=== TURSO SYNC START ===');

    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error('❌ TURSO credentials missing in env variables.');
        return;
    }

    console.log(`Connecting to Turso: ${url}`);

    const client = createClient({
        url,
        authToken
    });

    try {
        console.log("Executing SQL migration to create missing tables...");

        // First run the base tables
        const sqlPath = path.join(process.cwd(), 'scripts', 'create-tables.sql');
        console.log("SQL File:", sqlPath);
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        const statements = sql.split(';').filter(s => s.trim());

        for (const stmt of statements) {
            if (stmt.trim()) {
                console.log("Running statement:", stmt.substring(0, 50) + "...");
                await client.execute(stmt);
            }
        }

        // Then run the invoice table
        const invoiceSqlPath = path.join(process.cwd(), 'scripts', 'create-invoice-table.sql');
        if (fs.existsSync(invoiceSqlPath)) {
            console.log("Creating Invoice table...");
            const invoiceSql = fs.readFileSync(invoiceSqlPath, 'utf-8');
            const invoiceStatements = invoiceSql.split(';').filter(s => s.trim());

            for (const stmt of invoiceStatements) {
                if (stmt.trim()) {
                    console.log("Running:", stmt.substring(0, 50) + "...");
                    await client.execute(stmt);
                }
            }
        }

        console.log("✅ Tables created successfully in Turso.");

    } catch (e) {
        console.error('❌ Migration failed:', e);
    } finally {
        client.close();
    }
}

// Load .env manually because standalone script
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length > 1 && !line.trim().startsWith('#')) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, '');
            process.env[key] = val;
        }
    });
}

main();
