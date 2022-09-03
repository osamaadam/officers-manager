import { MaritalStatus } from "@prisma/client";
import { Router } from "express";
import { winLogger } from "../helpers/logger";
import { normalizeArabic } from "../helpers/normalizeArabic";
import { validatePhoneNumber } from "../helpers/validatePhoneNumber";
import { authenticate } from "../services/auth";
import { initPrisma } from "../services/prisma";

const router = Router();
const logger = winLogger();

router.get("/", authenticate, async (req, res) => {
  const query: {
    id?: string;
    name?: string;
  } = req.query;

  const prisma = initPrisma();

  const normalizedName = normalizeArabic(query.name ?? "");

  try {
    const officers = await prisma.officer.findMany({
      where: {
        id: query.id ? +query.id : undefined,
        normalizedName: {
          contains: normalizedName,
        },
      },
      include: {
        unit: true,
        rank: true,
        phone: true,
        weapon: true,
      },
    });

    res.send(officers);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

router.post("/insert", authenticate, async (req, res) => {
  let officer: {
    name: string;
    unitId: number;
    rankId: number;
    phoneNumbers?: string[];
    weaponId: number;
    aqdameya?: number;
    profession?: string;
    militaryNo?: number;
    dofaa?: string;
    birthdate?: string;
    workdate?: string;
    promotiondate?: string;
    nationalNo?: string;
    address?: string;
    maritalStatus?: MaritalStatus;
    numOfChildren?: number;
    length?: number;
    weight?: number;
  } = req.body;

  if (!officer) {
    res.status(400).send("no officer provided");
    return;
  } else if (
    !officer.name ||
    !officer.unitId ||
    !officer.rankId ||
    !officer.weaponId
  ) {
    res.status(400).send("missing required fields");
    return;
  }

  const prisma = initPrisma();
  const normalizedName = normalizeArabic(officer.name);
  const phoneNumbers =
    officer.phoneNumbers
      ?.map((phoneNumber) => validatePhoneNumber(phoneNumber))
      .filter((phone) => phone.length) ?? [];

  officer.phoneNumbers = undefined;

  try {
    const insertedOfficer = await prisma.officer.create({
      data: {
        ...officer,
        normalizedName,
        phone: {
          createMany: {
            data: phoneNumbers.map((phoneNumber) => ({
              number: phoneNumber,
            })),
            skipDuplicates: true,
          },
        },
      },
    });

    res.send(insertedOfficer);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

router.put("/update", authenticate, async (req, res) => {
  let officer: {
    id: number;
    name?: string;
    unitId?: number;
    rankId?: number;
    weaponId: number;
    aqdameya?: number;
    profession?: string;
    militaryNo?: number;
    dofaa?: string;
    birthdate?: string;
    workdate?: string;
    promotiondate?: string;
    nationalNo?: string;
    address?: string;
    maritalStatus?: MaritalStatus;
    numOfChildren?: number;
    length?: number;
    weight?: number;
  } = req.body;

  if (!officer.id) {
    res.status(400).send("id not provided");
    return;
  }

  const prisma = initPrisma();

  try {
    const updatedOfficer = await prisma.officer.update({
      where: { id: officer.id },
      data: {
        ...officer,
        normalizedName: officer.name
          ? normalizeArabic(officer.name)
          : undefined,
      },
    });

    res.send(updatedOfficer);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

router.put("/add-phone", authenticate, async (req, res) => {
  const {
    id,
    phoneNumbers,
  }: {
    id: number;
    phoneNumbers: string[];
  } = req.body;

  const validatedPhoneNumbers = phoneNumbers
    .map((phoneNumber) => validatePhoneNumber(phoneNumber))
    .filter((phone) => phone.length);

  if (!id || !validatedPhoneNumbers?.length) {
    res.status(400).send("missing required fields");
    return;
  }

  const prisma = initPrisma();

  try {
    const updatedOfficer = await prisma.officer.update({
      where: { id },
      data: {
        phone: {
          createMany: {
            data: validatedPhoneNumbers.map((phoneNumber) => ({
              number: phoneNumber,
            })),
            skipDuplicates: true,
          },
        },
      },
    });

    res.send(updatedOfficer);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

router.delete("/delete-phone", authenticate, async (req, res) => {
  const { id, phoneNumbers }: { id: number; phoneNumbers: string[] } = req.body;

  const validatedPhoneNumbers = phoneNumbers
    .map((phoneNumber) => validatePhoneNumber(phoneNumber))
    .filter((phone) => phone.length);

  if (!id || !validatedPhoneNumbers?.length) {
    res.status(400).send("missing required fields");
    return;
  }

  const prisma = initPrisma();

  try {
    const deletedPhoneNumbers = await prisma.phone.deleteMany({
      where: {
        AND: {
          number: {
            in: phoneNumbers,
          },
          owner: {
            id,
          },
        },
      },
    });

    res.send(deletedPhoneNumbers);
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

export default router;
