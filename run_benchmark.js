const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { TournamentEngine } = require('./src/lib/tournament-engine');

async function runBenchmark() {
    console.log("Starting Benchmark...");

    // Create dummy tournament
    const tournament = await prisma.tournament.create({
        data: {
            name: "Performance Test Tournament",
            status: "UPCOMING"
        }
    });

    // Generate 64 teams
    const teams = Array.from({ length: 64 }).map((_, i) => ({
        id: `team-${i}`,
        name: `Team ${i}`
    }));

    const start = performance.now();

    await TournamentEngine.generateBracket(tournament.id, teams);

    const end = performance.now();
    console.log(`Bracket generation for 64 teams took ${end - start} ms`);

    // Cleanup
    await prisma.tMatch.deleteMany({ where: { tournamentId: tournament.id } });
    await prisma.tournament.delete({ where: { id: tournament.id } });
}

runBenchmark().catch(console.error).finally(() => prisma.$disconnect());
