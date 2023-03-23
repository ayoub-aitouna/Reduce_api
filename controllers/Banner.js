const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const BadRequest = require("../errors/bad-request.js");
const {BadRequestError} = require("../errors/index.js");
require("dotenv").config();

const AddBanner = async (req, res) => {

	console.log("adding banner ");

	const { Baniere_ordre, Logo, Couverture, Offer, Adresse, Tel, statut } = JSON.parse(req.body.data);

	let cover = req.cover == undefined ? '': req.cover;

	let logo = req.logo == undefined ? '': req.logo;
	console.table([cover, logo]);
	const added_Activity = SqlQuery(`INSERT INTO banners 
	(Baniere_ordre, Logo, Couverture, Offer, Adresse, Tel, statut, created_date)
	VALUES ('${Baniere_ordre}', '${logo}', '${cover}', '${Offer}', 
	'${Adresse}', '${Tel}', '${statut == '' ? 'activer' : statut}', NOW())`);
	if (!added_Activity.success)
		return res.status(500).json({
			err: added_Activity.data.err,
		});
	res.status(200).send({
		msg: `OK`,
	});
};



const save_logo_cover = async (req, res, next) => {
	const domain = req.headers.host;
	const protocol = req.protocol;
	const domainUrl = protocol + '://' + domain;
	const filenames = req.files.map(file => file.filename);
	const { logo_selected, cover_selected } = JSON.parse(req.body.data);
	console.table(["macros", logo_selected, cover_selected]);
	let i = 0;
	if (filenames.length === 0)
		next();
	if (logo_selected != undefined && logo_selected != false)
		req.logo = `${domainUrl}/imgs/${filenames[i++]}`
	if (cover_selected != undefined && cover_selected != false)
		req.cover = `${domainUrl}/imgs/${filenames[i]}`
	next();
};



const UpdateBanner = async (req, res) => {
	const id = req.params.id;
	const { Baniere_ordre, Offer, Adresse, Tel, statut } = req.body;
	const old_data = SqlQuery(`SELECT * FROM banners WHERE id = ${id}`);
	if(!old_data.success)
		throw new BadRequestError('old_data err ');
	if (old_data.data.rows.length === 0)
		return res.status(404).send();
	let cover = req.cover == undefined ? old_data.data.rows[0].Couverture : req.cover;
	let logo = req.logo == undefined ? old_data.data.rows[0].Logo : req.logo;
	console.table([cover, logo]);
	const updated_querry = SqlQuery(`UPDATE banners SET
		Baniere_ordre = '${Baniere_ordre}', Logo = '${logo}', Couverture = '${cover}',
		Offer = '${Offer}', Adresse = '${Adresse}', Tel = '${Tel}', statut = '${statut}'
		WHERE id = ${id}`);
	if (!updated_querry.success)
		return res.status(500).json({
			err: updated_querry.data.err,
		});
	if (added_Activity.data.affectedRows === 0)
		return res.status(404).json({ msg: "Banner not found" });
	res.status(200).send({
		msg: `OK`,
	});
}

const Banner = async (req, res) => {
	const banners = SqlQuery(`SELECT * FROM banners WHERE statut = 'activer' ORDER BY Baniere_ordre`);
	if (!banners.success)
		return res.status(500).json({
			err: banners.data.err,
		});
	res.status(200).json(banners.data.rows);
};


const Banners = async (req, res) => {
	const id = req.params.id;
	const banners = SqlQuery(`SELECT * FROM banners WHERE id = ${id}`);
	if (!banners.success)
		return res.status(500).json({
			err: banners.data.err,
		});
	res.status(200).json(banners.data.rows);
};

module.exports = {
	AddBanner,
	UpdateBanner,
	Banners,
	Banner,
	save_logo_cover
};
