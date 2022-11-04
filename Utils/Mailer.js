var nodemailer = require("nodemailer");
require("dotenv");
const Log = require("../log");
const { EmailTemplate } = require("./Templates.js");
const SendMail_to_partner = ({ subject, to, text }, PartnerData) => {
  return new Promise((res, rej) => {
    var transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });

    var mailOptions = {
      from: process.env.MAILER_USER,
      to: to,
      subject: subject,
      text: text,
      html: EmailTemplate(PartnerData),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        rej(error);
      } else {
        Log.info("Email sent: " + info.response);
        res(info.response);
      }
    });
  });
};
const sendEmail = ({ subject, to, text, html }) => {
  return new Promise((res, rej) => {
    var transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });

    var mailOptions = {
      from: process.env.MAILER_USER,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        rej(error);
      } else {
        Log.info("Email sent: " + info.response);
        res(info.response);
      }
    });
  });
};

module.exports = { SendMail_to_partner, sendEmail };
