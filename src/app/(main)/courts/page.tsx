import { prisma } from "@/lib/prisma"
import { BookingEngine } from "@/lib/booking-engine"
import { CourtFilters } from "@/components/courts/court-filters"
import { CourtCard } from "@/components/courts/court-card"
import { FadeIn, FadeInStagger } from "@/components/animations/fade-in"
import { BlurIn } from "@/components/animations/variants"
import { CourtType, CourtSurface } from "@prisma/client"

export const dynamic = "force-dynamic"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default async function CourtsPage({
    searchParams,
}: {
    searchParams: { type?: string; surface?: string; q?: string; page?: string }
}) {
    // 1. Parse Params
    const query = searchParams.q || ""
    const currentPage = Number(searchParams.page) || 1
    const pageSize = 6
    const skip = (currentPage - 1) * pageSize

    // 2. Build Filter
    const where: any = { isActive: true }

    if (searchParams.type && ["INDOOR", "OUTDOOR"].includes(searchParams.type)) {
        where.type = searchParams.type as CourtType
    }

    if (searchParams.surface && ["GRASS", "CARPET"].includes(searchParams.surface)) {
        where.surface = searchParams.surface as CourtSurface
    }

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
        ]
    }

    // 3. Fetch Data (Parallel Count & Find)
    const [totalCourts, courts] = await Promise.all([
        prisma.court.count({ where }),
        prisma.court.findMany({
            where,
            orderBy: { name: "asc" },
            skip,
            take: pageSize
        })
    ])

    const totalPages = Math.ceil(totalCourts / pageSize)

    // 4. Fetch Live Availability
    const courtsWithStatus = await Promise.all(courts.map(async (court) => {
        const availability = await BookingEngine.getAvailability(court.id, new Date())

        // Find next available slot if not available now
        const currentHour = new Date().getHours()
        let nextSlot = undefined

        if (availability.status !== "Available") {
            const next = availability.slots.find(s => {
                const slotHour = parseInt(s.hour.split(":")[0])
                return s.isAvailable && slotHour > currentHour
            })
            if (next) nextSlot = next.hour
        }

        return {
            ...court,
            status: {
                status: availability.status,
                nextSlot
            }
        }
    }))

    return (
        <div className="min-h-screen bg-zinc-50/50">
            {/* Header */}
            <div className="bg-zinc-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <BlurIn>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Our Premium Courts
                        </h1>
                    </BlurIn>
                    <FadeIn delay={0.2}>
                        <p className="text-zinc-400 max-w-2xl text-lg">
                            Book your perfect match. Choose from our professional-grade indoor and outdoor courts,
                            featuring specific surfaces for your playing style.
                        </p>
                    </FadeIn>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <CourtFilters />
                    </aside>

                    {/* Grid */}
                    <div className="flex-1 space-y-12">
                        {courtsWithStatus.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200">
                                <h3 className="text-xl font-bold text-zinc-900 mb-2">No courts found</h3>
                                <p className="text-zinc-500">Try adjusting your filters or search query.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courtsWithStatus.map((court, index) => (
                                    <CourtCard
                                        key={court.id}
                                        court={court}
                                        index={index}
                                        status={court.status}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={`/courts?page=${Math.max(1, currentPage - 1)}&q=${query}`}
                                            aria-disabled={currentPage === 1}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                            size="default"
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                href={`/courts?page=${i + 1}&q=${query}`}
                                                isActive={currentPage === i + 1}
                                                size="default"
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={`/courts?page=${Math.min(totalPages, currentPage + 1)}&q=${query}`}
                                            aria-disabled={currentPage === totalPages}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                            size="default"
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
