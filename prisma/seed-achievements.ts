import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.achievement.createMany({
    data: [
      {
        name: 'First Booking',
        description: 'Awarded for your first confirmed booking.',
        icon: '/icons/achievements/first-booking.svg',
        criteria: { type: 'booking_confirmed', count: 1 },
      },
      {
        name: 'Weekend Warrior',
        description: 'Awarded for booking 5 times on weekends.',
        icon: '/icons/achievements/weekend-warrior.svg',
        criteria: { type: 'booking_confirmed', count: 5, filter: 'weekend' },
      },
      {
        name: 'First Win',
        description: 'Awarded for winning your first match.',
        icon: '/icons/achievements/first-win.svg',
        criteria: { type: 'match_won', count: 1 },
      },
    ],
    skipDuplicates: true,
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
