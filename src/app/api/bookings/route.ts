/**
 * POST /api/bookings
 * Create a new booking
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createBooking } from "@/services/booking.service"
import { z } from "zod"

// Validation schema
const createBookingSchema = z.object({
    courtId: z.string().min(1, "Court ID is required"),
    startTime: z.string().datetime("Invalid start time format"),
    endTime: z.string().datetime("Invalid end time format"),
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
                    message: "You must be logged in to create a booking",
                },
                { status: 401 }
            )
        }

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

        const { courtId, startTime, endTime } = validation.data

        // Parse dates
        const startDate = new Date(startTime)
        const endDate = new Date(endTime)

        // Create booking
        const booking = await createBooking(
            session.user.id,
            courtId,
            startDate,
            endDate
        )

        return NextResponse.json(
            {
                success: true,
                data: booking,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("[API] Create booking error:", error)

        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        // Handle specific errors
        if (
            errorMessage.includes("not available") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("not active")
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Booking error",
                    message: errorMessage,
                },
                { status: 409 }
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
