import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting Client-Specific Seeding (Dorper & Garut)...')

    // 1. Clean up
    try {
        await prisma.ioTReading.deleteMany()
        await prisma.vaccination.deleteMany()
        await prisma.weightRecord.deleteMany()
        await prisma.goat.deleteMany()
        await prisma.pen.deleteMany()
    } catch (e) {
        console.log("Cleanup failed or empty DB, proceeding...")
    }

    // 2. Create Pens
    const penDorper = await prisma.pen.create({
        data: {
            name: 'Paddock A - Pure Dorper',
            capacity: 30,
            currentOccupancy: 15,
            penType: 'PREMIUM',
            iotSensorId: 'IOT-DORPER-01'
        }
    })

    const penGarut = await prisma.pen.create({
        data: {
            name: 'Arena B - Domba Garut',
            capacity: 40,
            currentOccupancy: 20,
            penType: 'STANDARD',
            iotSensorId: 'IOT-GARUT-01'
        }
    })

    // 3. Create Sheep (Dorper & Garut)
    const sheeps = [
        // DORPER (Premium Meat)
        {
            name: 'Dorper Prime Alpha',
            registrationCode: 'DRP-2024-001',
            breed: 'DORPER',
            gender: 'MALE',
            birthDate: new Date('2023-02-15'),
            currentWeight: 85.0, // Heavy meat breed
            healthStatus: 'EXCELLENT',
            basePrice: 15000000,
            dynamicPrice: 15500000,
            penId: penDorper.id,
            purposes: 'BREEDING,MEAT', // Fokus daging kualitas tinggi
            mediaUrls: '["/images/dorper-1.jpg"]',
            tags: '["SERTIFIKAT_HALAL", "BEBAS_PENYAKIT", "FULL_BLOOD"]',
            notes: "Kualitas Daging Grade A, Silsilah Full Blood Australia"
        },
        {
            name: 'Dorper Ewe Beta',
            registrationCode: 'DRP-2024-002',
            breed: 'DORPER',
            gender: 'FEMALE',
            birthDate: new Date('2023-04-10'),
            currentWeight: 65.0,
            healthStatus: 'GOOD',
            basePrice: 12000000,
            dynamicPrice: 12200000,
            penId: penDorper.id,
            purposes: 'BREEDING',
            tags: '["BEBAS_PENYAKIT", "INDUKAN_UNGGUL"]'
        },
        // GARUT (Show/Qurban/Aqiqah/Resto)
        {
            name: 'Raja Garut X1',
            registrationCode: 'GRT-2024-101',
            breed: 'GARUT',
            gender: 'MALE',
            birthDate: new Date('2022-08-20'),
            currentWeight: 70.0,
            healthStatus: 'EXCELLENT',
            basePrice: 25000000, // Premium for Show/Hobby
            dynamicPrice: 26500000,
            penId: penGarut.id,
            purposes: 'SHOW,QURBAN',
            tags: '["SERTIFIKAT_HALAL", "JAWARA_KONTES", "TANDUK_MEWAH"]',
            notes: "Pemenang Kontes Regional 2023"
        },
        {
            name: 'Garut Pedaging A',
            registrationCode: 'GRT-2024-105',
            breed: 'GARUT',
            gender: 'MALE',
            birthDate: new Date('2023-09-01'),
            currentWeight: 45.0,
            healthStatus: 'GOOD',
            basePrice: 4500000,
            dynamicPrice: 4800000,
            penId: penGarut.id,
            purposes: 'AQIQAH,MEAT', // Cocok untuk sate/gulai (Resto)
            tags: '["HALAL", "DAGING_PADAT"]'
        },
        {
            name: 'Garut Betina Super',
            registrationCode: 'GRT-2024-108',
            breed: 'GARUT',
            gender: 'FEMALE',
            birthDate: new Date('2023-01-01'),
            currentWeight: 35.0,
            healthStatus: 'GOOD',
            basePrice: 3500000,
            dynamicPrice: 3600000,
            penId: penGarut.id,
            purposes: 'BREEDING,AQIQAH',
            tags: '["SEHAT", "LINCAN"]'
        }
    ]

    for (const s of sheeps) {
        const sheep = await prisma.goat.create({ data: s })

        // Weight Growth Simulation (Dorper grows faster)
        const growthRate = s.breed === 'DORPER' ? 0.3 : 0.15; // kg per day approx

        await prisma.weightRecord.createMany({
            data: [
                { goatId: sheep.id, weight: Number(s.currentWeight) * 0.7, measuredAt: new Date('2024-01-01') },
                { goatId: sheep.id, weight: Number(s.currentWeight) * 0.85, measuredAt: new Date('2024-03-01') },
                { goatId: sheep.id, weight: Number(s.currentWeight) * 0.95, measuredAt: new Date('2024-05-01') },
                { goatId: sheep.id, weight: s.currentWeight, measuredAt: new Date() },
            ]
        })
    }

    // 4. Create IoT Readings
    const now = new Date()
    for (let i = 0; i < 24; i++) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        await prisma.ioTReading.create({
            data: {
                penId: penDorper.id,
                temperature: 24 + Math.random() * 3, // Cooler for sheep comfort
                humidity: 55 + Math.random() * 10,
                ammonia: 2 + Math.random() * 3, // Well ventilated
                recordedAt: time
            }
        })
    }

    console.log('✅ Client-Specific Seeding (Dorper/Garut) finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
