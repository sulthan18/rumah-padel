import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const { receiverId } = await req.json();

    if (currentUserId === receiverId) {
      return NextResponse.json({ message: "You cannot send a friend request to yourself." }, { status: 400 });
    }

    // Check if a friend request already exists
    const existingRequest = await prisma.friend.findFirst({
      where: {
        OR: [
          { requesterId: currentUserId, receiverId: receiverId },
          { requesterId: receiverId, receiverId: currentUserId },
        ],
      },
    });

    if (existingRequest) {
      return NextResponse.json({ message: 'A friend request already exists between you and this user.' }, { status: 400 });
    }

    const friendRequest = await prisma.friend.create({
      data: {
        requesterId: currentUserId,
        receiverId,
      },
    });

    return NextResponse.json(friendRequest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const { requesterId, status } = await req.json();

    const friendRequest = await prisma.friend.findFirst({
      where: {
        requesterId: requesterId,
        receiverId: currentUserId,
      },
    });

    if (!friendRequest) {
      return NextResponse.json({ message: 'Friend request not found.' }, { status: 404 });
    }

    const updatedRequest = await prisma.friend.update({
      where: {
        id: friendRequest.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
