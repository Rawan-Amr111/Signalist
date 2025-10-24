import {
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./template";
import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});
interface NewsSummaryEmailData {
  email: string;
  date: string;
  newsContent: string;
}
export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro
  );
  const mailOptions = {
    from: `"signalist" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: "Welcome to Signalist",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: NewsSummaryEmailData) => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
    "{{date}}",
    date
  ).replace("{{newsContent}}", newsContent);

  const mailOptions = {
    from: `"Signalist News" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: `Market News Summary Today - ${date}`,
    html: htmlTemplate,
    text: "Today's market news summary from Signalist.", // Text fallback
  };

  await transporter.sendMail(mailOptions);
};
