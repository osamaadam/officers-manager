import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import express, { json } from "express";
import expressSession from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import { resolve } from "path";
import initRoutes from "./routes";
import { initPrisma } from "./services/prisma";

import * as dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

const main = async () => {
  const PORT = +(process.env.PORT ?? 4000);

  const app = express();

  app.use(json());
  app.use(cookieParser());
  app.use(
    expressSession({
      secret: process.env.SESSION_SECRET ?? "yo",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new Strategy(async (username, password, done) => {
      const prisma = initPrisma();
      try {
        const user = await prisma.user.findFirstOrThrow({
          where: {
            username,
          },
        });

        if (!user) return done(new Error("User not found"));

        if (!(await bcrypt.compare(password, user.password)))
          return done(new Error("Wrong password"));
        else return done(null, user);
      } catch (err) {
        console.error(err);
        done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    // @ts-ignore
    return done(null, user?.id);
  });

  passport.deserializeUser(async (id, done) => {
    if (!id) return done(new Error("No user id"), null);
    else if (typeof id === "string" || typeof id === "number") {
      const prisma = initPrisma();

      try {
        const user = await prisma.user.findFirstOrThrow({
          where: {
            id: +id,
          },
        });

        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    }
  });

  initRoutes(app);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main();
