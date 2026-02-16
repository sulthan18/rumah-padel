import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function BookingsPage() {
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
            status: { not: "PENDING" }
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
        <div className="container py-10 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Riwayat Booking</h1>
                    <p className="text-muted-foreground mt-1">Daftar transaksi dan jadwal main kamu di Rumah Padel.</p>
                </div>
                <Button asChild>
                    <Link href="/booking">Buat Booking Baru</Link>
                </Button>
            </div>

            <div className="grid gap-6">
                {bookings.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center h-64">
                            <div className="bg-muted p-4 rounded-full mb-4">
                                <Calendar className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">Belum ada booking</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                Kamu belum pernah melakukan booking lapangan. Yuk main padel sekarang!
                            </p>
                            <Button asChild>
                                <Link href="/booking">Mulai Booking Sekarang</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    bookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <Badge variant={booking.status === "CONFIRMED" ? "default" : booking.status === "PENDING" ? "secondary" : "destructive"} className="px-3 py-1">
                                            {booking.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                                            #{booking.id.slice(-6).toUpperCase()}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{booking.court.name}</h3>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span className="font-medium">
                                                    {format(booking.startTime, "EEEE, d MMMM yyyy", { locale: id })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span className="font-medium">
                                                    {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 md:border-l md:pl-6 border-zinc-100 min-w-[200px]">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Total Payment</p>
                                        <p className="font-bold text-lg text-primary">Rp {booking.totalPrice.toLocaleString("id-ID")}</p>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/booking/confirmation/${booking.id}`}>
                                            Detail
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
