/**
 * POST /api/payment/webhook
 * Handle Midtrans payment notifications
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { midtrans } from "@/lib/midtrans"
import { achievementEngine } from "@/lib/achievement-engine"
import { sendBookingEmail } from "@/lib/email" // Import sendBookingEmail
import { format } from "date-fns" // Import date-fns for formatting
import QRCode from "qrcode" // Import qrcode library

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

        // Get booking - include user and court details for email
        const booking = await prisma.booking.findUnique({
            where: { id: order_id },
            include: { payment: true, user: true, court: true }, // Include user and court
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

        // Award loyalty points and achievements if booking is confirmed and has a user
        if (bookingStatus === "CONFIRMED" && booking.userId && booking.user) {
            // Award loyalty points
            const pointsToAward = Math.floor(booking.totalPrice / 10000) * 10;
            if (pointsToAward > 0) {
                await prisma.loyaltyPoint.create({
                    data: {
                        userId: booking.userId,
                        points: pointsToAward,
                        reason: `Booking #${booking.id}`,
                    },
                });
                await prisma.user.update({
                    where: { id: booking.userId },
                    data: {
                        loyaltyPointsBalance: {
                            increment: pointsToAward,
                        },
                    },
                });
            }

            // Check for achievements
            await achievementEngine.checkAndAward(booking.userId, 'booking_confirmed');

            // Send confirmation email if booking confirmed
            try {
                const bookingConfirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/booking/confirmation/${booking.id}`;
                const qrCodeUrl = await QRCode.toDataURL(bookingConfirmationUrl);

                await sendBookingEmail({
                    to: booking.user.email,
                    subject: `Booking Confirmation for ${booking.court.name}`,
                    bookingId: booking.id,
                    customerName: booking.user.name || booking.customerName,
                    courtName: booking.court.name,
                    date: format(booking.startTime, "PPP"), // Formatted Date
                    time: `${format(booking.startTime, "p")} - ${format(booking.endTime, "p")}`, // Formatted Time Range
                    price: booking.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'IDR' }), // Assuming IDR currency
                    qrCodeUrl: qrCodeUrl,
                });
            } catch (emailError) {
                console.error("[Webhook] Failed to send confirmation email:", emailError);
            }
        }

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
