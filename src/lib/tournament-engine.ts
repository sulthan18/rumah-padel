
import { prisma } from "@/lib/prisma"

// Types
type TeamInput = {
    id: string
    name: string
}

export class TournamentEngine {

    /**
     * GENERATE BRACKET SYSTEM
     * Recursive algorithm to build a Single Elimination Tree
     */
    static async generateBracket(tournamentId: string, teams: TeamInput[]) {
        // 1. Calculate Bracket Size (Power of 2)
        const teamCount = teams.length
        const size = Math.pow(2, Math.ceil(Math.log2(teamCount)))
        const byes = size - teamCount

        console.log(`🏆 Generating Bracket for ${teamCount} Teams. Size: ${size}. Byes: ${byes}`)

        // 2. Clear existing matches if any (Full Reset)
        await prisma.tMatch.deleteMany({ where: { tournamentId } })

        // 3. Create Root Match (The Final)
        // We build from Top (Finals) down to Leaves (Round 1) to easily link IDs
        const totalRounds = Math.log2(size)
        const rootMatch = await this.createMatchNode(tournamentId, totalRounds, 0, null)

        // 4. Recursively build the tree
        await this.buildTreeLayers(tournamentId, [rootMatch], totalRounds - 1)

        // 5. Place Teams in Leaf Nodes
        // Simple seeding: Random shuffle or assume input order is seeded
        // For "Byes", we place them against the top seeds usually, but here we just fill slots.
        const leafMatches = await prisma.tMatch.findMany({
            where: { tournamentId, round: 1 },
            orderBy: { position: 'asc' }
        })

        // We have 'size' slots in leaf matches (teamA + teamB)
        // If we have Byes, strictly speaking, they are "ghost" opponents.
        // Strategy: Fill Team A of all matches first, then Team B.

        let teamIndex = 0
        for (const match of leafMatches) {
            // Slot A
            if (teamIndex < teams.length) {
                await prisma.tMatch.update({
                    where: { id: match.id },
                    data: { teamAId: teams[teamIndex].id }
                })
                teamIndex++
            }

            // Slot B (Check if this slot should be a BYE)
            // If we have N teams and S slots, slots N+1..S are empty -> implied BYE.
            // If slot B is empty, the logic needs to auto-advance Team A.
            if (teamIndex < teams.length) {
                await prisma.tMatch.update({
                    where: { id: match.id },
                    data: { teamBId: teams[teamIndex].id }
                })
                teamIndex++
            } else {
                // Determine BYE. 
                // In our model, if TeamB is NULL, it's a BYE.
                // We typically auto-advance immediately if it's a BYE.
                await this.handleBye(match.id)
            }
        }
    }

    private static async createMatchNode(tournamentId: string, round: number, position: number, nextMatchId: string | null) {
        return await prisma.tMatch.create({
            data: {
                tournamentId,
                round,
                position,
                nextMatchId
            }
        })
    }

    private static async buildTreeLayers(tournamentId: string, currentLayer: any[], round: number) {
        if (round < 1) return

        const nextLayer = []

        for (const parent of currentLayer) {
            // Create 2 children for each parent
            // Position logic: Parent matches wait for winners from Child 1 and Child 2
            // Global bracket visualization usually expects nice ordering.

            const child1 = await this.createMatchNode(tournamentId, round, parent.position * 2, parent.id)
            const child2 = await this.createMatchNode(tournamentId, round, (parent.position * 2) + 1, parent.id)

            nextLayer.push(child1, child2)
        }

        await this.buildTreeLayers(tournamentId, nextLayer, round - 1)
    }

    private static async handleBye(matchId: string) {
        // If a match has a BYE (missing opponent), auto-advance Team A
        const match = await prisma.tMatch.findUnique({ where: { id: matchId } })
        if (match && match.teamAId && !match.teamBId) {
            console.log(`⏩ Auto-Advancing (BYE): ${match.id}`)
            await this.advanceWinner(match.id, match.teamAId)
        }
    }

    /**
     * ADVANCE WINNER SYSTEM
     * Moves a team to the next bracket node
     */
    static async advanceWinner(matchId: string, winnerTeamId: string) {
        // 1. Update current match
        const currentMatch = await prisma.tMatch.update({
            where: { id: matchId },
            data: {
                winnerId: winnerTeamId,
                score: "BYE" // Or actual score if passed
            },
            include: { nextMatch: true }
        })

        // 2. Check for Next Match (if not Final)
        if (currentMatch.nextMatch) {
            const nextMatchId = currentMatch.nextMatchId!

            // 3. Determine which slot to take in the parent match
            // Strategy: We can look at existing slots. If A is taken, take B.
            // Or better: Use the position logic. Child 1 -> Slot A, Child 2 -> Slot B.
            // Simplified here: First Available Slot.

            const nextMatch = await prisma.tMatch.findUnique({ where: { id: nextMatchId } })
            if (!nextMatch) return

            if (!nextMatch.teamAId) {
                await prisma.tMatch.update({
                    where: { id: nextMatchId },
                    data: { teamAId: winnerTeamId }
                })
            } else if (!nextMatch.teamBId) {
                await prisma.tMatch.update({
                    where: { id: nextMatchId },
                    data: { teamBId: winnerTeamId }
                })
            } else {
                console.error("CRITICAL: Next match is full! Cannot advance.")
            }
        } else {
            console.log("🏆 TOURNAMENT WINNER DECLARED: " + winnerTeamId)
            // Mark Tournament as FINISHED
            await prisma.tournament.update({
                where: { id: currentMatch.tournamentId },
                data: { status: 'FINISHED' }
            })
        }
    }
}
