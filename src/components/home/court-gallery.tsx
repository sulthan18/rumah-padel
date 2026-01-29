import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Snowflake, Shield, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock Data
const COURTS = [
    {
        id: "c1",
        name: "Court A - Pro Center",
        image: "/images/hero-bg.jpg", // Fallback to hero image for now
        price: "Rp 350.000",
        facilities: ["Indoor", "AC", "WPT Carpet"]
    },
    {
        id: "c2",
        name: "Court B - Semi Outdoor",
        image: "/images/signup-bg.jpg", // Fallback
        price: "Rp 250.000",
        facilities: ["Outdoor", "Panorama", "Standard"]
    },
    {
        id: "c3",
        name: "Court C - Training",
        image: "/images/hero-bg.jpg", // Fallback
        price: "Rp 200.000",
        facilities: ["Indoor", "Coaching", "Ball Machine"]
    }
]

export function CourtGallery() {
    return (
        <section id="courts" className="py-20 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="container px-4">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                        Pilih Lapangan Kami
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Lapangan standar internasional dengan fasilitas lengkap untuk pengalaman bermain terbaik.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {COURTS.map(court => (
                        <Card key={court.id} className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="relative h-64 w-full overflow-hidden bg-zinc-200">
                                <Image
                                    src={court.image}
                                    alt={court.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-white/90 text-zinc-900 hover:bg-white backdrop-blur-md">
                                        Available
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{court.name}</h3>
                                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                                            <Shield className="h-3 w-3" /> Standard WPT
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-lg font-bold text-primary">{court.price}</span>
                                        <span className="text-xs text-muted-foreground">per jam</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {court.facilities.map((fac, i) => (
                                        <Badge key={i} variant="secondary" className="px-2 py-1 bg-zinc-100 text-zinc-700">
                                            {fac}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="p-6 pt-0">
                                <Button className="w-full h-10 font-semibold" asChild>
                                    <Link href="/booking">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Lihat Jadwal
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
