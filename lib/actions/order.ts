'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Generate invoice number: INV-YYYYMMDD-XXXX
function generateInvoiceNumber(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(1000 + Math.random() * 9000)
    return `INV-${dateStr}-${random}`
}

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
            password: 'GUEST_USER',
        }
    });

    // 3. Create Order
    const orderTotal = Number(goat.dynamicPrice || goat.basePrice);
    const order = await prisma.order.create({
        data: {
            orderNumber: `WA-${Date.now().toString().slice(-6)}`,
            subtotal: orderTotal,
            totalAmount: orderTotal,
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            userId: user.id,
            items: {
                create: {
                    goatId: goat.id,
                    priceAtPurchase: orderTotal,
                    weightAtPurchase: Number(goat.currentWeight)
                }
            },
            deliveryNotes: `WhatsApp Order from ${buyerName}`
        }
    });

    // 4. Create Invoice automatically
    const invoiceNumber = generateInvoiceNumber();
    const invoiceItems = [{
        name: goat.name,
        breed: goat.breed,
        weight: Number(goat.currentWeight),
        price: orderTotal,
        quantity: 1
    }];

    try {
        await prisma.invoice.create({
            data: {
                invoiceNumber,
                orderId: order.id,
                buyerName,
                buyerPhone: whatsapp,
                items: JSON.stringify(invoiceItems),
                subtotal: orderTotal,
                total: orderTotal,
                status: 'PENDING'
            }
        });
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        console.error('Failed to create invoice:', error);
        // Continue even if invoice fails - order is still valid
    }

    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard');

    const orderMessage = `🧾 *INVOICE ${invoiceNumber}*
🐐 *ORDER ZADHIFA FARM*

📋 *Detail Pesanan:*
- Jenis: ${goat.breed}
- Kode: ${goat.registrationCode}
- Berat: ${goat.currentWeight} kg
- Harga: Rp ${orderTotal.toLocaleString('id-ID')}

👤 *Data Pembeli:*
- Nama: ${buyerName}
- No HP: ${whatsapp}

🏦 *Transfer ke:*
Bank BCA: 1390404430
a.n Mahardhika Fawzan Dwipayana

Order ID: ${order.orderNumber}
Invoice: ${invoiceNumber}

Mohon konfirmasi ketersediaan. Terima kasih! 🙏`;

    return { success: true, phone: '6287722076763', text: orderMessage, invoiceNumber };
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
