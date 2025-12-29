'use server'

import { prisma } from '@/lib/prisma'

export interface LandingStats {
    totalGoats: number;
    happyCustomers: number;
    breeds: number;
    successRate: number;
}

export async function getLandingStats(): Promise<LandingStats> {
    try {
        const [totalGoats, happyCustomers, breedStats] = await Promise.all([
            // 1. Total Goats (Available + Sold)
            prisma.goat.count(),

            // 2. Happy Customers (Unique users with COMPLETED orders)
            prisma.order.groupBy({
                by: ['userId'],
                where: { status: 'DELIVERED', paymentStatus: 'PAID' },
            }).then(groups => groups.length),

            // 3. Breeds count
            prisma.goat.groupBy({
                by: ['breed'],
            }).then(groups => groups.length)
        ]);

        return {
            totalGoats: totalGoats,
            happyCustomers: happyCustomers,
            breeds: breedStats,
            successRate: 99 // Hardcoded for now until we track cancellations
        };
    } catch (error) {
        console.error('Failed to get landing stats:', error);
        return {
            totalGoats: 120, // Fallback
            happyCustomers: 85,
            breeds: 8,
            successRate: 99
        };
    }
}
