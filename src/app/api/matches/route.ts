import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { achievementEngine } from '@/lib/achievement-engine';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { teamA, teamB, teamAScore, teamBScore, winnerTeam } = await req.json();

    const match = await prisma.match.create({
      data: {
        teamAScore,
        teamBScore,
        winnerTeam,
        players: {
          create: [
            ...teamA.map((userId: string) => ({ userId, team: 'A' })),
            ...teamB.map((userId: string) => ({ userId, team: 'B' })),
          ],
        },
      },
    });

    // Check for achievements for the winning team
    const winningTeam = winnerTeam === 'A' ? teamA : teamB;
    for (const userId of winningTeam) {
      await achievementEngine.checkAndAward(userId, 'match_won');
    }

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
