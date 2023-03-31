const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
require("dotenv").config();
const { generateKeyAndstoreOtp, setOTPForEmail, getOTPForEmail } = require("../Utils/OTP.js");

const { BadRequestError } = require("../errors/index.js");
const { Encrypte, compare } = require("../Utils/Crypto");
const { sendEmail } = require("../Utils/Mailer");
const { OTP_EMAIL } = require("../Utils/Templates");

/**
 * @description check_if_partner_has_submited_form
 */
const does_partner_form_exits = async (req, res, next) => {
	const { email } = req.body;
	if (!email) {
		throw new BadRequestError("Please provide email");
	}
	let user = SqlQuery(`select * from partner where email = '${email}'`);
	if (!user.success) throw new BadRequestError("server error");
	try {
		if (user.data.rows[0] != undefined && user.data.rows.length != 0)
			return res.status(403).send({ msg: "account with same email already exists" });
		next();
	} catch (err) {
		throw new BadRequestError(err);
	}
};

const partner_login = async (req, res, next) => {
	const { email, password } = req.body;
	let HashedPass = "";
	try {
		HashedPass = await Encrypte(password);
	} catch (err) {
		console.log(err);
	}
	let user = SqlQuery(`select * from partner where email = '${email}'`);
	if (!user.success) throw new BadRequestError("user not found");
	try {
		if (
			user.data.rows[0] == undefined ||
			user.data.rows.length == 0 ||
			!(await compare(password, user.data.rows[0]._password))
		)
			return next();
		const accesToken = jwt.sign(
			user.data.rows[0],
			process.env.ACCESS_TOKEN_SECRET
		);
		const RefreshToken = jwt.sign(
			user.data.rows[0],
			process.env.REFRESH_TOKEN_SECRET
		);
		res.status(200).send({
			accesToken: accesToken,
			RefreshToken: RefreshToken,
			isMain: true,
		});
	} catch (err) {
		console.log(err);
		throw new BadRequestError(err);
	}
};

//todo : if account is blocked return status 403
const sub_partner_login = async (req, res) => {
	const { email, password } = req.body;
	let HashedPass = "";
	try {
		HashedPass = await Encrypte(password);
	} catch (err) {
		console.log(err);
	}
	let user = SqlQuery(`select * from sub_partner where email = '${email}'`);
	if (!user.success) throw new BadRequestError("user not found");
	try {
		if (
			user.data.rows[0] == undefined ||
			user.data.rows.length == 0 ||
			!(await compare(password, user.data.rows[0]._password))
		) {
			return res.status(404).send({ err: "password or email is not correct" });
		}
		if (user.data.rows[0]._status === "Blocked")
			return res.status(403).json({ msg: "this account is Blocked ." });
		const accesToken = jwt.sign(
			user.data.rows[0],
			process.env.ACCESS_TOKEN_SECRET
		);
		const RefreshToken = jwt.sign(
			user.data.rows[0],
			process.env.REFRESH_TOKEN_SECRET
		);
		res.status(200).send({
			accesToken: accesToken,
			RefreshToken: RefreshToken,
			isMain: false,
		});
	} catch (err) {
		console.log(err);
		throw new BadRequestError(err);
	}
};

const sendVeriifyOtp = async (req, res) => {
	const { email } = req.body;
	let otp = getOTPForEmail(req, email);
	if (otp == null || otp == undefined) {
		otp = await generateKeyAndstoreOtp(email);
		setOTPForEmail(req,email, otp);
	}
	console.table(['OTP', otp]);
	try {
		await sendEmail({
			subject: `Le code de vérification`,
			to: email,
			text: ``,
			html: OTP_EMAIL(otp),
		});
		res.sendStatus(200);
	} catch (err) {
		console.trace(err);
		res.sendStatus(500);
	}

};

const Verify_email = async (req, res) => {
	const { email, key } = req.body;
	try {
		const value = getOTPForEmail(req, email);
		res.send({ Verified: value != null && value != undefined && value == key });
	} catch (err) {
		throw new BadRequestError(err);
	}
};

const reset_pass = async (req, res) => {
	const { email, key, _password } = req.body;
	try {
		const value = getOTPForEmail(req, email);
		if (!(value != null && value != undefined && value == key))
			return res.sendStatus(403);

		const update_admin = SqlQuery(`update  _Admin
	  set _password = '${await Encrypte(_password)}'
    where email = '${email}'`);

		if (!update_admin.success) {
			return res.status(500).send({
				err: update_admin.data.err.sqlMessage,
			});
		}
		res.status(200).send("ok!");
	} catch (err) {
		throw new BadRequestError(err);
	}
};

const partner_Submit_form = async (req, res) => {
	const {
		email,
		password,
		nome_entreprise,
		identificateur_entreprise,
		representant_entreprise,
		role_dans_entriprise,
		numero_telephone,
		numero_telephone_fix,
		ville,
		adrress,
		activity_entrprise,
		offer,
	} = req.body;

	try {
		// const url = await GenrateAvaratByName(nome_entreprise);
		const url = "";
		const submit = SqlQuery(`insert into partner(email,
      _password,
      avatar_Url,
      nome_entreprise,
      identificateur_entreprise,
      representant_entreprise,
      role_dans_entriprise,
      numero_telephone,
      numero_telephone_fix,
      ville,
      activity_entrprise,
      offer,
      adrress,
      created_date,
      _status) values(
		'${email}',
		'${await Encrypte(password)}',
		'${url}',
		'${nome_entreprise}',
		'${identificateur_entreprise}',
		'${representant_entreprise}',
		'${role_dans_entriprise}',
		'${numero_telephone}',
		'${numero_telephone_fix}',
		'${ville}',
		'${activity_entrprise}',
		'${offer}',
    '${adrress}',
     NOW(),
    'Pending')`);
		if (submit.success) return res.status(200).send();
		return res
			.status(500)
			.json({ err: `Could not submit the form ${submit.data.err.sqlMessage}` });
	} catch (err) {
		throw new BadRequestError(err);
	}

};

//admin
const admin_login = async (req, res) => {
	const { email, password } = req.body;
	const admin = SqlQuery(`select * from _Admin where email = '${email.toLowerCase()}'`);
	if (!admin.success) throw new BadRequestError(`err : ${admin.data.err.sqlMessage}`);
	if (admin.data.rows == undefined || admin.data.rows.length == 0)
		return res.status(404).send({ err: "email is not correct" });

	const is_Authed = await compare(password, admin.data.rows[0]._password);
	const { _role, account_status, _name } = admin.data.rows[0];


	if (!is_Authed)
		return res.status(404).send({ err: "password is not correct" });
	if (account_status == "Banned" || account_status == "Suspanded")
		return res.status(404).send({ err: `this account is ${account_status}` });

	const accesToken = jwt.sign(admin.data.rows[0], process.env.ACCESS_TOKEN_SECRET);
	const RefreshToken = jwt.sign(admin.data.rows[0], process.env.REFRESH_TOKEN_SECRET);
	res.status(200).send({
		role: _role,
		_name: _name,
		account_status: account_status,
		accesToken: accesToken,
		RefreshToken: RefreshToken,
	});
};

const ResendOTP = async (req, res) => {
	const { email } = req.body;
	const otp = getOTPForEmail(req, email);
	if (otp == null || otp == undefined) {
		otp = await generateKeyAndstoreOtp(email);
		setOTPForEmail(req, email, otp);
	}
	try {
		await sendEmail({
			subject: `Le code de vérification`,
			to: email,
			text: ``,
			html: OTP_EMAIL(key),
		});
		res.sendStatus(200);
	} catch (err) {
		res.sendStatus(500);
	}
};

const client_login = async (req, res) => {
	const { email, password } = req.body;
	let user = SqlQuery(`select * from client where email = '${email}'`);
	if (!user.success) throw new BadRequestError(user.data.err.sqlMessage);
	try {
		if (user.data.rows[0] == undefined || user.data.rows.length == 0)
			return res.status(404).send({
				msg: "user not found"
			});
		if(!(await compare(password, user.data.rows[0]._password)))
		return res.status(404).send({
			msg: "password is not correct !"
		});
		const accesToken = jwt.sign(
			user.data.rows[0],
			process.env.ACCESS_TOKEN_SECRET
		);
		const RefreshToken = jwt.sign(
			user.data.rows[0],
			process.env.REFRESH_TOKEN_SECRET
		);
		res.status(200).send({
			accesToken: accesToken,
			RefreshToken: RefreshToken,
			isMain: true,
		});
	} catch (err) {
		console.log(err);
		throw new BadRequestError(err);
	}
}

// Create new Client
const new_client = async (req, res) => {
	try {
		const { full_name, birth_date, sexe, ville, adresse, profession, tel,
			birth_date_stamp, email, _password, abonnement, device_id, date_fin_abonnement }
			= req.body;
		if (!full_name || !email || !_password)
			return res.status(400).json({ msg: "Please provide all required fields" });
		const Query = `INSERT INTO client (full_name, birth_date, sexe, ville, adresse, profession,
			birth_date_stamp, tel, email, _password, abonnement,${device_id != undefined ? '' : `device_id,`} statut, date_inscription, 
		date_debut_abonnement, date_fin_abonnement, created_date) VALUES
		('${full_name}', '${birth_date}', '${sexe}', '${ville}', '${adresse}', ${profession},
		${birth_date_stamp != undefined ? birth_date_stamp : 0}, '${tel}', '${email}', '${await Encrypte(_password)}', '${abonnement}', ${device_id != undefined ? '' : `'${device_id}',`} 'Activé',
		NOW(), NOW(), ${date_fin_abonnement != undefined ? `'${date_fin_abonnement}'` : 'NOW()'} , NOW())`;
		const result = await SqlQuery(Query);
		if (!result.success)
			throw new BadRequestError(result.data.err
				.sqlMessage)
		res.status(201).json({
			msg: "Client added successfully"
		});
	} catch (err) {
		throw new BadRequestError(err);
	}
}

module.exports = {
	does_partner_form_exits,
	partner_login,
	admin_login,
	partner_Submit_form,
	ResendOTP,
	Verify_email,
	sendVeriifyOtp,
	reset_pass,
	sub_partner_login,
	client_login,
	new_client
};
