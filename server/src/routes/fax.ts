import { Router } from "express";
import { initPrisma } from "../services/prisma";
import { authenticate } from "../services/auth";

const router = Router();

router.post("/create-appointments", authenticate, async (req, res) => {
  const {
    appointments,
  }: {
    appointments: {
      officerId: string | number;
      faxId: string | number;
      dueDate: string;
      notes?: string;
    }[];
  } = req.body;

  const user = req.user as { id: number; username: string };

  appointments.forEach((app) => {
    if (!app.officerId || !app.faxId || !app.dueDate) {
      res.status(400).send("Invalid appointment");
      return;
    }
  });

  const prisma = initPrisma();

  try {
    const createdAppointments = await prisma.officersFaxes.createMany({
      data: appointments.map((appointment) => ({
        officerId: +appointment.officerId,
        faxId: +appointment.faxId,
        duedate: appointment.dueDate,
        notes: appointment.notes,
        user: {
          connect: {
            id: user.id,
          },
        },
      })),
    });

    res.send(createdAppointments);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/inform", authenticate, async (req, res) => {
  const {
    faxId,
    officerId,
  }: {
    faxId: string | number;
    officerId: string | number;
  } = req.body;

  const user = req.user as { id: number; username: string };

  const prisma = initPrisma();

  try {
    const updatedAppointment = await prisma.officersFaxes.update({
      where: {
        officerId_faxId: {
          faxId: +faxId,
          officerId: +officerId,
        },
      },
      data: {
        informdate: new Date(),
        informer: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    res.send(updatedAppointment);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/followup", authenticate, async (req, res) => {
  const {
    faxId,
    officerId,
  }: {
    faxId: string | number;
    officerId: string | number;
  } = req.body;

  const user = req.user as { id: number; username: string };

  const prisma = initPrisma();

  try {
    const updatedAppointment = await prisma.officersFaxes.update({
      where: {
        officerId_faxId: {
          faxId: +faxId,
          officerId: +officerId,
        },
      },
      data: {
        followupdate: new Date(),
        followupUser: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    res.send(updatedAppointment);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/archive", authenticate, async (req, res) => {
  const { faxId }: { faxId: string | number } = req.body;

  const user = req.user as { id: number; username: string };

  const prisma = initPrisma();

  try {
    const archivedFax = await prisma.fax.update({
      where: {
        id: +faxId,
      },
      data: {
        archivedate: new Date(),
        archiver: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    res.send(archivedFax);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
