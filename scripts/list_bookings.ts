import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Listing all bookings...')
    const bookings = await prisma.booking.findMany({
        include: {
            court: true
        }
    })

    if (bookings.length === 0) {
        console.log("No bookings found.")
    } else {
        bookings.forEach(b => {
            console.log(`[${b.status}] ID: ${b.id} | Court: ${b.court.name} | Start: ${b.startTime.toISOString()} | End: ${b.endTime.toISOString()} | Customer: ${b.customerName}`)
        })
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
