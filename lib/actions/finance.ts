'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTransactions(limit?: number) {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' },
            take: limit
        })
        return transactions
    } catch (error) {
        console.error('Failed to fetch transactions:', error)
        return []
    }
}

export async function getFinanceSummary() {
    try {
        const [income, expense] = await Promise.all([
            prisma.transaction.aggregate({
                where: { type: 'INCOME' },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: { type: 'EXPENSE' },
                _sum: { amount: true }
            })
        ])

        const totalIncome = income._sum.amount || 0
        const totalExpense = expense._sum.amount || 0
        const netProfit = totalIncome - totalExpense

        return {
            totalIncome,
            totalExpense,
            netProfit
        }
    } catch (error) {
        console.error('Failed to calculate finance summary:', error)
        return {
            totalIncome: 0,
            totalExpense: 0,
            netProfit: 0
        }
    }
}

export async function getYearlyRevenue() {
    try {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1)

        const result = await prisma.transaction.aggregate({
            where: {
                type: 'INCOME',
                date: { gte: startOfYear }
            },
            _sum: { amount: true }
        })

        return result._sum.amount || 0
    } catch (error) {
        console.error('Failed to calculate yearly revenue:', error)
        return 0
    }
}

export async function addTransaction(data: {
    type: 'INCOME' | 'EXPENSE'
    category: string
    amount: number
    description?: string
    date?: Date
    reference?: string
}) {
    try {
        const transaction = await prisma.transaction.create({
            data: {
                type: data.type,
                category: data.category,
                amount: data.amount,
                description: data.description,
                date: data.date || new Date(),
                reference: data.reference
            }
        })
        revalidatePath('/dashboard/finance')
        revalidatePath('/dashboard')
        return { success: true, data: transaction }
    } catch (error) {
        console.error('Failed to add transaction:', error)
        return { success: false, error: 'Gagal menambah transaksi' }
    }
}

export async function deleteTransaction(id: string) {
    try {
        await prisma.transaction.delete({
            where: { id }
        })
        revalidatePath('/dashboard/finance')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete transaction:', error)
        return { success: false, error: 'Gagal menghapus transaksi' }
    }
}
