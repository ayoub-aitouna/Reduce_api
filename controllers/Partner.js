const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
const { Encrypte, compare } = require("../Utils/Crypto");
const crypto = require('crypto');
const { BadRequestError } = require("../errors/index.js");

require("dotenv").config();
const Log = require("../log");

const cipher = (str) => {
	const cipher = crypto.createCipher('aes-256-cbc', process.env.ACCESS_TOKEN_SECRET);
	let encrypted = cipher.update(str, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return (encrypted);
}

const get_parner_data = async (req, res, next) => {
	const { id } = req.user;
	const { isMian } = req.query;
	if (isMian !== 'true') return next();
	const partner = SqlQuery(`select  partner.id,
        avatar_Url,
        email,
        nome_entreprise,
        identificateur_entreprise,
        representant_entreprise,
        role_dans_entriprise,
        numero_telephone,
        numero_telephone_fix,
        ville,
        activity_entrprise,
        offer,
        _status,
        note,
        adrress,
        partner.created_date,
        ville_name,
        activity_name
		from partner inner join villes on
		villes.id = partner.ville INNER JOIN entrprise_activities on
		entrprise_activities.id = partner.activity_entrprise where partner.id = ${id}`);
	if (!partner.success)
		throw new BadRequestError(`couldn't retrive partner with this id ${id} : ${partner.data.err.sqlMessage}`);
	if (partner.data.rows.length == 0)
		return res.status(404).send({ msg: `there is no partner with id ${id}` });
	const partnerData = partner.data.rows[0];
	try {
		const obj = { id: id, is_main: isMian };
		partnerData.qr_code = cipher(JSON.stringify(obj));
	} catch (err) {
		throw new BadRequestError(`error generating qr code key for partner : ${err}`);
	}
	res.json(partnerData);
};

const get_sub = async (req, res) => {
	const { id } = req.user;
	const sql = `SELECT sub_partner.id, partner.nome_entreprise, 
				sub_partner.sub_partner_Name as representant_entreprise,
				partner.role_dans_entriprise, partner.identificateur_entreprise,
				partner.adrress, partner.numero_telephone, partner.numero_telephone_fix,
				sub_partner.email, partner.offer, partner.avatar_Url, partner.img_cover_Url,
				sub_partner._status
				FROM sub_partner INNER JOIN partner on partner.id = sub_partner.partner_id
				WHERE sub_partner.id =${id}`;
	const result = SqlQuery(sql);
	if (!result.success)
		return res.status(500).json({ message: 'Error fetching sub_partner', error: result.error });
	if (result.data.rows.length === 0)
		return res.status(404).json({ message: 'sub_partner not found' });
	const sub_partner_data = result.data.rows[0];
	try {
		partnerData.qr_code = cipher(JSON.stringify({ id: sub_partner_data.id, is_main: false }));
	} catch (err) {
		throw BadRequestError(`error generating qr code key for partner ${id}`);
	}
	res.json(sub_partner_data);
};

const locate = async (req, res) => {
	const { id } = req.user;
	const { lat, long } = req.body;
	const updateSql = `UPDATE partner SET lat = ${lat}, long = ${long} WHERE id = ${id}`;
	const updateResult = SqlQuery(updateSql);
	if (!updateResult.success)
		return res.status(500).json({
			message: 'Error updating partner location',
			error: updateResult.data.err.sqlMessage
		});
	res.status(200).json({
		message: 'partner location updated',
		results: updateResult
	});
}

const change_password = async (req, res) => {
	const { id } = req.user;
	const { old_password, new_password } = req.body;
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

const get_recent_partners = (req, res) => {
	const { ville } = req.query;
	const Query = `SELECT partner.id,
        avatar_Url,
        email,
        nome_entreprise,
        identificateur_entreprise,
        representant_entreprise,
        role_dans_entriprise,
        numero_telephone,
        numero_telephone_fix,
        ville,
        activity_entrprise,
        offer,
        _status,
        note,
        adrress,
        partner.created_date,
        ville_name,
        activity_name
    	from partner inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id
		where ville = ${ville}
		ORDER BY created_date DESC LIMIT 25 `;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError(partners.data.err.message);
	console.log(partners.data.rows);
	res.send(partners.data.rows);
}

const get_recomandation = (req, res) => {
	const { ville } = req.query;
	const Query = `SELECT partner.id,
        avatar_Url,
        email,
        nome_entreprise,
        identificateur_entreprise,
        representant_entreprise,
        role_dans_entriprise,
        numero_telephone,
        numero_telephone_fix,
        ville,
        activity_entrprise,
        offer,
        _status,
        note,
        adrress,
        partner.created_date,
        ville_name,
        activity_name
    	from partner inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id
		where activity_name = 'medical' AND ville = ${ville}
		ORDER BY created_date DESC LIMIT 25 `;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError(`${partners.data.err.sqlMessage}`);
	console.log(partners.data.rows);
	res.send(partners.data.rows);
}

const get_partners = (req, res) => {
	const { activity, ville } = req.query;
	const Query = `select   partner.id,
        avatar_Url,
        email,
        nome_entreprise,
        identificateur_entreprise,
        representant_entreprise,
        role_dans_entriprise,
        numero_telephone,
        numero_telephone_fix,
        ville,
        activity_entrprise,
        offer,
        _status,
        note,
        adrress,
        partner.created_date,
        ville_name,
        activity_name
    	from partner inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id
    	where ville = ${ville} AND activity_entrprise = ${activity}
    	ORDER BY id DESC `;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError(`${partners.data.err.sqlMessage}`);
	console.log(partners.data.rows);
	res.send(partners.data.rows);
}

const history = async (req, res) => {
	const { id } = req.user;
	try {
		let rows = await SqlQuery(`SELECT * FROM scan_hsitory WHERE partner_id = ${id}`);
		if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
		rows = rows.data.rows
		if (rows.length === 0)
			return res.status(404).json({ msg: "no partner history" });
		res.status(200).json(rows);
	} catch (err) {
		res.status(500).json({ err: err });
	}
}

module.exports = { get_parner_data, get_sub, change_password, history, locate, get_partners, get_recomandation, get_recent_partners };
