'use server'

import { prisma } from '@/lib/prisma'

export interface SearchParams {
    budget: number;
    purpose: string;
    eventDate?: Date;
}

export async function searchGoats(params: SearchParams) {
    try {
        // 1. Fetch available goats WITHIN BUDGET only
        const goats = await prisma.goat.findMany({
            where: {
                isAvailable: true,
                currentWeight: { gte: 25 }, // Minimum viable weight
                // Filter by budget - only goats that cost <= budget
                OR: [
                    { dynamicPrice: { lte: params.budget } },
                    {
                        dynamicPrice: null,
                        basePrice: { lte: params.budget }
                    }
                ]
            },
            orderBy: [
                { dynamicPrice: 'desc' }, // Get best value (highest price within budget)
            ],
            take: 20 // Limit for performance
        });

        // If no goats within budget, get the 3 cheapest available
        let finalGoats = goats;
        if (goats.length === 0) {
            finalGoats = await prisma.goat.findMany({
                where: {
                    isAvailable: true,
                    currentWeight: { gte: 25 },
                },
                orderBy: [
                    { dynamicPrice: 'asc' },
                    { basePrice: 'asc' }
                ],
                take: 3
            });
        }

        // 2. Score them based on purpose and quality
        const scoredGoats = finalGoats.map(goat => {
            let score = 0;
            const price = Number(goat.dynamicPrice || goat.basePrice);
            const isWithinBudget = price <= params.budget;

            // Budget Score (40%) - strict scoring
            if (isWithinBudget) {
                // Closer to budget = better value = higher score
                const budgetUsage = price / params.budget;
                score += Math.round(budgetUsage * 40); // 0-40 points
            } else {
                // Over budget - minimal score
                score += 5;
            }

            // Purpose Score (30%)
            if (goat.purposes.includes(params.purpose)) {
                score += 30;
            } else if (goat.purposes.includes('MEAT') && (params.purpose === 'AQIQAH' || params.purpose === 'QURBAN')) {
                score += 20; // Meat goats okay for Aqiqah/Qurban
            }

            // Health Score (15%)
            if (goat.healthStatus === 'EXCELLENT') score += 15;
            else if (goat.healthStatus === 'GOOD') score += 10;
            else score += 5;

            // Weight Bonus (15%) - heavier is better for Qurban/Aqiqah
            const weightScore = Math.min(15, (Number(goat.currentWeight) / 40) * 15);
            score += Math.round(weightScore);

            // Parse media URLs
            let imageUrl = null;
            if (goat.mediaUrls) {
                try {
                    const urls = JSON.parse(goat.mediaUrls);
                    if (Array.isArray(urls) && urls.length > 0) {
                        imageUrl = urls[0];
                    }
                } catch (e) {
                    // If not JSON, maybe it's a direct URL
                    if (typeof goat.mediaUrls === 'string' && goat.mediaUrls.startsWith('http')) {
                        imageUrl = goat.mediaUrls;
                    }
                }
            }

            return {
                id: goat.id,
                name: goat.name,
                breed: goat.breed,
                weight: Number(goat.currentWeight),
                price: price,
                image: imageUrl,
                match: Math.min(99, Math.round(score)),
                isWithinBudget,
                healthStatus: goat.healthStatus,
                registrationCode: goat.registrationCode
            };
        });

        // 3. Sort by match score (within budget first, then by score)
        return scoredGoats
            .sort((a, b) => {
                // Prioritize within budget
                if (a.isWithinBudget && !b.isWithinBudget) return -1;
                if (!a.isWithinBudget && b.isWithinBudget) return 1;
                // Then by match score
                return b.match - a.match;
            })
            .slice(0, 6); // Return up to 6 results

    } catch (error) {
        console.error('AI Search Error:', error);
        return [];
    }
}
