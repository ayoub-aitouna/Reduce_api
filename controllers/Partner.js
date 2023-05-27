const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
const { Encrypte, compare, cipher } = require("../Utils/Crypto");
const { BadRequestError } = require("../errors/index.js");
require("dotenv").config();

const partner_feilds = `partner.id,
    avatar_Url,
    img_cover_Url as cover,
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
	partner.lat,
	partner.longitude,
	rating,
	adrress,
	partner.created_date,
	ville_name,
	activity_name`;


const get_parner_data = async (req, res, next) => {
	const { id } = req.user;
	const { isMian } = req.query;
	if (isMian !== 'true') return next();
	const partner = SqlQuery(`select ${partner_feilds}
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
		sub_partner_data.qr_code = cipher(JSON.stringify({ id: sub_partner_data.id, is_main: false }));
	} catch (err) {
		throw new BadRequestError(`error generating qr code key for partner ${id} : err : ${err} `);
	}
	res.json(sub_partner_data);
};

const locate = async (req, res) => {
	const { id } = req.user;
	const { lat, long } = req.body;
	const updateSql = `UPDATE partner SET lat = ${lat}, longitude = ${long} WHERE id = ${id}`;
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
	const Query = `SELECT ${partner_feilds}
    	from partner inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id
		where ville = ${ville}
		ORDER BY created_date DESC LIMIT 25 `;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError(partners.data.err.message);
	res.send(partners.data.rows);
}

const suggestions = (req, res) => {
	const { ville, needle } = req.query;
	const Query = `SELECT ${partner_feilds}
    	from partner inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id
		where ville = ${ville} AND  nome_entreprise LIKE '${needle}%'
		ORDER BY created_date DESC LIMIT 5 `;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError(partners.data.err.sqlMessage);
	res.send(partners.data.rows);
}

const get_recomandation = (req, res) => {
	const { ville } = req.query;
	const Query = `SELECT ${partner_feilds}
    	from partner inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id
		where activity_name = 'medical' AND ville = ${ville}
		ORDER BY created_date DESC LIMIT 25 `;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError(`${partners.data.err.sqlMessage}`);
	res.send(partners.data.rows);
}

const get_partners = (req, res) => {
	const { activity, ville } = req.query;
	let query_selection = activity !== undefined ? `AND activity_entrprise = ${activity}` : '';
	const Query = `select  ${partner_feilds}
    	from partner inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id
    	where ville = ${ville} ${query_selection} 
    	ORDER BY id DESC `;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError(`${partners.data.err.sqlMessage}`);
	res.send(partners.data.rows);
}

const history = async (req, res) => {
	const { id } = req.user;
	try {
		let rows = await SqlQuery(`SELECT
		        scan_hsitory.partner_id,
		        scan_hsitory.sub_partner_id,
		        scan_hsitory.client_id,
		        scan_hsitory.statut,
		        scan_hsitory.product,
		        scan_hsitory.scan_time,
		        scan_hsitory.created_date,
		        client.full_name as client_name
		        FROM scan_hsitory
		        INNER JOIN client
		            on scan_hsitory.client_id = client.id
	    	    WHERE scan_hsitory.partner_id = ${id}`);
		if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
		rows = rows.data.rows
		if (rows.length === 0)
			return res.status(404).json({ msg: "no partner history" });
		res.status(200).json(rows);
	} catch (err) {
		res.status(500).json({ err: err });
	}
}


const Admin_get_history = async (req, res) => {
	const id = req.params.id;
	try {
		let rows = await SqlQuery(`SELECT
		        scan_hsitory.partner_id,
		        scan_hsitory.sub_partner_id,
		        scan_hsitory.client_id,
		        scan_hsitory.statut,
		        scan_hsitory.product,
		        scan_hsitory.scan_time,
		        scan_hsitory.created_date,
		        client.full_name as client_name
		        FROM scan_hsitory
		        INNER JOIN client
		            on scan_hsitory.client_id = client.id
	    	    WHERE scan_hsitory.partner_id = ${id}`);
		if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
		rows = rows.data.rows
		if (rows.length === 0)
			return res.status(404).json({ msg: "no partner history" });
		res.status(200).json(rows);
	} catch (err) {
		res.status(500).json({ err: err });
	}
}


module.exports = {
	get_parner_data,
	get_sub,
	change_password,
	history,
	locate,
	get_partners,
	get_recomandation,
	get_recent_partners,
	suggestions,
	Admin_get_history
};
