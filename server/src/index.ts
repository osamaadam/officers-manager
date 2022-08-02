import express, { json } from "express";
import initRoutes from "./routes";
import { initFtpClient } from "./services/ftp";

const main = async () => {
  const PORT = process.env.PORT ?? 4000;

  const ftpClient = await initFtpClient({
    host: "localhost",
    user: "adam",
    password: "12345",
    port: 21,
  });

  const secondClient = await initFtpClient();

  const app = express();

  app.use(json());

  initRoutes(app);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main();
