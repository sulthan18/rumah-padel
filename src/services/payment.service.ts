/**
 * Payment Service
 * Business logic for payment operations
 */

import { prisma } from "@/lib/prisma"
import { PAYMENT_PROVIDERS, PAYMENT_STATUS } from "@/lib/constants"

/**
 * Simulate a payment for a booking
 */
export async function simulatePayment(bookingId: string) {
    // Check if booking exists
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            payment: true,
        },
    })

    if (!booking) {
        throw new Error("Booking not found")
    }

    // Check if already paid
    if (booking.payment) {
        throw new Error("Booking already has a payment")
    }

    // Check if booking is cancelled
    if (booking.status === "CANCELLED") {
        throw new Error("Cannot pay for cancelled booking")
    }

    // Create payment record
    const payment = await prisma.payment.create({
        data: {
            bookingId,
            amount: booking.totalPrice,
            provider: PAYMENT_PROVIDERS.SIMULATION,
            status: PAYMENT_STATUS.SUCCESS,
            externalId: `SIM-${Date.now()}`, // Simulated transaction ID
        },
    })

    // Update booking status to CONFIRMED
    await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: "CONFIRMED",
        },
    })

    return payment
}

/**
 * Get payment by booking ID
 */
export async function getPaymentByBookingId(bookingId: string) {
    const payment = await prisma.payment.findUnique({
        where: { bookingId },
        include: {
            booking: {
                select: {
                    id: true,
                    courtId: true,
                    startTime: true,
                    endTime: true,
                    totalPrice: true,
                    status: true,
                },
            },
        },
    })

    return payment
}

/**
 * Cancel payment and revert booking status
 */
export async function cancelPayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { booking: true },
    })

    if (!payment) {
        throw new Error("Payment not found")
    }

    if (payment.status === PAYMENT_STATUS.FAILED) {
        throw new Error("Payment already failed")
    }

    // Update payment status
    await prisma.payment.update({
        where: { id: paymentId },
        data: {
            status: PAYMENT_STATUS.FAILED,
        },
    })

    // Update booking status back to PENDING
    await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
            status: "PENDING",
        },
    })

    return payment
}
