"use client"

import { Court, CourtProvider } from "@prisma/client"
import { motion } from "framer-motion"
import { Calendar, Users, Info, ArrowRight, Sun, Cloud, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SlideIn3D } from "@/components/animations/variants"
import Image from "next/image"

interface CourtCardProps {
    court: Court & { courtProvider: CourtProvider }
    index: number
    status?: {
        status: string // "Available", "Fully Booked", "Limited Slots"
        nextSlot?: string
    }
}

const PLACEHOLDERS = [
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800", // Indoor Court (Reliable)
    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800", // Tennis/Padel Rackets
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800"  // Outdoor Court (Reliable)
]

export function CourtCard({ court, index, status }: CourtCardProps) {
    // Type casting to bypass stale Prisma Client in IDE
    const safeCourt = court as any
    const isIndoor = safeCourt.type === "INDOOR"
    const isGrass = safeCourt.surface === "GRASS"

    // Deterministic random image based on court ID
    const randomImage = PLACEHOLDERS[court.id.charCodeAt(0) % PLACEHOLDERS.length]

    // Status Logic
    const isAvailable = status?.status === "Available" || status?.status === "Limited Slots"
    const statusColor = isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
    const StatusIcon = isAvailable ? Check : Calendar

    return (
        <SlideIn3D delay={index * 0.1}>
            <motion.div
                className="group relative bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-500"
                whileHover={{ y: -5 }}
            >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                    <Image
                        src={safeCourt.imageUrl || randomImage}
                        alt={court.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant={isIndoor ? "default" : "secondary"} className="uppercase tracking-widest text-[10px] font-bold shadow-lg">
                            {isIndoor ? <Cloud className="w-3 h-3 mr-1" /> : <Sun className="w-3 h-3 mr-1" />}
                            {safeCourt.type || "INDOOR"}
                        </Badge>
                        <Badge variant="outline" className="bg-white/90 text-zinc-900 border-none uppercase tracking-widest text-[10px] font-bold shadow-lg">
                            {safeCourt.surface || "CARPET"}
                        </Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm font-medium text-zinc-200 mb-1">{court.courtProvider.name}</p>
                        <h3 className="text-2xl font-black tracking-tighter mb-1">{court.name}</h3>
                        <p className="text-zinc-300 text-sm line-clamp-1">{court.description || "Premium Padel Court"}</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-zinc-600">
                            <div className="p-2 rounded-full bg-zinc-100">
                                <Users className="w-4 h-4 text-zinc-900" />
                            </div>
                            <span className="text-sm font-medium">Standard 4 Players</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600">
                            <div className="p-2 rounded-full bg-zinc-100">
                                <Calendar className="w-4 h-4 text-zinc-900" />
                            </div>
                            <span className="text-sm font-medium">Auto-Booking</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm text-zinc-500">
                            <span>Per Hour</span>
                            <span className="text-lg font-bold text-zinc-900">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(court.pricePerHour)}
                            </span>
                        </div>
                        <div className="w-full h-px bg-zinc-100" />
                        <div className="flex justify-between items-center text-sm">
                            <span className={`text-xs font-bold flex items-center px-2 py-1 rounded ${statusColor}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status?.status || "Available"}
                            </span>
                            {status?.nextSlot && (
                                <span className="text-xs text-zinc-400">Next: {status.nextSlot}</span>
                            )}
                        </div>
                    </div>

                    <Button className="w-full rounded-xl font-bold h-12 text-md" asChild>
                        <Link href={`/booking?court=${court.id}`}>
                            Book Now <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </SlideIn3D>
    )
}
