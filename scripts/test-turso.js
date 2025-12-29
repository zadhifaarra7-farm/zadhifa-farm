const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Manual env load
const envPath = path.join(__dirname, '..', '.env');
const env = {};
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length > 1 && !line.trim().startsWith('#')) {
            let val = parts.slice(1).join('=').trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            env[parts[0].trim()] = val;
        }
    });
}

async function main() {
    console.log('=== TURSO CONNECTION TEST ===');
    const url = env.TURSO_DATABASE_URL;
    const authToken = env.TURSO_AUTH_TOKEN;

    if (!url) {
        console.error('❌ TURSO_DATABASE_URL not found in .env');
        return;
    }

    console.log('Connecting to:', url);

    try {
        const libsql = createClient({ url, authToken });
        const adapter = new PrismaLibSQL(libsql);
        const prisma = new PrismaClient({ adapter });

        console.log('Prisma Client initialized with LibSQL adapter.');

        // Test Queries
        console.log('1. Checking Goat table...');
        const goats = await prisma.goat.count();
        console.log(`✅ Goat Count: ${goats}`);

        console.log('2. Checking FeedStock table...');
        try {
            const feed = await prisma.feedStock.count();
            console.log(`✅ FeedStock Count: ${feed}`);
        } catch (e) {
            console.log('❌ FeedStock table missing or error:', e.message);
        }

        console.log('3. Checking Transaction table...');
        try {
            const trans = await prisma.transaction.count();
            console.log(`✅ Transaction Count: ${trans}`);
        } catch (e) {
            console.log('❌ Transaction table missing or error:', e.message);
        }

        await prisma.$disconnect();
    } catch (e) {
        console.error('❌ Fatal Error:', e);
    }
}

main();
