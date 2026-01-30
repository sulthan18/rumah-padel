/**
 * GET /api/bookings/available
 * Check available time slots for a court on a specific date
 */

import { NextRequest, NextResponse } from "next/server"
import { getAvailableSlots } from "@/services/booking.service"
import { z } from "zod"

// Validation schema
const querySchema = z.object({
    courtId: z.string().min(1, "Court ID is required"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
})

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const courtId = searchParams.get("courtId")
        const dateStr = searchParams.get("date")

        // Validate input
        const validation = querySchema.safeParse({ courtId, date: dateStr })

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

        const { courtId: validCourtId, date: validDate } = validation.data

        // Parse date
        const requestedDate = new Date(validDate)

        // Check if date is valid
        if (isNaN(requestedDate.getTime())) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid date",
                    message: "Please provide a valid date",
                },
                { status: 400 }
            )
        }

        // Get available slots
        const slots = await getAvailableSlots(validCourtId, requestedDate)

        return NextResponse.json({
            success: true,
            data: {
                courtId: validCourtId,
                date: validDate,
                slots,
            },
        })
    } catch (error) {
        console.error("[API] Get available slots error:", error)
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
