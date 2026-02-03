import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const courts = await prisma.court.findMany()
    console.log('Courts in database:')
    courts.forEach(c => {
        console.log(`${c.id}: ${c.name} (${c.type}) - Active: ${c.isActive} - Price: ${c.pricePerHour}`)
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
