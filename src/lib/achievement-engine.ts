import { prisma } from './prisma';
import { User } from '@prisma/client';

export const achievementEngine = {
  async checkAndAward(userId: string, event: 'booking_confirmed' | 'match_won') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: { where: { status: 'CONFIRMED' } },
        matches: { include: { match: true } },
        achievements: true,
      },
    });

    if (!user) return;

    const allAchievements = await prisma.achievement.findMany();

    for (const achievement of allAchievements) {
      const criteria = achievement.criteria as any;
      if (criteria.type !== event) continue;

      const hasAchievement = user.achievements.some(a => a.achievementId === achievement.id);
      if (hasAchievement) continue;

      let shouldAward = false;
      switch (achievement.name) {
        case 'First Booking':
          if (user.bookings.length >= 1) {
            shouldAward = true;
          }
          break;
        case 'Weekend Warrior':
          const weekendBookings = user.bookings.filter(b => {
            const day = new Date(b.startTime).getDay();
            return day === 0 || day === 6; // Sunday or Saturday
          }).length;
          if (weekendBookings >= 5) {
            shouldAward = true;
          }
          break;
        case 'First Win':
          const wins = user.matches.filter(
            m => m.team === m.match.winnerTeam
          ).length;
          if (wins >= 1) {
            shouldAward = true;
          }
          break;
      }

      if (shouldAward) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });
      }
    }
  },
};
