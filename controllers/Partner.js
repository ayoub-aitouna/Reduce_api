	const { Mysql, Query, SqlQuery } = require("../database/index.js");
	const jwt = require("jsonwebtoken");
	const { client } = require("../database/index.js");
	const { Encrypte, compare } = require("../Utils/Crypto");
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

	const get_parner_data = async (req, res, next) => {
		const { id } = req.user;
		const { isMian } = req.query;
		if (isMian !== 'true') return next();
		const partner = SqlQuery(`select * from partner inner join villes on
			villes.id = partner.ville INNER JOIN entrprise_activities on
			entrprise_activities.id = partner.activity_entrprise where partner.id = ${id}`);
		if (!partner.success)
			throw BadRequestError(`couldn't retrive partner with this id ${id}`);
		if (partner.data.rows.length == 0)
			return res.status(404).send({ msg: `there is no partner with id ${id}` });
		const partnerData = partner.data.rows[0];
		try {
			partnerData.qr_code = await generate_qr_code(partnerData);
		} catch (err) {
			throw BadRequestError(`error generating qr code key for partner ${id}`);
		}
		res.json(partnerData);
	};

	const get_sub = async (req, res) => {
		const { id } = req.user;
		const sql = `SELECT * FROM sub_partner INNER JOIN partner on partner.id = sub_partner.partner_id WHERE sub_partner.id = ${id}`;
		const result = SqlQuery(sql);
		if (!result.success)
			return res.status(500).json({ message: 'Error fetching sub_partner', error: result.error });
		if (result.data.rows.length === 0)
			return res.status(404).json({ message: 'sub_partner not found' });
		const sub_partner_data = result.data.rows[0];
		try {
			sub_partner_data.qr_code = await generate_qr_code(sub_partner_data);
		} catch (err) {
			throw BadRequestError(`error generating qr code key for partner ${id}`);
		}
		res.json(sub_partner_data);
	};

	const change_password = async (req, res) => {
		const { id } = req.user;
		const {old_password, new_password } = req.body;
		const sql = `SELECT _password FROM partner WHERE id = ${id}`;
		const result = SqlQuery(sql);

		if (!result.success) {
			return res.status(500).json({
				message: 'Error fetching partner password',
				error: result.data.err.sqlMessage
			});
		}
		if (
			result.data.rows[0] == undefined ||	
			result.data.rows.length == 0 ||
			!(await compare(old_password, result.data.rows[0]._password))
		) {
			return res.status(401).json({ message: 'Old password does not match' });
		}
		const updateSql = `UPDATE partner SET _password = '${await Encrypte(new_password)}'
		WHERE id = ${id}`;
		const updateResult = SqlQuery(updateSql);
		if (!updateResult.success)
			return res.status(500).json({
				message: 'Error updating partner password',
				error: updateResult.data.err.sqlMessage
			});
		res.status(200).json({
			message: 'partner password updated',
			results: updateResult
		});
	};

	module.exports = { get_parner_data, get_sub, change_password };
