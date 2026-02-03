import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const bookingId = "cml67hneu000l100q07ufb4hh"
    console.log(`Checking booking: ${bookingId}`)

    // 1. Check if booking exists
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            court: true,
            payment: true
        }
    })

    if (!booking) {
        console.error("❌ Booking NOT FOUND in database!")
        return
    }

    console.log("✅ Booking FOUND:")
    console.log(JSON.stringify(booking, null, 2))

    // 2. Simulate logic from API route
    try {
        const slots = generateTimeSlots(booking.startTime, booking.endTime)
        console.log("✅ Time slots generation success:", slots)
    } catch (e) {
        console.error("❌ Time slots generation FAILED:", e)
    }
}

// Helper from API
function generateTimeSlots(startTime: Date, endTime: Date): string[] {
    const slots: string[] = []
    const current = new Date(startTime)

    while (current < endTime) {
        const hours = current.getHours().toString().padStart(2, "0")
        const minutes = current.getMinutes().toString().padStart(2, "0")
        slots.push(`${hours}:${minutes}`)
        current.setHours(current.getHours() + 1)
    }

    return slots
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
