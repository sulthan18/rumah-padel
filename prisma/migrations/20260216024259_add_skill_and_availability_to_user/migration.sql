-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('GUEST', 'PRO', 'EXCLUSIVE');

-- CreateEnum
CREATE TYPE "CourtType" AS ENUM ('INDOOR', 'OUTDOOR');

-- CreateEnum
CREATE TYPE "CourtSurface" AS ENUM ('GRASS', 'CARPET');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('REGISTRATION', 'ACTIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "TournamentFormat" AS ENUM ('KNOCKOUT', 'ROUND_ROBIN');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "discountApplied" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "originalPrice" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "promoCodeId" TEXT;

-- AlterTable
ALTER TABLE "Court" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "surface" "CourtSurface" NOT NULL DEFAULT 'CARPET',
ADD COLUMN     "type" "CourtType" NOT NULL DEFAULT 'INDOOR';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availability" JSONB,
ADD COLUMN     "membershipExpiresAt" TIMESTAMP(3),
ADD COLUMN     "membershipTier" "MembershipTier" NOT NULL DEFAULT 'GUEST',
ADD COLUMN     "skillLevel" "SkillLevel" NOT NULL DEFAULT 'BEGINNER';

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'REGISTRATION',
    "format" "TournamentFormat" NOT NULL DEFAULT 'KNOCKOUT',
    "price" INTEGER NOT NULL DEFAULT 0,
    "prizePool" TEXT,
    "maxTeams" INTEGER NOT NULL DEFAULT 8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "captainId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TMatch" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "teamAId" TEXT,
    "teamBId" TEXT,
    "winnerId" TEXT,
    "score" TEXT,
    "startTime" TIMESTAMP(3),
    "courtId" TEXT,
    "nextMatchId" TEXT,

    CONSTRAINT "TMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TMatch" ADD CONSTRAINT "TMatch_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "TMatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TMatch" ADD CONSTRAINT "TMatch_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TMatch" ADD CONSTRAINT "TMatch_teamAId_fkey" FOREIGN KEY ("teamAId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TMatch" ADD CONSTRAINT "TMatch_teamBId_fkey" FOREIGN KEY ("teamBId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TMatch" ADD CONSTRAINT "TMatch_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
