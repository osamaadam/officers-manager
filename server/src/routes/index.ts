import { Express } from "express";
import faxRoute from "./fax";
import officerRoute from "./officer";
import pingRoute from "./ping";
import userRoute from "./user";

const initRoutes = (app: Express) => {
  app.use("/ping", pingRoute);
  app.use("/user", userRoute);
  app.use("/fax", faxRoute);
  app.use("/officer", officerRoute);

  return app;
};

export default initRoutes;
