/**
 * GET /api/bookings/user
 * Get current user's bookings
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserBookings } from "@/services/booking.service"
import { z } from "zod"
import { BookingStatus } from "@/types"

// Validation schema
const querySchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
})

export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                    message: "You must be logged in to view bookings",
                },
                { status: 401 }
            )
        }

        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get("status")

        // Validate input
        const validation = querySchema.safeParse({ status })

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

        const { status: filterStatus } = validation.data

        // Get user's bookings
        const bookings = await getUserBookings(
            session.user.id,
            filterStatus as BookingStatus | undefined
        )

        return NextResponse.json({
            success: true,
            data: bookings,
        })
    } catch (error) {
        console.error("[API] Get user bookings error:", error)
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
