import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { midtrans } from '@/lib/midtrans';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const { courtId, date, slots, recurringRule, recurringEndDate, customerName, customerEmail, customerPhone } = await req.json();

    const bookingDate = new Date(date);
    const firstSlot = slots[0];
    const [startHour, startMinute] = firstSlot.split(':').map(Number);
    const startTime = new Date(bookingDate);
    startTime.setHours(startHour, startMinute, 0, 0);

    const lastSlot = slots[slots.length - 1];
    const [endHour, endMinute] = lastSlot.split(':').map(Number);
    const endTime = new Date(bookingDate);
    endTime.setHours(endHour + 1, endMinute, 0, 0);

    // For simplicity, we assume price is fetched or passed correctly
    const court = await prisma.court.findUnique({ where: { id: courtId } });
    if (!court) {
      return NextResponse.json({ message: 'Court not found' }, { status: 404 });
    }
    const totalPrice = court.pricePerHour * slots.length;

    // Create the first booking
    const firstBooking = await prisma.booking.create({
      data: {
        userId: currentUserId,
        courtId,
        startTime,
        endTime,
        status: 'PENDING',
        totalPrice,
      },
    });

    // Create the recurring booking rule
    await prisma.recurringBooking.create({
      data: {
        userId: currentUserId,
        courtId,
        startTime,
        endTime,
        rule: recurringRule,
        endDate: new Date(recurringEndDate),
      },
    });

    // Create a Midtrans transaction for the first booking
    const midtransTransaction = await midtrans.createTransaction({
      orderId: firstBooking.id,
      amount: totalPrice,
      customerDetails: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    });
    
    await prisma.payment.create({
        data: {
            bookingId: firstBooking.id,
            amount: totalPrice,
            provider: "midtrans",
            externalId: firstBooking.id,
            snapToken: midtransTransaction.token,
            status: "PENDING",
        },
    });

    return NextResponse.json({
      bookingId: firstBooking.id,
      snapToken: midtransTransaction.token,
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
