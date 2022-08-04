import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export const initPrisma = () => {
  if (prisma) return prisma;

  prisma = new PrismaClient();
  return prisma;
};
