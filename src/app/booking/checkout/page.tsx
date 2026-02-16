"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, Loader2, Calendar, Clock, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { BookingStepper } from "@/components/booking/booking-stepper"

interface BookingData {
    courtId: string
    courtName: string
    date: string
    slots: string[]
    pricePerHour: number
    lookingForPlayers: boolean
    isRecurring: boolean
    recurringRule: 'weekly' | 'bi-weekly'
    recurringEndDate?: string
}

declare global {
    interface Window {
        snap: any
    }
}

export default function CheckoutPage() {
    const router = useRouter()
    const { data: session } = useSession()
    const [bookingData, setBookingData] = useState<BookingData | null>(null)
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [snapLoaded, setSnapLoaded] = useState(false)

    // Customer details
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    useEffect(() => {
        // Pre-fill user data if available
        if (session?.user) {
            setName(session.user.name || "")
            setEmail(session.user.email || "")
        }
    }, [session])

    useEffect(() => {
        // Get booking data from sessionStorage
        const data = sessionStorage.getItem("pendingBooking")
        if (!data) {
            router.push("/booking")
            return
        }
        setBookingData(JSON.parse(data))
    }, [router])

    if (!bookingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const subtotal = bookingData.pricePerHour * bookingData.slots.length
    const adminFee = 5000
    const total = subtotal + adminFee

    const handleSubmit = async () => {
        if (!name) {
            alert("Mohon isi Nama Lengkap")
            return
        }
        if (!email) {
            alert("Mohon isi Email")
            return
        }
        if (!phone) {
            alert("Mohon isi No. WhatsApp")
            return
        }
        if (!agreedToTerms) {
            alert("Mohon setujui Syarat & Ketentuan")
            return
        }

        if (!snapLoaded) {
            alert("Sistem pembayaran sedang memuat, mohon tunggu sebentar...")
            return
        }

        setIsProcessing(true)

        try {
            const endpoint = bookingData.isRecurring ? "/api/recurring-bookings" : "/api/booking";
            // Call backend to create booking and get snap token
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...bookingData,
                    customerName: name,
                    customerEmail: email,
                    customerPhone: phone,
                    userId: session?.user.id,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Booking failed")
            }

            const { bookingId, snapToken } = result.bookingId ? result : { bookingId: result.data.bookingId, snapToken: result.data.snapToken };


            // Open Midtrans Snap popup
            window.snap.pay(snapToken, {
                onSuccess: (result: any) => {
                    sessionStorage.removeItem("pendingBooking")
                    router.push(`/booking/confirmation/${bookingId}`)
                },
                onPending: (result: any) => {
                    sessionStorage.removeItem("pendingBooking")
                    router.push(`/booking/confirmation/${bookingId}`)
                },
                onError: function (result: any) {
                    console.error("Payment error:", result)
                    alert("Pembayaran gagal. Silakan coba lagi.")
                    setIsProcessing(false)
                },
                onClose: () => {
                    setIsProcessing(false)
                },
            })
        } catch (error) {
            console.error("Booking error:", error)
            alert(error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.")
            setIsProcessing(false)
        }
    }

    return (
        <>
            {/* Load Midtrans Snap script */}
            <Script
                src={
                    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
                        ? "https://app.midtrans.com/snap/snap.js"
                        : "https://app.sandbox.midtrans.com/snap/snap.js"
                }
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                onLoad={() => setSnapLoaded(true)}
                strategy="lazyOnload"
            />

            <div className="min-h-screen bg-zinc-50">
                {/* Header */}
                <div className="bg-white border-b border-zinc-200 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/booking" className="flex items-center gap-2">
                                        <ChevronLeft className="h-4 w-4" />
                                        Kembali
                                    </Link>
                                </Button>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-black tracking-tight">Checkout</h1>
                                    <p className="text-sm text-muted-foreground hidden md:block">Review dan bayar booking kamu</p>
                                </div>
                            </div>

                            {/* Progress Indicator */}
                            <BookingStepper currentStep={2} />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Customer Details */}
                        <div className="lg:col-span-7 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Pemesan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">No. WhatsApp</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="08123456789"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Metode Pembayaran
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-white rounded-md shadow-sm">
                                                <CreditCard className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-blue-900">Midtrans Payment Gateway</p>
                                                <p className="text-xs text-blue-700">Aman & Terpercaya</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-blue-800 mb-3">
                                            Support berbagai metode pembayaran:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {["QRIS", "GoPay", "ShopeePay", "BCA", "Mandiri", "BNI", "BRI", "Kartu Kredit"].map((method) => (
                                                <Badge key={method} variant="secondary" className="bg-white/60 hover:bg-white text-blue-800 border-blue-100">
                                                    {method}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Terms */}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                />
                                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                                    Saya setuju dengan{" "}
                                    <Link href="/terms" className="text-primary underline">
                                        Syarat & Ketentuan
                                    </Link>{" "}
                                    dan{" "}
                                    <Link href="/privacy" className="text-primary underline">
                                        Kebijakan Privasi
                                    </Link>
                                </Label>
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-14 text-lg font-bold"
                                onClick={handleSubmit}
                                disabled={isProcessing || !agreedToTerms || !snapLoaded}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Bayar ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(total)}`
                                )}
                            </Button>
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:col-span-5">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Ringkasan Booking</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <div className="font-semibold">{bookingData.courtName}</div>
                                                <div className="text-sm text-muted-foreground">Rumah Padel Jakarta</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <div className="font-semibold">
                                                    {new Date(bookingData.date).toLocaleDateString("id-ID", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <div className="font-semibold">{bookingData.slots.length} Jam</div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {bookingData.slots.map((slot) => (
                                                        <Badge key={slot} variant="secondary" className="text-xs">
                                                            {slot}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal ({bookingData.slots.length} jam)</span>
                                            <span className="font-medium">
                                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Biaya Admin</span>
                                            <span className="font-medium">
                                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(adminFee)}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(total)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
