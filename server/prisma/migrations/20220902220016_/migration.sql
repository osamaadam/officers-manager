/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Phone` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Phone_number_key" ON "Phone"("number");
