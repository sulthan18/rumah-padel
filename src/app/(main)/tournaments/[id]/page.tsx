
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { TournamentBracket } from "@/components/tournament/bracket"
import { FadeIn } from "@/components/animations/fade-in"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, Users, Shield } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TournamentDetailPage({ params }: { params: { id: string } }) {
    const tournament = await prisma.tournament.findUnique({
        where: { id: params.id },
        include: {
            teams: { include: { captain: true } },
            matches: {
                include: {
                    teamA: true,
                    teamB: true,
                },
                orderBy: { round: 'desc' } // Order by round (Finals first, but Bracket component re-sorts)
            }
        }
    })

    if (!tournament) return notFound()

    // Transform matches for Bracket Component
    const bracketMatches = tournament.matches.map(m => ({
        id: m.id,
        round: m.round,
        position: m.position,
        teamA: m.teamA ? { id: m.teamA.id, name: m.teamA.name } : undefined,
        teamB: m.teamB ? { id: m.teamB.id, name: m.teamB.name } : undefined,
        winnerId: m.winnerId || undefined,
        score: m.score || undefined,
        nextMatchId: m.nextMatchId
    }))

    return (
        <div className="min-h-screen bg-zinc-50 relative">
            {/* Hero Header */}
            <div className="bg-zinc-900 text-white pt-24 pb-32 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-800 opacity-90" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1621251347683-17637500593b?q=80&w=2000")' }}
                />

                <div className="container mx-auto px-4 relative z-10">
                    <FadeIn>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
                                    {tournament.status}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                                    {tournament.name}
                            </div>
                            <div className="flex gap-6 text-zinc-400 font-medium">
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {tournament.startDate.toLocaleDateString()}</span>
                                <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> {tournament.prizePool || "Prize Pool TBD"}</span>
                                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {tournament.teams.length} / {tournament.maxTeams} Teams</span>
                            </div>
                        </div>

                        <div>
                            <Button size="lg" className="rounded-full px-8 font-bold text-lg h-14" disabled={tournament.status !== 'REGISTRATION'}>
                                {tournament.status === 'REGISTRATION' ? 'Register Team' : 'Registration Closed'}
                            </Button>
                        </div>
                </div>
            </FadeIn>
        </div>
            </div >

        {/* Main Content */ }
        < div className = "container mx-auto px-4 -mt-20 relative z-20" >
            <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden min-h-[600px]">
                <Tabs defaultValue="bracket" className="w-full">
                    <div className="border-b border-zinc-200 bg-zinc-50/50 px-8 py-4">
                        <TabsList className="bg-transparent p-0 gap-8">
                            <TabsTrigger value="bracket" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-zinc-500 font-bold text-lg p-0 border-b-2 border-transparent data-[state=active]:border-primary rounded-none transition-all">
                                Bracket
                            </TabsTrigger>
                            <TabsTrigger value="teams" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-zinc-500 font-bold text-lg p-0 border-b-2 border-transparent data-[state=active]:border-primary rounded-none transition-all">
                                Teams ({tournament.teams.length})
                            </TabsTrigger>
                            <TabsTrigger value="rules" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none text-zinc-500 font-bold text-lg p-0 border-b-2 border-transparent data-[state=active]:border-primary rounded-none transition-all">
                                Rules
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="bracket" className="p-8 bg-zinc-50/30">
                        {bracketMatches.length > 0 ? (
                            <TournamentBracket matches={bracketMatches} />
                        ) : (
                            <div className="text-center py-20">
                                <Shield className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-zinc-900">Bracket Generating...</h3>
                                <p className="text-zinc-500 mt-2">Bracket will appear once registration closes.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="teams" className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tournament.teams.map(team => (
                                <div key={team.id} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between group hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center font-black text-zinc-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                            {team.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-900">{team.name}</h4>
                                            <p className="text-xs text-zinc-500">Capt. {team.captain.name}</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white border border-zinc-100 text-xs font-bold text-zinc-500">
                                        SEED ?
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="rules" className="p-8 max-w-3xl mx-auto prose prose-zinc">
                        <h3>Tournament Rules</h3>
                        <p>Official Padel Federation Rules apply.</p>
                        <ul>
                            <li>All teams must consist of 2 players.</li>
                            <li>Matches are Best of 3 Sets.</li>
                            <li>Golden Point rule is active in all matches.</li>
                            <li>15 minutes late = Walkover.</li>
                        </ul>
                    </TabsContent>
                </Tabs>
            </div>
            </div >
        </div >
    )
}
