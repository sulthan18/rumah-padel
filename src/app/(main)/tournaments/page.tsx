
import { prisma } from "@/lib/prisma"
import { FadeIn } from "@/components/animations/fade-in"
import { BlurIn } from "@/components/animations/variants"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Trophy, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TournamentsPage() {
    const tournaments = await prisma.tournament.findMany({
        orderBy: { startDate: 'desc' },
        include: { _count: { select: { teams: true } } }
    })

    return (
        <div className="min-h-screen bg-zinc-50/50">
            {/* Cinematic Hero */}
            <div className="relative h-[400px] w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900/50" />

                <div className="relative z-10 text-center max-w-4xl px-4">
                    <BlurIn>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                            CHAMPIONS LEAGUE
                        </h1>
                    </BlurIn>
                    <FadeIn delay={0.3}>
                        <p className="text-zinc-300 text-xl font-medium max-w-2xl mx-auto">
                            Join the ultimate Padel challenge. Compete for glory, prizes, and the championship title.
                        </p>
                    </FadeIn>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-zinc-900">Active Tournaments</h2>
                        <p className="text-zinc-500 mt-2">Select a tournament to view brackets and standings.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tournaments.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-zinc-300">
                            <Trophy className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-zinc-900">No Active Tournaments</h3>
                            <p className="text-zinc-500 mt-2">Check back soon for the next season.</p>
                        </div>
                    ) : (
                        tournaments.map((tournament, i) => (
                            <FadeIn key={tournament.id} delay={i * 0.1}>
                                <Link
                                    href={`/tournaments/${tournament.id}`}
                                    className="group block bg-white rounded-3xl overflow-hidden border border-zinc-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="h-48 bg-zinc-100 relative">
                                        {/* Simulated Cover Image based on ID hash or static for now */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1627521349637-8339b1654326?q=80&w=800")' }}
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-900">
                                            {tournament.status}
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors">
                                            {tournament.name}
                                        </h3>
                                        <p className="text-zinc-500 line-clamp-2 mb-6">
                                            {tournament.description || "Official Rumah Padel Tournament."}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm font-medium text-zinc-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span>{tournament.startDate.toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-primary" />
                                                <span>{tournament._count.teams} / {tournament.maxTeams} Teams</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
