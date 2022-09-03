import { Express } from "express";
import faxRoute from "./fax";
import officerRoute from "./officer";
import pingRoute from "./ping";
import userRoute from "./user";
import absenceRoute from "./absence";

const initRoutes = (app: Express) => {
  app.use("/ping", pingRoute);
  app.use("/user", userRoute);
  app.use("/fax", faxRoute);
  app.use("/officer", officerRoute);
  app.use("/absence", absenceRoute);

  return app;
};

export default initRoutes;
