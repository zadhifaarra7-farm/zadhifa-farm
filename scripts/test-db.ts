const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('=== ENV CHECK START ===');
    const envPath = path.join(__dirname, '..', '.env');

    if (!fs.existsSync(envPath)) {
        console.error('❌ .env file NOT FOUND at ' + envPath);
        console.log('Current directory: ' + process.cwd());
        return;
    }

    console.log('✅ .env file exists.');

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    let dbUrl = '';

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('DATABASE_URL') && !trimmed.startsWith('#')) {
            console.log('✅ Found DATABASE_URL key in .env');
            const parts = line.split('=');
            if (parts.length > 1) {
                let val = parts.slice(1).join('=').trim();
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);

                dbUrl = val;
                console.log('✅ DATABASE_URL has value (length: ' + dbUrl.length + ')');
            }
            break;
        }
    }

    if (!dbUrl) {
        console.error('❌ DATABASE_URL key NOT FOUND, empty, or commented out in .env');
        const examplePath = path.join(__dirname, '..', '.env.example');
        if (fs.existsSync(examplePath)) {
            console.log('Content of .env.example (reference):');
            console.log(fs.readFileSync(examplePath, 'utf-8'));
        }
        return;
    }

    console.log('=== ENV CHECK END ===');

    console.log('=== CONNECTION TEST WITH MANUAL ENV ===');
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: dbUrl
            }
        }
    });

    try {
        const goats = await prisma.goat.count();
        console.log(`✅ Connection SUCCESS. Goat Count: ${goats}`);

        if (prisma.feedStock) {
            const feeds = await prisma.feedStock.count();
            console.log(`✅ FeedStock Count: ${feeds}`);
        } else {
            console.log('⚠️ prisma.feedStock is undefined. Client might be outdated.');
        }
    } catch (e) {
        console.error('❌ Connection FAILED with manual URL:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
