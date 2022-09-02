/*
  Warnings:

  - A unique constraint covering the columns `[officerId,number]` on the table `Phone` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Phone_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "Phone_officerId_number_key" ON "Phone"("officerId", "number");
