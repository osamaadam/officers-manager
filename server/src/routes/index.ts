import { Express } from "express";
import pingRoute from "./ping";
import ftpRoute from "./ftp";

const initRoutes = (app: Express) => {
  app.use("/ping", pingRoute);
  app.use("/ftp", ftpRoute);

  return app;
};

export default initRoutes;
