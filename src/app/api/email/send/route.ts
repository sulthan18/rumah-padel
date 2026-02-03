import { NextRequest, NextResponse } from "next/server"
import { sendBookingEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const { bookingId } = await request.json()

        if (!bookingId) {
            return NextResponse.json({ success: false, error: "Booking ID required" }, { status: 400 })
        }

        // Fetch booking details
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { court: true, payment: true }
        })

        if (!booking) {
            return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 })
        }

        // Send Email
        const result = await sendBookingEmail({
            to: booking.customerEmail || "",
            subject: `Tiket Booking Masuk - ${booking.id}`,
            bookingId: booking.id,
            customerName: booking.customerName || "Guest",
            courtName: booking.court.name,
            date: booking.startTime.toISOString().split("T")[0],
            time: `${booking.startTime.getHours()}:00 - ${booking.endTime.getHours()}:00`,
            price: `Rp ${booking.totalPrice.toLocaleString("id-ID")}`,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.id}`, // Fallback/Simple QR
        })

        if (!result.success) {
            console.error("Email API Error:", result.error)
            return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Email API Exception:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
