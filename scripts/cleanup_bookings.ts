import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Cleaning up stuck PENDING bookings...')

    const result = await prisma.booking.deleteMany({
        where: {
            status: 'PENDING',
        },
    })

    console.log(`Deleted ${result.count} stuck bookings.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
