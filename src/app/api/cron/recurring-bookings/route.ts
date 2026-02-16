import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addWeeks, isBefore } from 'date-fns';

export async function GET() {
  try {
    const recurringBookings = await prisma.recurringBooking.findMany({
      where: {
        endDate: {
          gte: new Date(),
        },
      },
    });

    for (const rb of recurringBookings) {
      const now = new Date();
      let nextBookingDate = new Date(rb.startTime);

      // Determine the next booking date based on the rule
      if (rb.rule === 'weekly') {
        while (isBefore(nextBookingDate, now)) {
          nextBookingDate = addWeeks(nextBookingDate, 1);
        }
      } else if (rb.rule === 'bi-weekly') {
        while (isBefore(nextBookingDate, now)) {
          nextBookingDate = addWeeks(nextBookingDate, 2);
        }
      }

      if (isBefore(nextBookingDate, rb.endDate)) {
        // Check if a booking for this date already exists
        const existingBooking = await prisma.booking.findFirst({
          where: {
            courtId: rb.courtId,
            startTime: nextBookingDate,
          },
        });

        if (!existingBooking) {
          // Create the booking
          await prisma.booking.create({
            data: {
              userId: rb.userId,
              courtId: rb.courtId,
              startTime: nextBookingDate,
              endTime: new Date(nextBookingDate.getTime() + (rb.endTime.getTime() - rb.startTime.getTime())),
              status: 'CONFIRMED', // Or PENDING and require payment? For simplicity, let's make it confirmed.
              totalPrice: 0, // Should be calculated based on court price
            },
          });
        }
      }
    }

    return NextResponse.json({ message: 'Recurring bookings checked.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
