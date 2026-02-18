import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { requesterId: currentUserId, status: 'ACCEPTED' },
          { receiverId: currentUserId, status: 'ACCEPTED' },
        ],
      },
      include: {
        requester: true,
        receiver: true,
      },
    });

    const pendingRequests = await prisma.friend.findMany({
        where: {
            receiverId: currentUserId,
            status: 'PENDING',
        },
        include: {
            requester: true,
        },
    });

    return NextResponse.json({ friends, pendingRequests });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
