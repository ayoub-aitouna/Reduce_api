var nodemailer = require("nodemailer");
require("dotenv");
const Log = require("../log");
const { EmailTemplate } = require("./Templates.js");

const SendMail_to_partner = async ({ subject, to, text }, PartnerData) => {
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


const sendEmail = async ({ subject, to, text, html }) => {
	var transporter = nodemailer.createTransport({
		host: "merybtk.xyz",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: "reduct@merybtk.xyz",
			pass: "Workhard93@",
		},
	});

	var mailOptions = {
		from: "reduct@merybtk.xyz",
		to: to,
		subject: subject,
		text: text,
		html: html,
	};

	return await new Promise((resolve, reject) => {
		// verify connection configuration
		transporter.verify(function (error, success) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log("Server is ready to take our messages");
				resolve(new Promise((res, rej) => {
					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							rej(error);
						} else {
							Log.info("Email sent: " + info.response);
							res(info.response);
						}
					});
				}));
			}
		});
	});
};

module.exports = { SendMail_to_partner, sendEmail };
