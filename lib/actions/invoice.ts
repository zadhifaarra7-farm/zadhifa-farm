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

interface InvoiceItem {
    name: string
    breed: string
    weight: number
    price: number
    quantity: number
}

interface CreateInvoiceData {
    orderId?: string
    buyerName: string
    buyerPhone: string
    buyerEmail?: string
    items: InvoiceItem[]
    subtotal: number
    tax?: number
    discount?: number
    total: number
    notes?: string
}

export async function createInvoice(data: CreateInvoiceData) {
    try {
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber: generateInvoiceNumber(),
                orderId: data.orderId,
                buyerName: data.buyerName,
                buyerPhone: data.buyerPhone,
                buyerEmail: data.buyerEmail,
                items: JSON.stringify(data.items),
                subtotal: data.subtotal,
                tax: data.tax || 0,
                discount: data.discount || 0,
                total: data.total,
                notes: data.notes,
                status: 'PENDING'
            }
        })

        revalidatePath('/dashboard/invoices')
        revalidatePath('/dashboard')

        return { success: true, data: invoice }
    } catch (error) {
        console.error('Failed to create invoice:', error)
        return { success: false, error: 'Gagal membuat invoice' }
    }
}

export async function getInvoices(status?: string) {
    try {
        const invoices = await prisma.invoice.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
            include: { order: true }
        })
        return invoices
    } catch (error) {
        console.error('Failed to fetch invoices:', error)
        return []
    }
}

export async function getInvoiceById(id: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: { order: true }
        })
        return invoice
    } catch (error) {
        console.error('Failed to fetch invoice:', error)
        return null
    }
}

export async function getInvoiceByNumber(invoiceNumber: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { invoiceNumber },
            include: { order: true }
        })
        return invoice
    } catch (error) {
        console.error('Failed to fetch invoice:', error)
        return null
    }
}

export async function updateInvoiceStatus(id: string, status: string, paymentMethod?: string) {
    try {
        // 1. Update Invoice
        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                status,
                ...(paymentMethod && { paymentMethod }),
                ...(status === 'PAID' && { paidAt: new Date() })
            },
            include: {
                order: {
                    include: {
                        items: true
                    }
                }
            }
        })

        // 2. If PAID, update stock (Goat availability) AND Record Transaction
        if (status === 'PAID') {
            // A. Update Stock
            if (invoice.order?.items) {
                for (const item of invoice.order.items) {
                    if (item.goatId) {
                        try {
                            await prisma.goat.update({
                                where: { id: item.goatId },
                                data: { isAvailable: false }
                            });
                        } catch (e) {
                            console.error('Error updating goat stock', e)
                        }
                    }
                }
            }

            // B. Record Finance Income
            try {
                await prisma.transaction.create({
                    data: {
                        type: 'INCOME',
                        category: 'Penjualan Domba',
                        amount: invoice.total,
                        description: `Pembayaran Invoice #${invoice.invoiceNumber} (${invoice.buyerName})`,
                        date: new Date(),
                        reference: invoice.invoiceNumber
                    }
                })
            } catch (e) {
                console.error('Error creating finance transaction', e)
            }
        }

        revalidatePath('/dashboard/invoices')
        return { success: true }
    } catch (error) {
        console.error('Failed to update invoice:', error)
        return { success: false, error: 'Gagal update status invoice' }
    }
}

export async function getInvoiceSummary() {
    try {
        const [pending, paid, cancelled, totalRevenue] = await Promise.all([
            prisma.invoice.count({ where: { status: 'PENDING' } }),
            prisma.invoice.count({ where: { status: 'PAID' } }),
            prisma.invoice.count({ where: { status: 'CANCELLED' } }),
            prisma.invoice.aggregate({
                where: { status: 'PAID' },
                _sum: { total: true }
            })
        ])

        return {
            pending,
            paid,
            cancelled,
            totalRevenue: totalRevenue._sum.total || 0
        }
    } catch (error) {
        console.error('Failed to get invoice summary:', error)
        return { pending: 0, paid: 0, cancelled: 0, totalRevenue: 0 }
    }
}

// Generate WhatsApp message for invoice notification to admin
export async function generateAdminWhatsAppLink(invoice: {
    invoiceNumber: string
    buyerName: string
    buyerPhone: string
    total: number
    items: string
}) {
    const itemsArray = JSON.parse(invoice.items) as InvoiceItem[]
    const itemsList = itemsArray.map(i => `• ${i.name} (${i.breed}) - ${i.weight}kg`).join('\n')

    const message = `🧾 *INVOICE BARU - ${invoice.invoiceNumber}*

📋 *Detail Pesanan:*
${itemsList}

💰 *Total:* Rp ${invoice.total.toLocaleString('id-ID')}

👤 *Pembeli:*
Nama: ${invoice.buyerName}
HP: ${invoice.buyerPhone}

Status: MENUNGGU PEMBAYARAN

Silakan cek dashboard untuk detail lebih lanjut.`

    const encodedMessage = encodeURIComponent(message)
    // Admin phone number
    const adminPhone = '6287722076763'

    return `https://wa.me/${adminPhone}?text=${encodedMessage}`
}
