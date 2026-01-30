"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, CreditCard, QrCode, Loader2, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BookingData {
    courtId: string
    courtName: string
    date: string
    slots: string[]
    pricePerHour: number
}

export default function CheckoutPage() {
    const router = useRouter()
    const [bookingData, setBookingData] = useState<BookingData | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<"qris" | "va">("qris")
    const [selectedBank, setSelectedBank] = useState("bca")
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    // Customer details
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

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
        if (!name || !email || !phone || !agreedToTerms) {
            alert("Mohon lengkapi semua data dan setujui syarat & ketentuan")
            return
        }

        setIsProcessing(true)

        try {
            // Mock payment processing
            const response = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...bookingData,
                    customerName: name,
                    customerEmail: email,
                    customerPhone: phone,
                    paymentMethod,
                    paymentBank: paymentMethod === "va" ? selectedBank : null,
                }),
            })

            if (response.ok) {
                const result = await response.json()
                sessionStorage.removeItem("pendingBooking")
                router.push(`/booking/confirmation/${result.bookingId}`)
            } else {
                alert("Booking gagal. Silakan coba lagi.")
            }
        } catch (error) {
            console.error("Booking error:", error)
            alert("Terjadi kesalahan. Silakan coba lagi.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
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
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</div>
                                <span>Pilih Jadwal</span>
                            </div>
                            <div className="w-8 h-0.5 bg-zinc-200" />
                            <div className="flex items-center gap-2">
                                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                                <span className="font-medium">Pembayaran</span>
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

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Payment Form */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Customer Details */}
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

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Metode Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-zinc-50">
                                        <RadioGroupItem value="qris" id="qris" />
                                        <Label htmlFor="qris" className="flex items-center gap-3 cursor-pointer flex-1">
                                            <QrCode className="h-5 w-5 text-primary" />
                                            <div>
                                                <div className="font-semibold">QRIS</div>
                                                <div className="text-xs text-muted-foreground">Scan QR pakai app bank/e-wallet</div>
                                            </div>
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-zinc-50">
                                        <RadioGroupItem value="va" id="va" />
                                        <Label htmlFor="va" className="flex items-center gap-3 cursor-pointer flex-1">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                            <div>
                                                <div className="font-semibold">Virtual Account</div>
                                                <div className="text-xs text-muted-foreground">Transfer via ATM/mobile banking</div>
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {paymentMethod === "va" && (
                                    <div className="space-y-2 pl-4">
                                        <Label>Pilih Bank</Label>
                                        <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
                                            {["BCA", "Mandiri", "BNI", "BRI"].map((bank) => (
                                                <div key={bank} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={bank.toLowerCase()} id={bank} />
                                                    <Label htmlFor={bank} className="cursor-pointer">{bank}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                )}
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
                            disabled={isProcessing || !agreedToTerms}
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
    )
}
