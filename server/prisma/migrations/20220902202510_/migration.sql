/*
  Warnings:

  - You are about to drop the column `elhaaDescription` on the `Officer` table. All the data in the column will be lost.
  - You are about to drop the column `elhaaEnddate` on the `Officer` table. All the data in the column will be lost.
  - You are about to drop the column `elhaaStartdate` on the `Officer` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Officer` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Officer` table. All the data in the column will be lost.
  - You are about to drop the column `weapon` on the `Officer` table. All the data in the column will be lost.
  - Added the required column `rankId` to the `Officer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weaponId` to the `Officer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ElhaaDestination" AS ENUM ('WESTARMY', 'FERKA', 'PEACEKEEPING', 'HAYAKAREMA', 'OTHER');

-- CreateEnum
CREATE TYPE "AbsenceType" AS ENUM ('VACATION', 'MISSION', 'VACATIONPLUSMISSION', 'SICK', 'DAWRAHATMEYA', 'DAWRATALEMEYA', 'OTHER');

-- AlterTable
ALTER TABLE "Fax" ADD COLUMN     "elhaaId" INTEGER;

-- AlterTable
ALTER TABLE "Officer" DROP COLUMN "elhaaDescription",
DROP COLUMN "elhaaEnddate",
DROP COLUMN "elhaaStartdate",
DROP COLUMN "position",
DROP COLUMN "rank",
DROP COLUMN "weapon",
ADD COLUMN     "elhaaId" INTEGER,
ADD COLUMN     "numOfChildren" INTEGER,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "rankId" INTEGER NOT NULL,
ADD COLUMN     "weaponId" INTEGER NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Rank" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weapon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Absence" (
    "id" SERIAL NOT NULL,
    "absenceType" "AbsenceType" NOT NULL DEFAULT 'VACATION',
    "officerId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Elhaa" (
    "id" SERIAL NOT NULL,
    "type" "ElhaaDestination" NOT NULL,
    "notes" TEXT,
    "startdate" TIMESTAMP(3) NOT NULL,
    "enddate" TIMESTAMP(3),
    "faxId" INTEGER,

    CONSTRAINT "Elhaa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rank_name_key" ON "Rank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_name_key" ON "Weapon"("name");

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_elhaaId_fkey" FOREIGN KEY ("elhaaId") REFERENCES "Elhaa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fax" ADD CONSTRAINT "Fax_elhaaId_fkey" FOREIGN KEY ("elhaaId") REFERENCES "Elhaa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
