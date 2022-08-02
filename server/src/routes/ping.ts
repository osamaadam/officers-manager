import { Router } from "express";

const route = Router();

route.get("/", (req, res) => {
  const curDate = new Date();
  res.send(`PONG! - ${curDate.toISOString()}`);
});

export default route;
