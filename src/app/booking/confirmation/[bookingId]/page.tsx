"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Calendar, Clock, MapPin, Download, Share2, Home, Receipt, RefreshCcw } from "lucide-react"
import { BookingStepper } from "@/components/booking/booking-stepper"
import Link from "next/link"
import QRCode from "qrcode"
import Image from "next/image"
import { cn } from "@/lib/utils"
// import html2canvas from 'html2canvas'; // Enable this if we want image export feature

interface BookingDetails {
    id: string
    courtName: string
    date: string
    slots: string[]
    customerName: string
    customerEmail: string
    total: number
    status: string
    payment?: {
        id: string
        amount: number
        status: string
        provider: string
        paidAt: string | null
    }
}

export default function ConfirmationPage() {
    const params = useParams()
    const router = useRouter()
    const bookingId = params?.bookingId as string
    const [booking, setBooking] = useState<BookingDetails | null>(null)
    const [qrCodeUrl, setQrCodeUrl] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const receiptRef = useRef<HTMLDivElement>(null)

    const fetchBooking = async () => {
        if (!bookingId) return
        setIsLoading(true)
        try {
            const response = await fetch(`/api/booking/${bookingId}`)
            if (response.ok) {
                const result = await response.json()
                const data = result.data
                setBooking(data)
                setError(false)

                // Generate QR code
                const qr = await QRCode.toDataURL(`BOOKING-${bookingId}`, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF",
                    },
                })
                setQrCodeUrl(qr)

                // Trigger Email Sending (Idempotency check via localStorage)
                const emailSentKey = `email_sent_${bookingId}`
                if (!localStorage.getItem(emailSentKey)) {
                    console.log("Triggering email confirmation...")
                    fetch("/api/email/send", {
                        method: "POST",
                        body: JSON.stringify({ bookingId }),
                        headers: { "Content-Type": "application/json" }
                    }).then(res => {
                        if (res.ok) {
                            console.log("Email confirmation sent!")
                            localStorage.setItem(emailSentKey, "true")
                        }
                    })
                }
            } else {
                console.error(`Failed to fetch booking. Status: ${response.status} ${response.statusText}`)
                setError(true)
            }
        } catch (error) {
            console.error("Failed to fetch booking:", error)
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (bookingId) {
            fetchBooking()

            // Poll for payment status
            const interval = setInterval(async () => {
                if (booking?.payment?.status === "PENDING") {
                    // Silent refetch
                    const response = await fetch(`/api/booking/${bookingId}`)
                    if (response.ok) {
                        const result = await response.json()
                        setBooking(result.data)
                    }
                } else if (booking?.payment?.status && booking.payment.status !== "PENDING") {
                    clearInterval(interval)
                }
            }, 5000)

            return () => clearInterval(interval)
        }
    }, [bookingId, booking?.payment?.status])

    const handleDownloadQR = () => {
        const link = document.createElement("a")
        link.href = qrCodeUrl
        link.download = `booking-${bookingId}.png`
        link.click()
    }

    const handleShare = () => {
        const text = `Booking Padel - ${booking?.courtName}\nTanggal: ${booking?.date}\nKode: ${bookingId}`
        if (navigator.share) {
            navigator.share({ title: "Booking Padel", text })
        } else {
            navigator.clipboard.writeText(text)
            alert("Link booking disalin!")
        }
    }

    // Loading State
    if (isLoading && !booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground animate-pulse">Memuat detail transaksi...</p>
            </div>
        )
    }

    // Error State (Robust Fallback)
    if (error && !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
                <Card className="max-w-md w-full shadow-lg border-2 border-dashed border-red-200">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <Receipt className="h-8 w-8 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900">Pembayaran Berhasil?</h2>
                            <p className="text-muted-foreground mt-2">
                                Kami belum dapat mengambil detail booking kamu saat ini. Jangan khawatir, jika pembayaran sudah berhasil, tiket akan dikirim ke email kamu.
                            </p>
                        </div>
                        <div className="bg-zinc-100 p-4 rounded-lg text-left text-sm font-mono break-all">
                            ID: {bookingId}
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button onClick={() => fetchBooking()} className="w-full">
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Cek Status Lagi
                            </Button>
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/booking">Kembali ke Booking</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!booking) return null // Should not happen

    return (
        <div className="min-h-screen bg-zinc-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Stepper */}
                    <div className="flex justify-center pb-6">
                        <BookingStepper
                            currentStep={3}
                            isPaymentSuccess={true}
                            isCurrentStepChecked={true}
                        />
                    </div>

                    {/* Header Banner */}
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full shadow-lg shadow-green-200 ring-4 ring-white">
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">
                                Transaksi Berhasil!
                            </h1>
                            <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
                                Terima kasih {booking.customerName}, lapangan sudah diamankan untuk kamu.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

                        {/* Ticket Card (Main) */}
                        <div className="md:col-span-2 space-y-6">
                            <div ref={receiptRef} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-100 relative">
                                {/* Ticket Decoration */}
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                                <CardHeader className="text-center pb-2 pt-8">
                                    <h2 className="text-2xl font-bold tracking-tight">RUMAH PADEL</h2>
                                    <p className="text-sm text-muted-foreground tracking-widest uppercase">E-Ticket / Bukti Booking</p>
                                </CardHeader>

                                <CardContent className="p-8 space-y-8">
                                    {/* Valid Date */}
                                    <div className="bg-zinc-50 rounded-2xl p-6 flex items-center justify-between border border-zinc-100">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                                <Calendar className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Tanggal Main</p>
                                                <p className="font-bold text-lg text-zinc-900">
                                                    {new Date(booking.date).toLocaleDateString("id-ID", {
                                                        weekday: "long",
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> Waktu
                                            </p>
                                            <div className="font-semibold text-lg">
                                                {booking.slots.map(slot => (
                                                    <div key={slot}>{slot}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-xs text-muted-foreground uppercase font-bold inline-flex items-center gap-1">
                                                Lapangan <MapPin className="h-3 w-3" />
                                            </p>
                                            <div className="font-semibold text-lg text-primary">{booking.courtName}</div>
                                            <div className="text-xs text-muted-foreground">Premium Indoor</div>
                                        </div>
                                    </div>

                                    <Separator className="my-6 border-dashed" />

                                    {/* Transaction Details */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-sm uppercase text-muted-foreground">Detail Pembayaran</h3>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Status</span>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                LUNAS / CONFIRMED
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Booking ID</span>
                                            <span className="font-mono text-xs">{bookingId}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Metode</span>
                                            <span className="font-medium uppercase">{booking.payment?.provider || "Midtrans"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg font-bold border-t pt-4 mt-4">
                                            <span>Total</span>
                                            <span>
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                    minimumFractionDigits: 0,
                                                }).format(booking.total)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>

                                {/* Ticket Footer */}
                                <div className="bg-zinc-50 p-6 text-center border-t border-dashed relative">
                                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-zinc-50 rounded-full" /> {/* Cutout left */}
                                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-zinc-50 rounded-full" /> {/* Cutout right */}
                                    <p className="text-xs text-muted-foreground">
                                        Tunjukkan e-ticket ini kepada petugas saat check-in.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button size="lg" className="flex-1 shadow-md hover:shadow-lg transition-all" asChild>
                                    <Link href="/booking">Booking Lagi</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="flex-1" asChild>
                                    <Link href="/">Kembali</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Sidebar: QR & Actions */}
                        <div className="space-y-6">
                            <Card className="overflow-hidden shadow-lg border-0 ring-1 ring-zinc-200">
                                <div className="bg-zinc-900 p-4 text-center">
                                    <p className="text-white font-bold text-sm">SCAN ME</p>
                                </div>
                                <CardContent className="p-8 flex justify-center bg-white">
                                    {qrCodeUrl && (
                                        <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} className="mix-blend-multiply" />
                                    )}
                                </CardContent>
                                <CardFooter className="bg-zinc-50 p-4 grid grid-cols-2 gap-2">
                                    <Button variant="ghost" size="sm" onClick={handleDownloadQR} className="h-auto py-3 flex-col gap-1 text-xs">
                                        <Download className="h-4 w-4" />
                                        Save
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleShare} className="h-auto py-3 flex-col gap-1 text-xs">
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </CardFooter>
                            </Card>

                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3 items-start">
                                <Receipt className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm text-blue-900">Butuh Bukti Pembayaran?</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Invoice resmi sudah dikirim ke <span className="font-semibold">{booking.customerEmail}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
