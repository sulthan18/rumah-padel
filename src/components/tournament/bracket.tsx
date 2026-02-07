
"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Types that mirror our Prisma model structure (simplified for UI)
type Match = {
    id: string
    round: number
    position: number
    teamA?: { name: string, id: string }
    teamB?: { name: string, id: string }
    winnerId?: string
    score?: string
    nextMatchId?: string | null
}

export function TournamentBracket({ matches }: { matches: Match[] }) {
    // 1. Group matches by round
    const rounds = matches.reduce((acc, match) => {
        if (!acc[match.round]) acc[match.round] = []
        acc[match.round].push(match)
        return acc
    }, {} as Record<number, Match[]>)

    // Sort rounds (High to Low usually depicts Root to Leaf, but visualizer goes Left to Right: Leaf -> Root)
    // Root is Round 0 or High? In our Engine: "1 = Finals" is wrong or right?
    // Engine said: "Root Match (Finals)... buildTreeLayers".
    // Let's assume input has correct Round info. We want to display Round 3 -> Round 2 -> Round 1.
    // Actually, usually Round 1 is Left (First Round).
    // Let's sort keys descending (Round N ... Round 1).
    const roundKeys = Object.keys(rounds).map(Number).sort((a, b) => b - a)

    return (
        <div className="flex items-center gap-12 overflow-x-auto p-12 min-h-[600px] bg-zinc-900/5 rounded-3xl border border-zinc-200/50">
            {roundKeys.map((roundNumber) => (
                <div key={roundNumber} className="flex flex-col justify-around gap-8 min-w-[280px]">
                    <h3 className="text-center font-bold text-zinc-400 uppercase tracking-widest text-xs mb-4">
                        {roundNumber === 1 ? "Finals" : roundNumber === 2 ? "Semi-Finals" : `Round ${roundNumber}`}
                    </h3>

                    {rounds[roundNumber]
                        .sort((a, b) => a.position - b.position)
                        .map((match) => (
                            <div key={match.id} className="relative flex flex-col justify-center h-full">
                                <MatchCard match={match} />

                                {/* Connectors would go here, realized best via SVG overlay or simpler CSS border hacks */}
                            </div>
                        ))}
                </div>
            ))}
        </div>
    )
}

function MatchCard({ match }: { match: Match }) {
    const isCompleted = !!match.winnerId

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "bg-white border text-sm w-full rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md",
                isCompleted ? "border-zinc-300" : "border-zinc-200"
            )}
        >
            <div className="flex justify-between items-center p-3 border-b border-zinc-50 bg-zinc-50/50">
                <span className="text-xs text-zinc-400 font-mono">#{match.position}</span>
                {match.score && <span className="text-xs font-bold text-zinc-600 bg-zinc-200/50 px-2 py-0.5 rounded-full">{match.score}</span>}
            </div>

            <div className="flex flex-col">
                <TeamRow team={match.teamA} isWinner={match.winnerId === match.teamA?.id} />
                <div className="h-px bg-zinc-100 w-full" />
                <TeamRow team={match.teamB} isWinner={match.winnerId === match.teamB?.id} />
            </div>
        </motion.div>
    )
}

function TeamRow({ team, isWinner }: { team?: { name: string }, isWinner?: boolean }) {
    return (
        <div className={cn(
            "px-4 py-3 flex justify-between items-center",
            isWinner && "bg-green-50/50"
        )}>
            {team ? (
                <span className={cn(
                    "font-medium truncate",
                    isWinner ? "text-green-700 font-bold" : "text-zinc-700"
                )}>
                    {team.name}
                </span>
            ) : (
                <span className="text-zinc-300 italic">TBD</span>
            )}

            {isWinner && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-green-500 ml-2"
                />
            )}
        </div>
    )
}
