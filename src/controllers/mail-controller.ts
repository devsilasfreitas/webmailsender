import { Request, Response } from "express";
import { MailModel } from "../models/mail-model";

export class MailController {
  private mailModel: MailModel;

  constructor () {
    this.mailModel = new MailModel();
  };

  async sendMailController (req: Request, res: Response) {
    try {
      const { credentialType, credentials, mailOptions } = req.body;

      await this.mailModel.sendMail({
        credentialType,
        credentials,
        mailOptions,
      });

      res.status(201).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email", error });
    }
  }
}