"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Calendar, Clock, MapPin, Download, Share2, Home, List, Loader2 } from "lucide-react"
import Link from "next/link"
import QRCode from "qrcode"
import Image from "next/image"

interface BookingDetails {
    id: string
    courtName: string
    date: string
    slots: string[]
    customerName: string
    customerEmail: string
    total: number
    status: string
}

export default function ConfirmationPage() {
    const params = useParams()
    const bookingId = params?.bookingId as string
    const [booking, setBooking] = useState<BookingDetails | null>(null)
    const [qrCodeUrl, setQrCodeUrl] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(`/api/booking/${bookingId}`)
                if (response.ok) {
                    const data = await response.json()
                    setBooking(data)

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
                }
            } catch (error) {
                console.error("Failed to fetch booking:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (bookingId) {
            fetchBooking()
        }
    }, [bookingId])

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="text-6xl">😕</div>
                        <h2 className="text-2xl font-bold">Booking Tidak Ditemukan</h2>
                        <p className="text-muted-foreground">Booking ID tidak valid atau sudah dihapus.</p>
                        <Button asChild>
                            <Link href="/booking">Booking Lagi</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Success Banner */}
                    <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">
                                Booking Berhasil! 🎉
                            </h1>
                            <p className="text-lg text-muted-foreground mt-2">
                                Booking kamu udah dikonfirmasi. Simpen QR code di bawah ya!
                            </p>
                        </div>
                    </div>

                    {/* QR Code Card */}
                    <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        <CardContent className="p-8">
                            <div className="text-center space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-2">QR Code Check-In</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Tunjukkan QR code ini ke resepsionis saat datang
                                    </p>
                                </div>

                                {qrCodeUrl && (
                                    <div className="flex justify-center">
                                        <div className="bg-white p-6 rounded-2xl border-4 border-zinc-900 shadow-xl">
                                            <Image src={qrCodeUrl} alt="Booking QR Code" width={250} height={250} />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Kode Booking</p>
                                    <p className="text-2xl font-black font-mono tracking-wider">{bookingId}</p>
                                </div>

                                <div className="flex gap-3 justify-center">
                                    <Button variant="outline" onClick={handleDownloadQR}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download QR
                                    </Button>
                                    <Button variant="outline" onClick={handleShare}>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Details */}
                    <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-lg">Detail Booking</h3>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-semibold">{booking.courtName}</div>
                                        <div className="text-sm text-muted-foreground">Rumah Padel Jakarta</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                    <div className="flex-1">
                                        <div className="font-semibold">
                                            {new Date(booking.date).toLocaleDateString("id-ID", {
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
                                    <div className="flex-1">
                                        <div className="font-semibold">{booking.slots.length} Jam</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {booking.slots.map((slot) => (
                                                <Badge key={slot} variant="secondary">
                                                    {slot}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between text-lg">
                                <span className="font-semibold">Total Bayar</span>
                                <span className="font-black text-primary">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    }).format(booking.total)}
                                </span>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                                <p className="font-semibold text-blue-900 mb-1">📧 Email Konfirmasi Terkirim</p>
                                <p className="text-blue-700">
                                    Kami sudah kirim detail booking ke <strong>{booking.customerEmail}</strong>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <Button size="lg" variant="outline" asChild className="h-14">
                            <Link href="/">
                                <Home className="h-5 w-5 mr-2" />
                                Kembali ke Beranda
                            </Link>
                        </Button>
                        <Button size="lg" asChild className="h-14">
                            <Link href="/booking">
                                <Calendar className="h-5 w-5 mr-2" />
                                Booking Lagi
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
