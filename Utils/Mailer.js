var nodemailer = require("nodemailer");
require("dotenv");
const Log = require("../log");
const { EmailTemplate } = require("./Templates.js");

const SendMail_to_partner = ({ subject, to, PartnerData }) => {
  return new Promise((res, rej) => {
    var transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASS,
      },
    });

    var mailOptions = {
      from: process.env.MAILER_EMAIL,
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

module.exports = { SendMail_to_partner };
