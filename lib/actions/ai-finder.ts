'use server'

import { prisma } from '@/lib/prisma'

export interface SearchParams {
    budget: number;
    purpose: string;
    eventDate?: Date;
}

export async function searchGoats(params: SearchParams) {
    try {
        // 1. Fetch available goats
        const goats = await prisma.goat.findMany({
            where: {
                isAvailable: true,
                currentWeight: { gte: 25 }, // Minimum viable weight
            },
            take: 20 // Limit for performance
        });

        // 2. Score them
        const scoredGoats = goats.map(goat => {
            let score = 0;

            // Budget Score (30%)
            // If goat price is within budget, full score. If higher, penalty.
            const price = goat.dynamicPrice || goat.basePrice;
            const budgetRatio = price / params.budget;

            if (budgetRatio <= 1.0) {
                score += 30; // Within budget
            } else if (budgetRatio <= 1.2) {
                score += 15; // Slightly over
            } else {
                score += 0; // Too expensive
            }

            // Purpose Score (30%)
            if (goat.purposes.includes(params.purpose)) {
                score += 30;
            } else if (goat.purposes.includes('MEAT') && params.purpose === 'AQIQAH') {
                score += 20; // Meat goats okay for Aqiqah
            }

            // Health Score (20%)
            if (goat.healthStatus === 'EXCELLENT') score += 20;
            else if (goat.healthStatus === 'GOOD') score += 15;

            // Weight Bonus (20%)
            // Heavier is generally better for Qurban/Aqiqah
            if (goat.currentWeight > 35) score += 20;
            else score += (goat.currentWeight / 35) * 20;

            return {
                ...goat,
                matchPercentage: Math.min(99, Math.round(score)),
                price: price
            };
        });

        // 3. Sort by match score and return top 3
        return scoredGoats
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, 3)
            .map(g => ({
                id: g.id,
                name: g.name,
                breed: g.breed,
                weight: g.currentWeight,
                price: g.price,
                image: g.mediaUrls ? JSON.parse(g.mediaUrls)[0] : null,
                match: g.matchPercentage
            }));

    } catch (error) {
        console.error('AI Search Error:', error);
        return [];
    }
}
