'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
    try {
        const [totalGoats, healthyGoats, lowFeed] = await Promise.all([
            prisma.goat.count(),
            prisma.goat.count({ where: { healthStatus: 'EXCELLENT' } }),
            // Mocking feed stock for now as we don't have a Feed model yet
            Promise.resolve(2.4)
        ]);

        // Calculate health score %
        const healthScore = totalGoats > 0 ? ((healthyGoats / totalGoats) * 100).toFixed(1) : 0;

        return {
            totalGoats,
            healthScore: `${healthScore}%`,
            feedStock: `${lowFeed} Tons`,
            revenueYear: 'Rp 142.5M' // Mock revenue for demo
        };
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return {
            totalGoats: 0,
            healthScore: '0%',
            feedStock: '0 Tons',
            revenueYear: 'Rp 0'
        };
    }
}

export async function getRecentAlerts() {
    // In a real app, this would query an Alerts/Notification table
    // For now, we simulate real-time checks based on data
    return [
        { msg: 'Pen A1 temperature normal (27°C)', time: 'Just now', type: 'success' },
        { msg: 'System backup completed', time: '1h ago', type: 'info' },
        { msg: 'Feed restocking required next week', time: '5h ago', type: 'warning' },
    ]
}

export async function getRecentOrders() {
    try {
        const orders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true, items: { include: { goat: true } } }
        });

        // Format for UI
        return orders.map(order => ({
            id: order.id,
            customer: order.user.name || 'Guest',
            amount: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.items[0]?.priceAtPurchase || 0),
            status: order.status,
            date: order.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            item: order.items[0]?.goat.breed || 'Goat'
        }));
    } catch (e) {
        console.error("Failed fetch orders", e);
        return [];
    }
}
