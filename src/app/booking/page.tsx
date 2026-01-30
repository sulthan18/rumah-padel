import { BookingForm } from "@/components/booking/booking-form"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                                <span className="font-medium">Pilih Jadwal</span>
                            </div>
                            <div className="w-8 h-0.5 bg-zinc-200" />
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="bg-zinc-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                                <span>Pembayaran</span>
                            </div>
                            <div className="w-8 h-0.5 bg-zinc-200" />
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="bg-zinc-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                                <span>Selesai</span>
                            </div>
                        </div>
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
