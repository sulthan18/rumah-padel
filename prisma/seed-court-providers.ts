import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCourtProviders() {
  console.log('Seeding court providers...');

  const providers = [
    {
      name: 'Padel Paradise',
      address: '123 Padel St, Sport City',
      contactEmail: 'contact@padelparadise.com',
      contactPhone: '+1234567890',
    },
    {
      name: 'Court Kingdom',
      address: '456 Royal Ave, Game Town',
      contactEmail: 'info@courtkingdom.com',
      contactPhone: '+0987654321',
    },
  ];

  for (const providerData of providers) {
    await prisma.courtProvider.upsert({
      where: { name: providerData.name },
      update: {},
      create: providerData,
    });
  }

  console.log('Court providers seeded successfully.');
}

// If this file is run directly, execute the seeding.
if (require.main === module) {
  const prisma = new PrismaClient(); // Local PrismaClient for direct execution

  seedCourtProviders()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
