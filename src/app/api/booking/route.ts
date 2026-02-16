/**
 * POST /api/booking
 * Create a new booking with Midtrans payment integration
 * Includes Advanced Business Logic: Membership Tiers, Dynamic Pricing, Conflict Detection
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth" // Import getServerSession
import { authOptions } from "@/lib/auth" // Import authOptions
import { prisma } from "@/lib/prisma"
import { midtrans } from "@/lib/midtrans"
import { BookingEngine } from "@/lib/booking-engine"
import { z } from "zod"

// Validation schema
const createBookingSchema = z.object({
    courtId: z.string().min(1, "Court ID is required"),
    date: z.string().min(1, "Date is required"),
    slots: z.array(z.string()).min(1, "At least one time slot is required"),
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Valid email is required"),
    customerPhone: z.string().min(10, "Valid phone number is required"),
    promoCode: z.string().optional(),
    lookingForPlayers: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
    try {
        // 0. Authenticate User
        const session = await getServerSession(authOptions)
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", message: "You must be logged in to book" },
                { status: 401 }
            )
        }
        const userId = session.user.id // Get userId from session

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

        const { courtId, date, slots, customerName, customerEmail, customerPhone, promoCode, lookingForPlayers } = validation.data

        // 1. Fetch User (now mandatory) for Membership Check
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found", message: "Authenticated user not found in database" },
                { status: 404 }
            )
        }

        // 2. Validate Booking Rules (Windows, Limits)
        try {
            BookingEngine.validateBookingRules(user, new Date(date), slots)
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: "Rule Violation", message: error.message },
                { status: 403 }
            )
        }

        // 3. Verify court exists
        const court = await prisma.court.findUnique({
            where: { id: courtId },
        })

        if (!court || !court.isActive) {
            return NextResponse.json(
                { success: false, error: "Unavailable", message: "Court not active or found" },
                { status: 404 }
            )
        }

        // 4. Calculate Times
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

        // 5. Check Conflicts
        const conflict = await BookingEngine.checkConflicts(courtId, startTime, endTime)
        if (conflict) {
            return NextResponse.json(
                { success: false, error: "Conflict", message: "Time slots already booked" },
                { status: 409 }
            )
        }

        // 6. Calculate Price (Dynamic + Promo)
        let pricing
        try {
            pricing = await BookingEngine.calculatePrice(court, slots, user, promoCode)
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: "Pricing Error", message: error.message },
                { status: 400 }
            )
        }

        // 7. Create Booking
        const booking = await prisma.booking.create({
            data: {
                courtId,
                userId, // Now directly use the userId from session
                startTime,
                endTime,
                totalPrice: pricing.totalPrice,
                originalPrice: pricing.originalPrice,
                discountApplied: pricing.discount,
                promoCodeId: pricing.promoCodeId,
                status: "PENDING",
                customerName,
                customerEmail,
                customerPhone,
                lookingForPlayers: lookingForPlayers || false,
            },
        })

        // Update promo usage if applied
        if (pricing.promoCodeId) {
            await prisma.promoCode.update({
                where: { id: pricing.promoCodeId },
                data: { usedCount: { increment: 1 } }
            })
        }

        // 8. Midtrans Transaction
        let midtransTransaction
        try {
            midtransTransaction = await midtrans.createTransaction({
                orderId: booking.id,
                amount: pricing.totalPrice,
                customerDetails: {
                    first_name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                },
                itemDetails: [
                    {
                        id: courtId,
                        name: `${court.name} - ${slots.length} Hours`,
                        price: pricing.basePrice,
                        quantity: 1,
                    },
                    {
                        id: "admin-fee",
                        name: "Admin Fee",
                        price: pricing.adminFee,
                        quantity: 1,
                    },
                    ...(pricing.discount > 0 ? [{
                        id: "discount",
                        name: `Discount (${pricing.discountSource})`,
                        price: -pricing.discount,
                        quantity: 1
                    }] : [])
                ],
            })
        } catch (error) {
            await prisma.booking.delete({ where: { id: booking.id } })
            // Revert promo usage count if failed? ideally yes, simplistic here
            throw error
        }

        // 9. Create Payment Record
        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                amount: pricing.totalPrice,
                provider: "midtrans",
                externalId: booking.id,
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
                    amount: pricing.totalPrice,
                    breakdown: pricing
                },
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("[API] Create booking error:", error)
        const errorMessage = error instanceof Error ? error.message : "Internal server error"
        return NextResponse.json(
            { success: false, error: "Error", message: errorMessage },
            { status: 500 }
        )
    }
}

