import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

// Check if we're in production (Turso) or development (local SQLite)
const isProduction = process.env.TURSO_DATABASE_URL;

let prisma: PrismaClient;

if (isProduction) {
    // Production: Use Turso via LibSQL adapter
    const libsql = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    prisma = new PrismaClient({ adapter });
} else {
    // Development: Use local SQLite
    const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
    prisma = globalForPrisma.prisma ?? new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
}

export { prisma };
