import { BookingForm } from "@/components/booking/booking-form"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookingStepper } from "@/components/booking/booking-stepper"

export const metadata = {
    title: "Booking Lapangan Padel - Rumah Padel",
    description: "Booking lapangan padel online dengan mudah. Pilih tanggal, lapangan, dan jam main favoritmu.",
}

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Header */}
            <div className="bg-white border-b border-zinc-200 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/" className="flex items-center gap-2">
                                    <ChevronLeft className="h-4 w-4" />
                                    Kembali
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-xl md:text-2xl font-black tracking-tight">Booking Lapangan</h1>
                                <p className="text-sm text-muted-foreground hidden md:block">Pilih jadwal main kamu</p>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        {/* Progress Indicator */}
                        <BookingStepper currentStep={1} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <BookingForm />
            </div>
        </div>
    )
}
