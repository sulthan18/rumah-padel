import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const { rewardId } = await req.json();

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!reward || !reward.isActive) {
      return NextResponse.json({ message: 'Reward not found or not active.' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!user || user.loyaltyPointsBalance < reward.pointsCost) {
      return NextResponse.json({ message: 'Not enough points.' }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: currentUserId },
        data: {
          loyaltyPointsBalance: {
            decrement: reward.pointsCost,
          },
        },
      }),
      prisma.loyaltyPoint.create({
        data: {
          userId: currentUserId,
          points: -reward.pointsCost,
          reason: `Redeemed: ${reward.name}`,
        },
      }),
    ]);

    return NextResponse.json({ message: 'Reward redeemed successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
