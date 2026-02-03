import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function DashboardBookingsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect("/auth/login")
    }

    const bookings = await prisma.booking.findMany({
        where: {
            OR: [
                { customerEmail: session.user.email },
                { user: { email: session.user.email } },
            ],
            // Hide pending bookings older than 2 hours generally? Or just show all?
            // User wants history.
            status: { not: "PENDING" } // Maybe show only finished ones? Or PENDING too?
        },
        include: {
            court: true,
            payment: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Riwayat Booking</h1>
                    <p className="text-muted-foreground">Daftar transaksi dan jadwal main kamu.</p>
                </div>
                <Button asChild>
                    <Link href="/booking">Buat Booking Baru</Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {bookings.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                            <p className="text-muted-foreground mb-4">Belum ada riwayat booking.</p>
                            <Button variant="outline" asChild>
                                <Link href="/booking">Mulai Booking Sekarang</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    bookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={booking.status === "CONFIRMED" ? "default" : booking.status === "PENDING" ? "secondary" : "destructive"}>
                                            {booking.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-mono">#{booking.id.slice(-6)}</span>
                                    </div>
                                    <h3 className="font-bold text-lg">{booking.court.name}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {format(booking.startTime, "EEEE, d MMMM yyyy", { locale: id })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm text-muted-foreground">Total Bayar</p>
                                        <p className="font-bold">Rp {booking.totalPrice.toLocaleString("id-ID")}</p>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/booking/confirmation/${booking.id}`}>
                                            Lihat Tiket
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
