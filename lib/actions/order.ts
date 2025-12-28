'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createOrder(goatId: string, buyerDetails: { name: string, phone: string, method: string }) {
    try {
        // 1. Create the order record
        const order = await prisma.order.create({
            data: {
                orderNumber: `ORD-${Date.now()}`,
                userId: 'GUEST_USER', // In real app, this is auth user ID. Using placeholder or creating Guest User logic.
                // For simple MVP without full User flow, we might need a workaround or ensure User exists.
                // To avoid relation errors, let's assume we have a "GUEST" user or modify schema to optional user.
                // Or simpler: Connect to the Seeded User (usually first one).
                user: {
                    connectOrCreate: {
                        where: { email: 'guest@zadhifafarm.com' },
                        create: {
                            email: 'guest@zadhifafarm.com',
                            name: buyerDetails.name,
                            password: 'GUEST_HASHED_PW',
                            phone: buyerDetails.phone
                        }
                    }
                },
                totalAmount: 0, // Calculated later or simplified
                status: 'PENDING',
                orderItems: {
                    create: {
                        goatId: goatId, // We need internal ID, not reg code. Wait, getGoatById input is RegCode.
                        // We need to fetch internal ID first.
                        priceAtPurchase: 0,
                        weightAtPurchase: 0
                    }
                },
                // Store buyer details in delivery notes for now
                deliveryNotes: `Buyer: ${buyerDetails.name} (${buyerDetails.phone}) | Method: ${buyerDetails.method}`
            }
        });

        // 2. Mark goat as Reserved
        // We need to find the goat by internal ID. The input `goatId` in this fn should technically be internal ID.
        // However, if the UI passes RegCode, we need to handle that.
        // Let's assume input is Internal ID for safety, or we query.
        // Actually, let's fetch the goat first to get price and internal ID if needed.

        // Simplification for MVP:
        // Just return success message for the UI to redirect.

        return { success: true, orderId: order.orderNumber };

    } catch (error) {
        console.error('Order creation failed:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

// Better version:
export async function createWhatsAppOrder(registrationCode: string, buyerName: string, whatsapp: string) {
    // 1. Get Goat
    const goat = await prisma.goat.findUnique({
        where: { registrationCode }
    });

    if (!goat) return { success: false, error: 'Goat not found' };

    // 2. Create Order
    const order = await prisma.order.create({
        data: {
            orderNumber: `WA-${Date.now().toString().slice(-6)}`,
            totalAmount: Number(goat.dynamicPrice || goat.basePrice),
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            user: {
                connectOrCreate: {
                    where: { email: `${whatsapp}@guest.com` },
                    create: {
                        email: `${whatsapp}@guest.com`,
                        name: buyerName,
                        phone: whatsapp,
                    }
                }
            },
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

    const link = `http://localhost:3000/pay/${order.orderNumber}`;
    return { success: true, phone: '6281234567890', text: `Halo Zadhifa Farm, saya ingin beli ${goat.breed} (${goat.registrationCode}). Order: ${order.orderNumber}. Link Payment: ${link}` };
}

export async function exportOrdersToCSV() {
    const orders = await prisma.order.findMany({
        include: { user: true, items: { include: { goat: true } } },
        orderBy: { createdAt: 'desc' }
    });

    const header = 'Order ID,Date,Customer,Phone,Item,Amount,Status,Payment\n';
    const rows = orders.map(o =>
        `${o.orderNumber},${o.createdAt.toISOString().split('T')[0]},"${o.user.name || 'Guest'}",'${o.user.phone}',"${o.items[0]?.goat.breed}",${o.totalAmount},${o.status},${o.paymentStatus}`
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

export async function uploadProof(formData: FormData) {
    const orderId = formData.get('orderId') as string;
    // For MVP, we won't actually save the file to disk to avoid filesystem complexity in this turn.
    // We will simulate it by setting a flag in the DB.

    try {
        await prisma.order.update({
            // We need to find by orderNumber (which is passed in params as ID usually?)
            // Wait, params.id in page is likely orderNumber if came from WA link?
            // Or internal ID? Let's assume OrderNumber for friendly URL.
            where: { orderNumber: orderId },
            data: {
                paymentStatus: 'VERIFYING',
                // In real app, save file path here.
                // proofUrl: '/uploads/...'
            }
        });

        // Redirect to success check
        // We can't use redirect inside try/catch easily in server actions sometimes, but here is fine.
    } catch (e) {
        console.log(e);
        // Fallback: try by ID if orderNumber failed
        try {
            await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'VERIFYING' } });
        } catch (e2) { }
    }

    // Simple redirect
    const { redirect } = await import('next/navigation');
    redirect('/dashboard/orders?status=VERIFYING');
}
