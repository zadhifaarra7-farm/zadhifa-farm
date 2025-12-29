'use server'

import { prisma } from '@/lib/prisma'

export interface SearchParams {
    budget: number;
    purpose: string;
    eventDate?: Date;
    breed?: string;
    minWeight?: number;
}

export async function searchGoats(params: SearchParams) {
    try {
        // 1. Fetch ALL available goats first
        const allGoats = await prisma.goat.findMany({
            where: {
                isAvailable: true,
                currentWeight: { gte: params.minWeight || 25 },
                breed: params.breed ? { equals: params.breed } : undefined,
            },
            take: 50 // Get more to filter later
        });

        // 2. Filter by budget manually (more reliable with LibSQL)
        const withinBudget = allGoats.filter(goat => {
            const price = Number(goat.dynamicPrice || goat.basePrice);
            return price <= params.budget;
        });

        // 3. If no goats within budget, get the 3 cheapest as alternatives
        let finalGoats = withinBudget;
        let showingAlternatives = false;

        if (withinBudget.length === 0) {
            showingAlternatives = true;
            // Sort all by price and take 3 cheapest
            finalGoats = [...allGoats]
                .sort((a, b) => {
                    const priceA = Number(a.dynamicPrice || a.basePrice);
                    const priceB = Number(b.dynamicPrice || b.basePrice);
                    return priceA - priceB;
                })
                .slice(0, 3);
        }

        // 4. Score goats based on multiple factors
        const scoredGoats = finalGoats.map(goat => {
            let score = 0;
            const price = Number(goat.dynamicPrice || goat.basePrice);
            const isWithinBudget = price <= params.budget;

            // Budget Score (40%)
            if (isWithinBudget) {
                // Higher price within budget = better value = higher score
                const budgetUsage = price / params.budget;
                score += Math.round(budgetUsage * 40);
            } else {
                // Over budget - very low score
                score += 5;
            }

            // Purpose Score (30%)
            if (goat.purposes.includes(params.purpose)) {
                score += 30;
            } else if (goat.purposes.includes('MEAT') && (params.purpose === 'AQIQAH' || params.purpose === 'QURBAN')) {
                score += 20;
            }

            // Health Score (15%)
            if (goat.healthStatus === 'EXCELLENT') score += 15;
            else if (goat.healthStatus === 'GOOD') score += 10;
            else score += 5;

            // Weight Bonus (15%)
            const weightScore = Math.min(15, (Number(goat.currentWeight) / 40) * 15);
            score += Math.round(weightScore);

            // Parse media URLs for images with robust fallback
            let imageUrl = goat.thumbnailUrl || null;

            if (goat.mediaUrls) {
                try {
                    const urls = JSON.parse(goat.mediaUrls);
                    if (Array.isArray(urls) && urls.length > 0) {
                        // Prefer the first image from mediaUrls
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
                isAlternative: showingAlternatives,
                healthStatus: goat.healthStatus,
                registrationCode: goat.registrationCode
            };
        });

        // 5. Sort: within budget first, then by match score
        return scoredGoats
            .sort((a, b) => {
                if (a.isWithinBudget && !b.isWithinBudget) return -1;
                if (!a.isWithinBudget && b.isWithinBudget) return 1;
                return b.match - a.match;
            })
            .slice(0, 6);

    } catch (error) {
        console.error('AI Search Error:', error);
        return [];
    }
}
