
import { PrismaClient } from "@prisma/client"
import { TournamentEngine } from "@/lib/tournament-engine"

const prisma = new PrismaClient()

async function main() {
    console.log("🏆 Seeding Tournament System...")

    // 1. Create a Seed User (Captain) if not exists
    let captain = await prisma.user.findFirst({ where: { email: "captain@example.com" } })
    if (!captain) {
        captain = await prisma.user.create({
            data: {
                name: "Tournament Admin",
                email: "captain@example.com",
                role: "ADMIN"
            }
        })
    }

    // 2. Create Tournament
    const tournament = await prisma.tournament.create({
        data: {
            name: "Winter Padel Cup 2024",
            description: "The biggest winter event of the season.",
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
            status: "ACTIVE", // Active so bracket shows
            maxTeams: 8,
            prizePool: "Rp 15.000.000"
        }
    })
    console.log(`Created Tournament: ${tournament.name} (${tournament.id})`)

    // 3. Create 8 Teams
    const teamNames = [
        "Vipers", "Bulls", "Eagles", "Sharks",
        "Cobras", "Lions", "Wolves", "Falcons"
    ]

    const teams = []
    for (const name of teamNames) {
        const team = await prisma.team.create({
            data: {
                name,
                captainId: captain.id,
                tournamentId: tournament.id,
                status: "APPROVED"
            }
        })
        teams.push(team)
        console.log(`Registered Team: ${team.name}`)
    }

    // 4. Generate Bracket
    console.log("🎲 Generating Bracket...")
    await TournamentEngine.generateBracket(tournament.id, teams)
    console.log("✅ Bracket Generated!")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
