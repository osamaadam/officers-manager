import { Router } from "express";
import { initFtpClient } from "../services/ftp";
import { initPrisma } from "../services/prisma";
import multer from "multer";
import { DateTime } from "luxon";
import { Readable, Duplex } from "stream";
import { authenticate } from "../services/auth";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/list", authenticate, async (req, res) => {
  const userPath = req.query.path as string;

  try {
    const ftpClient = await initFtpClient();

    const fileList = await ftpClient.list(userPath);

    res.send(fileList);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/upload", authenticate, upload.single("fax"), async (req, res) => {
  const {
    date,
    description,
    officersInfo = [],
  }: {
    date?: string;
    description?: string;
    officersInfo: {
      officerId: string;
      dueDate: string;
    }[];
  } = req.body;

  const faxBuffer = req.file?.buffer;

  if (!faxBuffer) {
    res.status(400).send("No file provided");
    return;
  }

  const prisma = initPrisma();

  try {
    const createdFax = await prisma.fax.create({
      data: {
        description,
        date: date && DateTime.fromISO(date).toJSDate(),
        OfficersFaxes: {
          createMany: {
            data: officersInfo.map((officerInfo) => ({
              officerId: +officerInfo?.officerId,
              duedate: officerInfo.dueDate,
            })),
          },
        },
      },
      select: {
        id: true,
        date: true,
      },
    });

    const ftpClient = await initFtpClient();

    const ftpDir = `/ftp/faxes/${DateTime.fromJSDate(createdFax.date).toFormat(
      "yyyymmdd"
    )}`;

    await ftpClient.ensureDir(ftpDir);

    const ftpFile = ftpDir + `/${createdFax.id}.pdf`;

    const faxStream = Readable.from(faxBuffer);

    await ftpClient.uploadFrom(faxStream, ftpFile);

    res.send("file uploaded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/download", authenticate, async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).send("No id provided");
    return;
  }

  const prisma = initPrisma();

  try {
    const fax = await prisma.fax.findFirst({
      where: {
        id: +id,
      },
      select: {
        id: true,
        date: true,
        description: true,
      },
    });

    if (!fax) {
      res.status(404).send("Fax not found");
      return;
    }

    const ftpClient = await initFtpClient();

    const ftpDir = `/ftp/faxes/${DateTime.fromJSDate(fax.date).toFormat(
      "yyyymmdd"
    )}`;

    const ftpFile = ftpDir + `/${fax.id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fax.id}.pdf"`
    );

    await ftpClient.downloadTo(res, ftpFile);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

export default router;
