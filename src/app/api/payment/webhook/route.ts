/**
 * POST /api/payment/webhook
 * Handle Midtrans payment notifications
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { midtrans } from "@/lib/midtrans"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            order_id,
            transaction_status,
            fraud_status,
            status_code,
            gross_amount,
            signature_key,
        } = body

        // Verify signature
        const isValid = midtrans.verifySignature(
            order_id,
            status_code,
            gross_amount,
            signature_key
        )

        if (!isValid) {
            console.error("[Webhook] Invalid signature")
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid signature",
                },
                { status: 401 }
            )
        }

        // Get booking
        const booking = await prisma.booking.findUnique({
            where: { id: order_id },
            include: { payment: true },
        })

        if (!booking) {
            console.error("[Webhook] Booking not found:", order_id)
            return NextResponse.json(
                {
                    success: false,
                    error: "Booking not found",
                },
                { status: 404 }
            )
        }

        // Map transaction status to payment status
        const paymentStatus = midtrans.mapTransactionStatus(transaction_status)

        // Determine booking status based on payment
        let bookingStatus = booking.status
        if (paymentStatus === "SUCCESS" && fraud_status === "accept") {
            bookingStatus = "CONFIRMED"
        } else if (paymentStatus === "FAILED") {
            bookingStatus = "CANCELLED"
        }

        // Update payment
        if (booking.payment) {
            await prisma.payment.update({
                where: { id: booking.payment.id },
                data: {
                    status: paymentStatus,
                    paidAt: paymentStatus === "SUCCESS" ? new Date() : null,
                },
            })
        }

        // Update booking status
        if (bookingStatus !== booking.status) {
            await prisma.booking.update({
                where: { id: order_id },
                data: { status: bookingStatus },
            })
        }

        // TODO: Send confirmation email if booking confirmed
        // if (bookingStatus === "CONFIRMED") {
        //     await sendConfirmationEmail(booking)
        // }

        return NextResponse.json(
            {
                success: true,
                message: "Notification processed",
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("[Webhook] Error processing notification:", error)

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
