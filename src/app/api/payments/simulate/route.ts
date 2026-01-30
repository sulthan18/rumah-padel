/**
 * POST /api/payments/simulate
 * Simulate payment for a booking
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { simulatePayment } from "@/services/payment.service"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// Validation schema
const paymentSchema = z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
})

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                    message: "You must be logged in to make a payment",
                },
                { status: 401 }
            )
        }

        // Parse request body
        const body = await request.json()

        // Validate input
        const validation = paymentSchema.safeParse(body)

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

        const { bookingId } = validation.data

        // Verify booking belongs to user
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            select: { userId: true },
        })

        if (!booking) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Not found",
                    message: "Booking not found",
                },
                { status: 404 }
            )
        }

        if (booking.userId !== session.user.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Forbidden",
                    message: "You can only pay for your own bookings",
                },
                { status: 403 }
            )
        }

        // Simulate payment
        const payment = await simulatePayment(bookingId)

        return NextResponse.json(
            {
                success: true,
                data: payment,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("[API] Simulate payment error:", error)

        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        // Handle specific errors
        if (
            errorMessage.includes("not found") ||
            errorMessage.includes("already has a payment") ||
            errorMessage.includes("cancelled")
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Payment error",
                    message: errorMessage,
                },
                { status: 400 }
            )
        }

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
