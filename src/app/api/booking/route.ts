/**
 * POST /api/booking
 * Create a new booking with Midtrans payment integration
 * TODO: Implement Rate Limiting (e.g. Upstash/Redis) to prevent abuse of this public endpoint.
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { midtrans } from "@/lib/midtrans"
import { z } from "zod"

// Validation schema
const createBookingSchema = z.object({
    courtId: z.string().min(1, "Court ID is required"),
    date: z.string().min(1, "Date is required"),
    slots: z.array(z.string()).min(1, "At least one time slot is required"),
    pricePerHour: z.number().positive("Price must be positive"),
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Valid email is required"),
    customerPhone: z.string().min(10, "Valid phone number is required"),
    paymentMethod: z.enum(["qris", "va"]).optional(),
    paymentBank: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json()

        // Validate input
        const validation = createBookingSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation error",
                    message: validation.error.errors[0].message,
                },
                { status: 400 }
            )
        }

        const { courtId, date, slots, pricePerHour, customerName, customerEmail, customerPhone } = validation.data

        // Rate Limiting: Check for pending bookings for the same customer in the last hour
        // This is a basic protection against spam/DoS attacks
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        const recentPendingBookings = await prisma.booking.count({
            where: {
                OR: [
                    { customerEmail: customerEmail },
                    { customerPhone: customerPhone },
                ],
                status: "PENDING",
                createdAt: { gt: oneHourAgo },
            },
        })

        if (recentPendingBookings >= 20) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Too Many Requests",
                    message: "You have too many pending bookings. Please complete your existing bookings or try again later.",
                },
                { status: 429 }
            )
        }

        // Verify court exists and is active
        const court = await prisma.court.findUnique({
            where: { id: courtId },
        })

        if (!court) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Not found",
                    message: "Court not found",
                },
                { status: 404 }
            )
        }

        if (!court.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unavailable",
                    message: "Court is not active",
                },
                { status: 400 }
            )
        }

        // Calculate start and end times
        const bookingDate = new Date(date)
        const sortedSlots = slots.sort()
        const firstSlot = sortedSlots[0]
        const lastSlot = sortedSlots[sortedSlots.length - 1]

        const [startHour, startMinute] = firstSlot.split(":").map(Number)
        const startTime = new Date(bookingDate)
        startTime.setHours(startHour, startMinute, 0, 0)

        const [endHour, endMinute] = lastSlot.split(":").map(Number)
        const endTime = new Date(bookingDate)
        endTime.setHours(endHour + 1, endMinute, 0, 0) // +1 hour for the last slot

        // Calculate total price
        const totalPrice = pricePerHour * slots.length
        const adminFee = 5000
        const finalAmount = totalPrice + adminFee

        // Auto-cleanup: Delete PENDING bookings older than 60 minutes to prevent stuck slots
        const cleanupThreshold = new Date(Date.now() - 60 * 60 * 1000)

        // First, find old PENDING bookings
        const oldPendingBookings = await prisma.booking.findMany({
            where: {
                status: "PENDING",
                createdAt: {
                    lt: cleanupThreshold,
                },
            },
            select: { id: true },
        })

        const oldBookingIds = oldPendingBookings.map((b) => b.id)

        if (oldBookingIds.length > 0) {
            // Delete associated payments first (foreign key constraint)
            await prisma.payment.deleteMany({
                where: {
                    bookingId: { in: oldBookingIds },
                },
            })

            // Then delete the bookings
            await prisma.booking.deleteMany({
                where: {
                    id: { in: oldBookingIds },
                },
            })
        }

        // Check for overlapping bookings
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                courtId,
                status: { in: ["PENDING", "CONFIRMED"] },
                OR: [
                    {
                        AND: [
                            { startTime: { lte: startTime } },
                            { endTime: { gt: startTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { lt: endTime } },
                            { endTime: { gte: endTime } },
                        ],
                    },
                    {
                        AND: [
                            { startTime: { gte: startTime } },
                            { endTime: { lte: endTime } },
                        ],
                    },
                ],
            },
        })

        if (overlappingBooking) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Conflict",
                    message: "Selected time slots are not available",
                },
                { status: 409 }
            )
        }

        // Create booking with PENDING status
        const booking = await prisma.booking.create({
            data: {
                courtId,
                startTime,
                endTime,
                totalPrice: finalAmount,
                status: "PENDING",
                customerName,
                customerEmail,
                customerPhone,
            },
        })

        // Create Midtrans transaction
        let midtransTransaction
        try {
            midtransTransaction = await midtrans.createTransaction({
                orderId: booking.id,
                amount: finalAmount,
                customerDetails: {
                    first_name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                },
                itemDetails: [
                    {
                        id: courtId,
                        name: `${court.name} - ${slots.length} jam`,
                        price: totalPrice,
                        quantity: 1,
                    },
                    {
                        id: "admin-fee",
                        name: "Biaya Admin",
                        price: adminFee,
                        quantity: 1,
                    },
                ],
            })
        } catch (error) {
            // Rollback: Delete the booking if Midtrans fails
            await prisma.booking.delete({
                where: { id: booking.id },
            })
            throw error // Re-throw to be handled by the outer catch block
        }

        // Create payment record
        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                amount: finalAmount,
                provider: "midtrans",
                externalId: booking.id, // Using booking ID as order ID
                snapToken: midtransTransaction.token,
                status: "PENDING",
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: {
                    bookingId: booking.id,
                    snapToken: midtransTransaction.token,
                    amount: finalAmount,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("[API] Create booking error:", error)

        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
                message: errorMessage,
            },
            { status: 500 }
        )
    }
}
