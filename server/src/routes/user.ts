import bcrypt from "bcrypt";
import { Router } from "express";
import passport from "passport";
import { winLogger } from "../helpers/logger";
import { initPrisma } from "../services/prisma";

const router = Router();
const logger = winLogger();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const prisma = initPrisma();

    const createdUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    logger.info(`User ${createdUser.username} created`);

    res.status(200).send("User created");
  } catch (err) {
    logger.error(err);
    res.status(500).send(err);
  }
});

router.post(
  "/login",
  passport.authenticate("local"),
  async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send("Username and password are required");
      return;
    }

    try {
      const prisma = initPrisma();

      const user = await prisma.user.findFirst({
        where: {
          username,
        },
        select: {
          username: true,
          password: true,
        },
      });

      if (!user) {
        res.status(400).send("User not found");
        return;
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        res.status(400).send("Invalid password");
        return;
      }

      logger.info(`User ${user.username} logged in`);

      req.session.save((err) => {
        if (err) next(err);
        res.status(200).send("User logged in");
      });
    } catch (err) {
      logger.error(err);
      res.status(500).send(err);
    }
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error(err);
      res.status(500).send(err);
    } else {
      res.status(200).send("User logged out");
    }
  });
});

export default router;
