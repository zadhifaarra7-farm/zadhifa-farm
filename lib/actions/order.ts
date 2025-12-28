'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createWhatsAppOrder(registrationCode: string, buyerName: string, whatsapp: string) {
    // 1. Get Goat
    const goat = await prisma.goat.findUnique({
        where: { registrationCode }
    });

    if (!goat) return { success: false, error: 'Goat not found' };

    // 2. Create or get user
    const user = await prisma.user.upsert({
        where: { email: `${whatsapp}@guest.com` },
        update: { name: buyerName },
        create: {
            email: `${whatsapp}@guest.com`,
            name: buyerName,
            phone: whatsapp,
        }
    });

    // 3. Create Order
    const order = await prisma.order.create({
        data: {
            orderNumber: `WA-${Date.now().toString().slice(-6)}`,
            totalAmount: Number(goat.dynamicPrice || goat.basePrice),
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            userId: user.id,
            items: {
                create: {
                    goatId: goat.id,
                    priceAtPurchase: Number(goat.dynamicPrice || goat.basePrice),
                    weightAtPurchase: Number(goat.currentWeight)
                }
            },
            deliveryNotes: `WhatsApp Order from ${buyerName}`
        }
    });

    const link = `https://zadhifa-farm.vercel.app/pay/${order.orderNumber}`;
    return { success: true, phone: '6281234567890', text: `Halo Zadhifa Farm, saya ingin beli ${goat.breed} (${goat.registrationCode}). Order: ${order.orderNumber}. Link Payment: ${link}` };
}

export async function exportOrdersToCSV() {
    const orders = await prisma.order.findMany({
        include: { user: true, items: { include: { goat: true } } },
        orderBy: { createdAt: 'desc' }
    });

    const header = 'Order ID,Date,Customer,Phone,Item,Amount,Status,Payment\n';
    const rows = orders.map(o =>
        `${o.orderNumber},${o.createdAt.toISOString().split('T')[0]},"${o.user?.name || 'Guest'}",'${o.user?.phone || ''},',"${o.items[0]?.goat?.breed || 'N/A'}",${o.totalAmount},${o.status},${o.paymentStatus || 'N/A'}`
    ).join('\n');

    return header + rows;
}

export async function getOrdersForAdmin() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                items: { include: { goat: true } }
            }
        });
        return orders;
    } catch (error) {
        console.error('Failed to get orders:', error);
        return [];
    }
}

export async function updateOrderStatus(orderId: string, status: string, paymentStatus?: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: status,
                ...(paymentStatus && { paymentStatus }),
                ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
                ...(paymentStatus === 'PAID' && { paidAt: new Date() })
            }
        });
        revalidatePath('/dashboard/orders');
        return { success: true };
    } catch (error) {
        console.error('Failed to update order:', error);
        return { success: false, error: 'Database error' };
    }
}

export async function getOrderById(id: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                items: { include: { goat: true } }
            }
        });
        return order;
    } catch (error) {
        return null;
    }
}

export async function getOrderByNumber(orderNumber: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                user: true,
                items: { include: { goat: true } }
            }
        });
        return order;
    } catch (error) {
        return null;
    }
}

export async function uploadProof(formData: FormData) {
    const orderId = formData.get('orderId') as string;

    try {
        await prisma.order.update({
            where: { orderNumber: orderId },
            data: {
                paymentStatus: 'VERIFYING',
            }
        });
    } catch (e) {
        console.log(e);
        try {
            await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'VERIFYING' } });
        } catch (e2) { }
    }

    const { redirect } = await import('next/navigation');
    redirect('/dashboard/orders?status=VERIFYING');
}
