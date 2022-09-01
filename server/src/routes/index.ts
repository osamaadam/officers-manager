import { Express } from "express";
import pingRoute from "./ping";
import userRoute from "./user";
import faxRoute from "./fax";

const initRoutes = (app: Express) => {
  app.use("/ping", pingRoute);
  app.use("/user", userRoute);
  app.use("/fax", faxRoute);

  return app;
};

export default initRoutes;
