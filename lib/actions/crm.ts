'use server'

import { prisma } from '@/lib/prisma'

export interface CustomerProfile {
    id: string; // User ID
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastPurchase: Date;
    status: 'ACTIVE' | 'DORMANT' | 'NEW';
}

export async function getCustomers() {
    try {
        // Group orders by User.
        // Requires grouping or fetching users with orders.
        // Ideally we fetch Users and include Orders.

        // Since we are using "Guest" users mostly, let's query Users who have orders.
        const users = await prisma.user.findMany({
            where: {
                // simple filter: has orders
                orders: { some: {} }
            },
            include: {
                orders: {
                    select: {
                        totalAmount: true,
                        createdAt: true,
                        status: true
                    }
                }
            }
        });

        const customers: CustomerProfile[] = users.map(user => {
            const totalOrders = user.orders.length;
            const totalSpent = user.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

            // Find last purchase date
            const lastPurchase = user.orders.length > 0
                ? user.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
                : new Date(0); // Should not happen due to filter

            // Determine status
            const daysSinceLast = (Date.now() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
            let status: 'ACTIVE' | 'DORMANT' | 'NEW' = 'ACTIVE';
            if (daysSinceLast > 90) status = 'DORMANT';
            // If first purchase was recent
            if (totalOrders === 1 && daysSinceLast < 30) status = 'NEW';

            return {
                id: user.id,
                name: user.name || 'Unknown',
                email: user.email,
                phone: user.phone || '-',
                totalOrders,
                totalSpent,
                lastPurchase,
                status
            };
        });

        // Sort by LTV (High Rollers first)
        return customers.sort((a, b) => b.totalSpent - a.totalSpent);

    } catch (e) {
        console.error("CRM Error:", e);
        return [];
    }
}

export async function sendBroadcast(message: string, customerIds: string[]) {
    // Simulate sending WA/Email
    // In real app: Queue job for Twilio/WAbot
    console.log(`Sending broadcast to ${customerIds.length} customers: ${message}`);

    // Simulate delay
    await new Promise(r => setTimeout(r, 1000));

    return { success: true, count: customerIds.length };
}
