-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED');

-- CreateEnum
CREATE TYPE "ElhaaDestination" AS ENUM ('WESTARMY', 'FERKA', 'PEACEKEEPING', 'HAYAKAREMA', 'OTHER');

-- CreateEnum
CREATE TYPE "AbsenceType" AS ENUM ('VACATION', 'MISSION', 'VACATIONEXTENSION', 'MISSIONEXTENSION', 'VACATIONPLUSMISSION', 'VACATIONPLUSMISSIONEXTENSION', 'SICK', 'TRAVELING', 'DAWRAHATMEYA', 'DAWRATALEMEYA', 'OTHER');

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
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "aqdameya" INTEGER,
    "repetition" INTEGER NOT NULL DEFAULT 0,
    "profession" TEXT,
    "militaryNo" INTEGER,
    "dofaa" TEXT,
    "rankId" INTEGER NOT NULL,
    "weaponId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "birthdate" TIMESTAMP(3),
    "workdate" TIMESTAMP(3),
    "promotiondate" TIMESTAMP(3),
    "nationalNo" TEXT,
    "address" TEXT,
    "maritalStatus" "MaritalStatus",
    "numOfChildren" INTEGER,
    "length" INTEGER,
    "weight" INTEGER,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Fax" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "uploaderId" INTEGER NOT NULL,
    "archivedate" TIMESTAMP(3),
    "archiverId" INTEGER,
    "elhaaId" INTEGER,

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
    "destination" "ElhaaDestination" NOT NULL,
    "notes" TEXT,
    "startdate" TIMESTAMP(3) NOT NULL,
    "enddate" TIMESTAMP(3),
    "faxId" INTEGER,
    "officerId" INTEGER NOT NULL,

    CONSTRAINT "Elhaa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Rank_name_key" ON "Rank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_name_key" ON "Weapon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Phone_officerId_number_key" ON "Phone"("officerId", "number");

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Officer" ADD CONSTRAINT "Officer_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fax" ADD CONSTRAINT "Fax_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fax" ADD CONSTRAINT "Fax_archiverId_fkey" FOREIGN KEY ("archiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fax" ADD CONSTRAINT "Fax_elhaaId_fkey" FOREIGN KEY ("elhaaId") REFERENCES "Elhaa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elhaa" ADD CONSTRAINT "Elhaa_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
