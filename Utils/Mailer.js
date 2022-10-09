var nodemailer = require("nodemailer");
require("dotenv");
const Log = require("../log");
const SendMail = ({ subject, to, text }) => {
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
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			Log.error(error);
		} else {
			Log.info("Email sent: " + info.response);
		}
	});
};

module.exports = { SendMail };
