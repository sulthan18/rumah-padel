/*
  Warnings:

  - Added the required column `courtProviderId` to the `Court` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Court" ADD COLUMN     "courtProviderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "courtProviderId" TEXT;

-- CreateTable
CREATE TABLE "CourtProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourtProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourtProvider_name_key" ON "CourtProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CourtProvider_contactEmail_key" ON "CourtProvider"("contactEmail");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_courtProviderId_fkey" FOREIGN KEY ("courtProviderId") REFERENCES "CourtProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Court" ADD CONSTRAINT "Court_courtProviderId_fkey" FOREIGN KEY ("courtProviderId") REFERENCES "CourtProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
