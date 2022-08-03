-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Officer" (
    "id" SERIAL NOT NULL,
    "aqdameya" INTEGER,
    "repetition" INTEGER NOT NULL DEFAULT 0,
    "militaryNo" INTEGER,
    "dofaa" TEXT,
    "rank" TEXT NOT NULL,
    "weapon" TEXT,
    "position" TEXT,
    "unitId" INTEGER NOT NULL,
    "birthdate" TIMESTAMP(3),
    "workdate" TIMESTAMP(3),
    "promotiondate" TIMESTAMP(3),
    "nationalNo" TEXT,
    "address" TEXT NOT NULL,
    "maritalStatus" "MaritalStatus",
    "elhaa" TEXT,
    "elhaaDescription" TEXT,
    "elhaaStartdate" TIMESTAMP(3),
    "elhaaEnddate" TIMESTAMP(3),
    "length" INTEGER,
    "weight" INTEGER,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "officerId" INTEGER NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
