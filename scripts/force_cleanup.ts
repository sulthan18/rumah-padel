import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
    console.log('Current bookings in database:')
    const allBookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            court: true,
        },
    })

    console.log(`Total bookings: ${allBookings.length}`)
    allBookings.forEach((booking) => {
        console.log({
            id: booking.id,
            court: booking.court.name,
            startTime: booking.startTime,
            status: booking.status,
            createdAt: booking.createdAt,
        })
    })


    console.log('\nDeleting all PENDING bookings and related payments...')

    // First, get all PENDING booking IDs
    const pendingBookings = await prisma.booking.findMany({
        where: { status: 'PENDING' },
        select: { id: true },
    })

    const pendingIds = pendingBookings.map((b) => b.id)

    // Delete payments first (foreign key constraint)
    const deletedPayments = await prisma.payment.deleteMany({
        where: {
            bookingId: { in: pendingIds },
        },
    })
    console.log(`Deleted ${deletedPayments.count} Payment records`)

    // Then delete bookings
    const deleted = await prisma.booking.deleteMany({
        where: {
            status: 'PENDING',
        },
    })
    console.log(`Deleted ${deleted.count} PENDING bookings`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
