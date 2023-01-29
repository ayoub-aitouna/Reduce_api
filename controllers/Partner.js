const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
require("dotenv").config();
const Log = require("../log");

function generate_qr_code(partnerData) {
	return new Promise(async (res, rej) => {
		try {
			res(jwt.sign(
				partnerData,
				process.env.ACCESS_TOKEN_SECRET
			))
		} catch (err) {
			rej(err);
		}
	});
}

const get_parner_data = async (req, res) => {
	const { id } = req.user;
	const partner = SqlQuery(`select * from partner inner join villes on
  		villes.id = partner.ville INNER JOIN entrprise_activities on
		entrprise_activities.id = partner.activity_entrprise where partner.id = ${id}`);
	if (!partner.success)
		throw BadRequestError(`couldn't retrive partner with this id ${id}`);
	if (partner.data.rows.length == 0)
		return res.status(404).send({ msg: `there is no partner with id ${id}` });
	const partnerData = partner.data.rows[0];
	// Add the new property here
	try {
		partnerData.qr_code = await generate_qr_code(partnerData);
	} catch (err) {
		throw BadRequestError(`error generating qr code key for partner ${id}`);
	}
	res.json(partnerData);
};

module.exports = { get_parner_data };
