const nodemailer = require("nodemailer");
const querystring = require("querystring");

exports.handler = async (event) => {
  try {
    const data = querystring.parse(event.body || "");
    const to = data.email;
    const name = data.full_name || "there";

    if (!to) return { statusCode: 400, body: "Missing email" };

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,      // mail.privateemail.com
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,    // contact@vaultaracapital.com
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `Vaultara Capital <${process.env.SMTP_USER}>`,
      to,
      subject: "Application Received – Vaultara Capital",
      text: `Hello ${name},

We received your application. Vaultara Capital will review it and contact you by email as soon as possible.

Vaultara Capital
(800) 827-9016
contact@vaultaracapital.com`
    });

    return {
      statusCode: 302,
      headers: { Location: "/#apply" },
      body: ""
    };
  } catch (e) {
    return { statusCode: 500, body: "Email failed: " + e.message };
  }
};
