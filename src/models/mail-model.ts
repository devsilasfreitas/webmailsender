import { config } from "dotenv";
import { google } from "googleapis";
import nodemailer from "nodemailer";
config();

interface SendMailProps {
  credentialType: "password" | "oauth2";
  credentials: SendMailProps["credentialType"] extends "password" ? {
    user: string;
    pass: string;
  } : {
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
  mailOptions: {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  };
};

export class MailModel {
  constructor () {};

  async sendMail (props: SendMailProps) {
    const { credentialType, mailOptions } = props;

    console.log(props)

    const transporter = nodemailer.createTransport({
      // @ts-ignore
      service: "gmail",
      auth: credentialType === "password" ? {
        user: props.credentials.user,
        pass: (props.credentials as any).pass,
      } : await getGoogleCredentials({
        user: props.credentials.user,
        clientId: props.credentials.clientId,
        clientSecret: props.credentials.clientSecret,
        refreshToken: props.credentials.refreshToken,
      })
    });

    const info = await transporter.sendMail({
      from: `"${mailOptions.from}" <${props.credentials.user}>`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    });

    console.log("Message sent: %s", info.messageId);
  }
}

async function getGoogleCredentials(credentials: { user: string; clientId: string; clientSecret: string; refreshToken: string; }) {
  const oAuth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    "https://developers.google.com/oauthplayground"
  );
  oAuth2Client.setCredentials({
    refresh_token: credentials.refreshToken
  });

  const accessToken = await oAuth2Client.getAccessToken();

  return {
    type: "OAuth2",
    user: credentials.user,
    clientId: credentials.clientId,
    clientSecret: credentials.clientSecret,
    refreshToken: credentials.refreshToken,
    accessToken,
  }
}