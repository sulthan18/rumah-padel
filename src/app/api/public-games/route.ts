import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const publicGames = await prisma.booking.findMany({
      where: {
        lookingForPlayers: true,
        status: 'CONFIRMED', // Only show confirmed bookings
        startTime: {
          gte: new Date(), // Only show future games
        },
      },
      include: {
        user: true,
        court: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    return NextResponse.json(publicGames);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
