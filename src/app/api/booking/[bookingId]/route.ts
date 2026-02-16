import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWaitlistNotificationEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ bookingId: string }> }
) {
    try {
        const params = await props.params
        const { bookingId } = params
        // Fetching booking details

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                court: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        pricePerHour: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        status: true, // Only select what we need to avoid large objects if any
                        amount: true,
                        provider: true,
                        paidAt: true,
                    },
                },
            },
        })

        if (!booking) {
            // Booking not found
            return NextResponse.json(
                {
                    success: false,
                    error: "Not found",
                    message: "Booking not found",
                },
                { status: 404 }
            )
        }

        // Format response
        const response = {
            id: booking.id,
            courtName: booking.court.name,
            date: booking.startTime.toISOString().split("T")[0],
            slots: generateTimeSlots(booking.startTime, booking.endTime),
            customerName: booking.customerName || "Guest",
            customerEmail: booking.customerEmail || "",
            total: booking.totalPrice,
            status: booking.status,
            payment: booking.payment,
            createdAt: booking.createdAt,
        }

        return NextResponse.json(
            {
                success: true,
                data: response,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("[API] Get booking error:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { bookingId: string } }
) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: params.bookingId },
            include: { court: true }
        });

        if (!booking) {
            return NextResponse.json({ message: "Booking not found" }, { status: 404 });
        }

        await prisma.booking.update({
            where: { id: params.bookingId },
            data: { status: 'CANCELLED' },
        });

        const waitlistEntries = await prisma.waitlistEntry.findMany({
            where: {
                courtId: booking.courtId,
                startTime: booking.startTime,
            },
            include: {
                user: true,
            },
        });

        for (const entry of waitlistEntries) {
            await sendWaitlistNotificationEmail({
                to: entry.user.email,
                customerName: entry.user.name || 'Player',
                courtName: booking.court.name,
                date: booking.startTime.toLocaleDateString(),
                time: booking.startTime.toLocaleTimeString(),
            });
        }
        
        await prisma.waitlistEntry.deleteMany({
            where: {
                courtId: booking.courtId,
                startTime: booking.startTime,
            }
        })

        return NextResponse.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// Helper function to generate time slots from start and end time
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
