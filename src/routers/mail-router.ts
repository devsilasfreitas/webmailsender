import { Router } from "express";
import { MailController } from "../controllers/mail-controller";

const router = Router();

const mailController = new MailController();

router.post("/", (req, res) => mailController.sendMailController(req, res));

export { router as mailRouter };