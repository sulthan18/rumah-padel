import { PrismaClient, SkillLevel } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { seedCourtProviders } from './seed-court-providers'; // Import the new seed function

const prisma = new PrismaClient();

async function main() {
  // Delete all data
  await prisma.userAchievement.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.loyaltyPoint.deleteMany({});
  await prisma.reward.deleteMany({});
  await prisma.matchPlayer.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.friend.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.waitlistEntry.deleteMany({});
  await prisma.recurringBooking.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.tournament.deleteMany({});
  await prisma.court.deleteMany({}); // Added
  await prisma.courtProvider.deleteMany({}); // Added
  await prisma.user.deleteMany({});

  // Seed Court Providers first
  await seedCourtProviders();

  // 1. Create 50 users in bulk
  const usersData = [];
  for (let i = 0; i < 50; i++) {
    usersData.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
      skillLevel: faker.helpers.arrayElement([
        SkillLevel.BEGINNER,
        SkillLevel.INTERMEDIATE,
        SkillLevel.ADVANCED,
      ]),
      loyaltyPointsBalance: faker.number.int({ min: 0, max: 1000 }),
    });
  }
  await prisma.user.createMany({ data: usersData });
  const users = await prisma.user.findMany();

  // 2. Create friendships (reduced number)
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      if (faker.number.int({ min: 0, max: 10 }) < 2) { // 20% chance of friendship
        await prisma.friend.create({
          data: {
            requesterId: users[i].id,
            receiverId: users[j].id,
            status: 'ACCEPTED',
          },
        });
      }
    }
  }

  // 3. Create matches
  for (let i = 0; i < 100; i++) {
    const teamA = faker.helpers.arrayElements(users, faker.number.int({ min: 1, max: 2 }));
    const teamB = faker.helpers.arrayElements(
      users.filter(u => !teamA.find(a => a.id === u.id)),
      faker.number.int({ min: 1, max: 2 })
    );

    const teamAScore = faker.number.int({ min: 0, max: 10 });
    const teamBScore = faker.number.int({ min: 0, max: 10 });

    if (teamA.length > 0 && teamB.length > 0) {
        await prisma.match.create({
            data: {
              teamAScore,
              teamBScore,
              winnerTeam: teamAScore > teamBScore ? 'A' : 'B',
              players: {
                create: [
                  ...teamA.map(user => ({ userId: user.id, team: 'A' })),
                  ...teamB.map(user => ({ userId: user.id, team: 'B' })),
                ],
              },
            },
          });
    }
  }

  // 4. Create rewards
  await prisma.reward.createMany({
    data: [
      {
        name: 'Free Drink',
        description: 'Get a free drink from the cafe.',
        pointsCost: 100,
      },
      {
        name: '1 Hour Free Play',
        description: 'Get 1 hour of free play on any court.',
        pointsCost: 500,
      },
      {
        name: 'Free T-shirt',
        description: 'Get a free Rumah Padel t-shirt.',
        pointsCost: 1000,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
