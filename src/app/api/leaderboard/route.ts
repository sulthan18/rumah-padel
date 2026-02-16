import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const players = await prisma.user.findMany({
      include: {
        matches: {
          include: {
            match: true,
          },
        },
      },
    });

    const leaderboard = players.map(player => {
      const wins = player.matches.filter(
        matchPlayer => matchPlayer.team === matchPlayer.match.winnerTeam
      ).length;
      const losses = player.matches.length - wins;

      return {
        id: player.id,
        name: player.name,
        image: player.image,
        wins,
        losses,
        winRate: player.matches.length > 0 ? (wins / player.matches.length) * 100 : 0,
      };
    });

    leaderboard.sort((a, b) => b.wins - a.wins || a.losses - b.losses);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
