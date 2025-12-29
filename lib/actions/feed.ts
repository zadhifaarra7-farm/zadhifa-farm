'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getFeedStock() {
    try {
        const feed = await prisma.feedStock.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return feed
    } catch (error) {
        console.error('Failed to fetch feed stock:', error)
        return []
    }
}

export async function getTotalFeedStock() {
    try {
        const result = await prisma.feedStock.aggregate({
            _sum: { quantity: true }
        })
        return result._sum.quantity || 0
    } catch (error) {
        console.error('Failed to calculate total feed:', error)
        return 0
    }
}

export async function addFeedStock(data: {
    name: string
    type: string
    quantity: number
    unit?: string
    pricePerUnit?: number
    supplier?: string
    expiryDate?: Date
    notes?: string
}) {
    try {
        const feed = await prisma.feedStock.create({
            data: {
                name: data.name,
                type: data.type,
                quantity: data.quantity,
                unit: data.unit || 'kg',
                pricePerUnit: data.pricePerUnit,
                supplier: data.supplier,
                expiryDate: data.expiryDate,
                notes: data.notes
            }
        })
        revalidatePath('/dashboard/feed')
        revalidatePath('/dashboard')
        return { success: true, data: feed }
    } catch (error) {
        console.error('Failed to add feed stock:', error)
        return { success: false, error: 'Gagal menambah stok pakan' }
    }
}

export async function updateFeedStock(id: string, data: {
    name?: string
    type?: string
    quantity?: number
    unit?: string
    pricePerUnit?: number
    supplier?: string
    expiryDate?: Date
    notes?: string
}) {
    try {
        const feed = await prisma.feedStock.update({
            where: { id },
            data
        })
        revalidatePath('/dashboard/feed')
        revalidatePath('/dashboard')
        return { success: true, data: feed }
    } catch (error) {
        console.error('Failed to update feed stock:', error)
        return { success: false, error: 'Gagal mengupdate stok pakan' }
    }
}

export async function deleteFeedStock(id: string) {
    try {
        await prisma.feedStock.delete({
            where: { id }
        })
        revalidatePath('/dashboard/feed')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete feed stock:', error)
        return { success: false, error: 'Gagal menghapus stok pakan' }
    }
}
