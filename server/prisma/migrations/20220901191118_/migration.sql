/*
  Warnings:

  - Added the required column `uploaderId` to the `Fax` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fax" ADD COLUMN     "uploaderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Fax" ADD CONSTRAINT "Fax_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
