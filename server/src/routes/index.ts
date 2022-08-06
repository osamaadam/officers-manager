import { Express } from "express";
import pingRoute from "./ping";
import ftpRoute from "./ftp";
import userRoute from "./user";
import faxRoute from "./fax";

const initRoutes = (app: Express) => {
  app.use("/ping", pingRoute);
  app.use("/ftp", ftpRoute);
  app.use("/user", userRoute);
  app.use("/fax", faxRoute);

  return app;
};

export default initRoutes;
