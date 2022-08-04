/*
  Warnings:

  - Added the required column `name` to the `Officer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedName` to the `Officer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Officer" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "normalizedName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Fax" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "archivedate" TIMESTAMP(3),
    "archiverId" INTEGER,

    CONSTRAINT "Fax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficersFaxes" (
    "officerId" INTEGER NOT NULL,
    "faxId" INTEGER NOT NULL,
    "duedate" TIMESTAMP(3),
    "informdate" TIMESTAMP(3),
    "informerId" INTEGER,
    "followupdate" TIMESTAMP(3),
    "followupUserId" INTEGER,
    "notes" TEXT,
    "userId" INTEGER,

    CONSTRAINT "OfficersFaxes_pkey" PRIMARY KEY ("officerId","faxId")
);

-- AddForeignKey
ALTER TABLE "Fax" ADD CONSTRAINT "Fax_archiverId_fkey" FOREIGN KEY ("archiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficersFaxes" ADD CONSTRAINT "OfficersFaxes_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficersFaxes" ADD CONSTRAINT "OfficersFaxes_faxId_fkey" FOREIGN KEY ("faxId") REFERENCES "Fax"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficersFaxes" ADD CONSTRAINT "OfficersFaxes_informerId_fkey" FOREIGN KEY ("informerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficersFaxes" ADD CONSTRAINT "OfficersFaxes_followupUserId_fkey" FOREIGN KEY ("followupUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficersFaxes" ADD CONSTRAINT "OfficersFaxes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
