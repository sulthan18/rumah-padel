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
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id: currentUserId,
          },
        },
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const { userId } = await req.json();

    // Check if a conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
        where: {
            AND: [
                { users: { some: { id: currentUserId } } },
                { users: { some: { id: userId } } },
            ]
        }
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }
    
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: currentUserId },
            { id: userId },
          ],
        },
      },
    });

    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
