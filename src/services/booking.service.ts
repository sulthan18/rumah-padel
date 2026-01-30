/**
 * Booking Service
 * Business logic for booking operations
 */

import { prisma } from "@/lib/prisma"
import { BUSINESS_HOURS, PRICING } from "@/lib/constants"
import { calculateDuration, isTimeSlotOverlapping } from "@/lib/utils"
import { BookingStatus } from "@/types"

/**
 * Get available time slots for a specific court and date
 */
export async function getAvailableSlots(courtId: string, date: Date) {
    // Get start and end of the day
    const startOfDay = new Date(date)
    startOfDay.setHours(BUSINESS_HOURS.openTime, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(BUSINESS_HOURS.closeTime, 0, 0, 0)

    // Get all bookings for this court on this date
    const bookings = await prisma.booking.findMany({
        where: {
            courtId,
            startTime: {
                gte: startOfDay,
                lt: endOfDay,
            },
            status: {
                in: ["PENDING", "CONFIRMED"],
            },
        },
        select: {
            id: true,
            startTime: true,
            endTime: true,
        },
    })

    // Generate all time slots
    const slots = []
    for (let hour = BUSINESS_HOURS.openTime; hour < BUSINESS_HOURS.closeTime; hour++) {
        const slotTime = new Date(date)
        slotTime.setHours(hour, 0, 0, 0)

        const slotEndTime = new Date(slotTime)
        slotEndTime.setHours(hour + 1, 0, 0, 0)

        // Check if this slot overlaps with any booking
        const isBooked = bookings.some((booking) =>
            isTimeSlotOverlapping(
                slotTime,
                slotEndTime,
                new Date(booking.startTime),
                new Date(booking.endTime)
            )
        )

        const bookingId = isBooked
            ? bookings.find((b) =>
                isTimeSlotOverlapping(
                    slotTime,
                    slotEndTime,
                    new Date(b.startTime),
                    new Date(b.endTime)
                )
            )?.id
            : undefined

        slots.push({
            time: `${hour.toString().padStart(2, "0")}:00`,
            available: !isBooked,
            ...(bookingId && { bookingId }),
        })
    }

    return slots
}

/**
 * Calculate booking price based on court and duration
 */
export async function calculateBookingPrice(
    courtId: string,
    startTime: Date,
    endTime: Date
): Promise<number> {
    const court = await prisma.court.findUnique({
        where: { id: courtId },
        select: { pricePerHour: true },
    })

    if (!court) {
        throw new Error("Court not found")
    }

    const durationHours = calculateDuration(startTime, endTime)
    return court.pricePerHour * durationHours
}

/**
 * Validate booking input
 */
export function validateBookingInput(startTime: Date, endTime: Date) {
    const now = new Date()

    // Check if booking is in the past
    if (startTime < now) {
        return { valid: false, error: "Cannot book in the past" }
    }

    // Check if start is before end
    if (startTime >= endTime) {
        return { valid: false, error: "End time must be after start time" }
    }

    // Check duration
    const duration = calculateDuration(startTime, endTime)
    if (duration < PRICING.minimumBooking) {
        return {
            valid: false,
            error: `Minimum booking duration is ${PRICING.minimumBooking} hour(s)`,
        }
    }
    if (duration > PRICING.maximumBooking) {
        return {
            valid: false,
            error: `Maximum booking duration is ${PRICING.maximumBooking} hour(s)`,
        }
    }

    // Check if within business hours
    const startHour = startTime.getHours()
    const endHour = endTime.getHours()

    if (
        startHour < BUSINESS_HOURS.openTime ||
        endHour > BUSINESS_HOURS.closeTime
    ) {
        return {
            valid: false,
            error: `Booking must be within business hours (${BUSINESS_HOURS.openTime}:00 - ${BUSINESS_HOURS.closeTime}:00)`,
        }
    }

    return { valid: true }
}

/**
 * Check if a time slot is available (no overlapping bookings)
 */
export async function checkSlotAvailability(
    courtId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
): Promise<boolean> {
    const overlappingBookings = await prisma.booking.findMany({
        where: {
            courtId,
            status: {
                in: ["PENDING", "CONFIRMED"],
            },
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
            ...(excludeBookingId && {
                id: { not: excludeBookingId },
            }),
        },
    })

    return overlappingBookings.length === 0
}

/**
 * Create a new booking
 */
export async function createBooking(
    userId: string,
    courtId: string,
    startTime: Date,
    endTime: Date
) {
    // Validate input
    const validation = validateBookingInput(startTime, endTime)
    if (!validation.valid) {
        throw new Error(validation.error)
    }

    // Check if court exists
    const court = await prisma.court.findUnique({
        where: { id: courtId },
    })
    if (!court) {
        throw new Error("Court not found")
    }

    if (!court.isActive) {
        throw new Error("Court is not active")
    }

    // Check availability
    const isAvailable = await checkSlotAvailability(courtId, startTime, endTime)
    if (!isAvailable) {
        throw new Error("Time slot is not available")
    }

    // Calculate price
    const totalPrice = await calculateBookingPrice(courtId, startTime, endTime)

    // Create booking
    const booking = await prisma.booking.create({
        data: {
            userId,
            courtId,
            startTime,
            endTime,
            totalPrice,
            status: "PENDING",
        },
        include: {
            court: {
                select: {
                    id: true,
                    name: true,
                    pricePerHour: true,
                },
            },
        },
    })

    return booking
}

/**
 * Get user's bookings
 */
export async function getUserBookings(
    userId: string,
    status?: BookingStatus
) {
    const bookings = await prisma.booking.findMany({
        where: {
            userId,
            ...(status && { status }),
        },
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
                    status: true,
                    provider: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return bookings
}
