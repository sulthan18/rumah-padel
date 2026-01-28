import { BookingForm } from "@/components/booking/booking-form"
import { SITE_CONFIG } from "@/lib/constants"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Book Court",
    description: "Select your preferred court and time slot.",
}

export default function BookingPage() {
    return (
        <main className="container py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Book a Court</h1>
                <p className="text-muted-foreground">
                    Check availability and reserve your spot instantly.
                </p>
            </div>

            <BookingForm />
        </main>
    )
}
