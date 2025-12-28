import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    await prisma.user.upsert({
        where: { email: 'admin@zadhifa.farm' },
        update: {},
        create: {
            email: 'admin@zadhifa.farm',
            name: 'Admin Zadhifa',
            password: 'admin123',
            phone: '087722076763',
        },
    });

    // Seed initial goat data
    const goats = [];

    // 3 Dorper Jantan
    for (let i = 1; i <= 3; i++) {
        goats.push({
            registrationCode: `ZF-2024-D${String(i).padStart(3, '0')}`,
            name: `Dorper Jantan #${i}`,
            breed: 'Dorper',
            gender: 'MALE',
            birthDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            currentWeight: 35 + Math.random() * 15,
            basePrice: 4500000 + Math.floor(Math.random() * 1000000),
            dynamicPrice: 4500000 + Math.floor(Math.random() * 1000000),
            healthStatus: 'HEALTHY',
            isAvailable: true,
            purposes: 'QURBAN,BREEDING',
            qualityGrade: 'PREMIUM',
            notes: `Dorper Jantan Premium #${i}`,
            tags: JSON.stringify(['Dorper', 'Jantan', 'Premium']),
            mediaUrls: JSON.stringify([]),
        });
    }

    // 2 Dorper Betina
    for (let i = 1; i <= 2; i++) {
        goats.push({
            registrationCode: `ZF-2024-DF${String(i).padStart(3, '0')}`,
            name: `Dorper Betina #${i}`,
            breed: 'Dorper',
            gender: 'FEMALE',
            birthDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            currentWeight: 30 + Math.random() * 10,
            basePrice: 4000000 + Math.floor(Math.random() * 500000),
            dynamicPrice: 4000000 + Math.floor(Math.random() * 500000),
            healthStatus: 'HEALTHY',
            isAvailable: true,
            purposes: 'AQIQAH,BREEDING',
            qualityGrade: 'PREMIUM',
            notes: `Dorper Betina Premium #${i}`,
            tags: JSON.stringify(['Dorper', 'Betina', 'Premium']),
            mediaUrls: JSON.stringify([]),
        });
    }

    // 110 Garut Betina (Induk)
    for (let i = 1; i <= 110; i++) {
        goats.push({
            registrationCode: `ZF-2024-G${String(i).padStart(3, '0')}`,
            name: `Garut Induk #${i}`,
            breed: 'Garut',
            gender: 'FEMALE',
            birthDate: new Date(2022 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            currentWeight: 25 + Math.random() * 15,
            basePrice: 2500000 + Math.floor(Math.random() * 1000000),
            dynamicPrice: 2500000 + Math.floor(Math.random() * 1000000),
            healthStatus: 'HEALTHY',
            isAvailable: i <= 20, // Only first 20 are available for sale
            purposes: 'BREEDING',
            qualityGrade: 'STANDARD',
            notes: `Garut Betina Induk #${i}`,
            tags: JSON.stringify(['Garut', 'Betina', 'Induk']),
            mediaUrls: JSON.stringify([]),
        });
    }

    // Insert all goats
    for (const goat of goats) {
        await prisma.goat.upsert({
            where: { registrationCode: goat.registrationCode },
            update: goat,
            create: goat,
        });
    }

    console.log(`✅ Seeded ${goats.length} goats (3 Dorper Jantan, 2 Dorper Betina, 110 Garut Betina)`);
    console.log('✅ Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
