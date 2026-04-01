import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const courts = [
        {
            id: "court-1",
            name: "Court 1",
            description: "Indoor Premium with Glass Walls",
            pricePerHour: 150000,
            isActive: true,
        },
        {
            id: "court-2",
            name: "Court 2",
            description: "Indoor Premium with LED",
            pricePerHour: 150000,
            isActive: true,
        },
        {
            id: "court-3",
            name: "Court 3",
            description: "Outdoor Standard",
            pricePerHour: 120000,
            isActive: true,
        }
    ]

    console.log('Seeding database...')

    // Create a dummy court provider to associate with courts
    const provider = await prisma.courtProvider.upsert({
        where: { id: "provider-1" },
        update: { name: "Rumah Padel Provider" },
        create: { id: "provider-1", name: "Rumah Padel Provider" },
    })

    for (const court of courts) {
        const result = await prisma.court.upsert({
            where: { id: court.id },
            update: { ...court, courtProviderId: provider.id },
            create: { ...court, courtProviderId: provider.id },
        })
        console.log(`Upserted court: ${result.name} (${result.id})`)
    }

    console.log('Seed data inserted successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
