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
        const sqlPath = path.join(__dirname, '..', 'scripts', 'create-tables.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
        
        console.log('Executing SQL migration to create missing tables...');
        console.log('SQL File:', sqlPath);
        
        // Split by semicolon (crude but effective for CREATE TABLE statements)
        const statements = sqlContent.split(';').filter(s => s.trim().length > 0);
        
        for (const stmt of statements) {
            console.log('Running statement:', stmt.substring(0, 50) + '...');
            await client.execute(stmt);
        }
        
        console.log('✅ Tables created successfully in Turso.');
        
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
