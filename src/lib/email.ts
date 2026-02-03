import { Resend } from "resend"
import { BookingConfirmationEmail } from "@/emails/booking-confirmation"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendBookingEmailProps {
    to: string
    subject: string
    bookingId: string
    customerName: string
    courtName: string
    date: string
    time: string
    price: string
    qrCodeUrl: string
}

export async function sendBookingEmail({
    to,
    subject,
    ...props
}: SendBookingEmailProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Email not sent.")
        return { success: false, error: "Missing API Key" }
    }

    try {
        const data = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "rumahpadel@resend.dev",
            to: [to],
            // to: ["delivered@resend.dev"], // FORCE TEST MODE for safety if needed
            subject: subject,
            react: BookingConfirmationEmail(props),
        })

        console.log("Email sent successfully:", data)
        return { success: true, data }
    } catch (error) {
        console.error("Failed to send email:", error)
        return { success: false, error }
    }
}
