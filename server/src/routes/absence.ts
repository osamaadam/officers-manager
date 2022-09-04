import { AbsenceType } from "@prisma/client";
import { Router } from "express";
import { winLogger } from "../helpers/logger";
import { authenticate } from "../services/auth";
import { initPrisma } from "../services/prisma";

const router = Router();
const logger = winLogger();

router.get("/", authenticate, async (req, res) => {
  const query: {
    officerId?: string;
    id?: string;
  } = req.query;

  if (!query.id && !query.officerId) {
    res.status(400).send("id is required");
    return;
  }

  const prisma = initPrisma();

  try {
    const absence = await prisma.absence.findMany({
      where: {
        officerId: query.officerId ? +query.officerId : undefined,
        id: query.id ? +query.id : undefined,
      },
      include: {
        officer: true,
      },
      orderBy: [{ startDate: "desc" }, { endDate: "desc" }],
    });

    res.send(absence);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

router.post("/insert", authenticate, async (req, res) => {
  const absence: {
    officerId: number;
    startDate: string;
    endDate?: string;
    absenceType?: AbsenceType;
  } = req.body;

  if (!absence.officerId || !absence.startDate) {
    res.status(400).send("officerId, and startDate are required");
    return;
  }

  const prisma = initPrisma();
  const user = req.user as { id: number; username: string };

  try {
    const createdAbsence = await prisma.absence.create({
      data: {
        startDate: new Date(absence.startDate),
        endDate: absence.endDate ? new Date(absence.endDate) : undefined,
        absenceType: absence.absenceType,
        officerId: absence.officerId,
        userId: user?.id,
      },
    });

    logger.info(`Absence ${createdAbsence.id} created by ${user.username}`);

    res.status(200).send("Absence created");
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

router.put("/update", authenticate, async (req, res) => {
  const absence: {
    id: number;
    startDate: string;
    endDate?: string;
    absenceType?: AbsenceType;
  } = req.body;

  if (!absence.id) {
    res.status(400).send("id is required");
    return;
  }

  const prisma = initPrisma();
  const user = req.user as { id: number; username: string };

  try {
    const updatedAbsence = await prisma.absence.update({
      where: {
        id: absence.id,
      },
      data: {
        startDate: absence.startDate,
        endDate: absence.endDate,
        absenceType: absence.absenceType,
      },
    });

    logger.info(`Absence ${updatedAbsence.id} updated by ${user.username}`);

    res.status(200).send("Absence updated");
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

export default router;
