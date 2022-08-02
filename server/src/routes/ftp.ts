import { Router } from "express";
import { initFtpClient } from "../services/ftp";

const router = Router();

router.get("/list", async (req, res) => {
  const userPath = req.query.path as string;

  try {
    const ftpClient = await initFtpClient();

    const fileList = await ftpClient.list(userPath);

    res.send(fileList);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
