/*
  Warnings:

  - You are about to drop the column `type` on the `Elhaa` table. All the data in the column will be lost.
  - You are about to drop the column `elhaa` on the `Officer` table. All the data in the column will be lost.
  - You are about to drop the column `elhaaId` on the `Officer` table. All the data in the column will be lost.
  - Added the required column `destination` to the `Elhaa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officerId` to the `Elhaa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AbsenceType" ADD VALUE 'TRAVELING';

-- DropForeignKey
ALTER TABLE "Officer" DROP CONSTRAINT "Officer_elhaaId_fkey";

-- AlterTable
ALTER TABLE "Elhaa" DROP COLUMN "type",
ADD COLUMN     "destination" "ElhaaDestination" NOT NULL,
ADD COLUMN     "officerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Officer" DROP COLUMN "elhaa",
DROP COLUMN "elhaaId";

-- AddForeignKey
ALTER TABLE "Elhaa" ADD CONSTRAINT "Elhaa_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
