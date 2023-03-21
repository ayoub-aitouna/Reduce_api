const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
require("dotenv").config();
const { generateKeyAndstoreOtp } = require("../Utils/OTP.js");

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
			return res.status(403).send({msg: "account with same email already exists"});
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
		if(user.data.rows[0]._status === "Blocked")
			return res.status(403).json({msg: "this account is Blocked ."});
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
	const client = redis.createClient({
		socket: {
			host: "redis-11844.c302.asia-northeast1-1.gce.cloud.redislabs.com",
			port: "11844",
		},
		password: "Xhl3ENh5O3gyKqiObVUCX9xqXmE2L0AK",
	});
	
	client.on("connect", function (err) {
		if (err) {
			throw new BadRequestError(err);
		} else {
			res.send("Conencted")
		}
	});
	
	client.on("error", function (err) {
		if (err) {
			throw new BadRequestError(err);
		}
	});
};

const Verify_email = async (req, res) => {
	const { email, key } = req.body;
	try {
		const value = await client.get(email);
		res.send({ Verified: value != null && value != undefined && value == key });
	} catch (err) {
		throw new BadRequestError(err);
	}
};

const reset_pass = async (req, res) => {
	const { email, key, _password } = req.body;
	console.log({ email, key, _password });
	try {
		const value = await client.get(email);
		if (!(value != null && value != undefined && value == key))
			return res.sendStatus(403);

		const update_admin = SqlQuery(`update  _Admin
	  set _password = '${await Encrypte(_password)}'
    where email = '${email}'`);

		if (!update_admin.success) {
			console.log(update_admin.data.err.sqlMessage);
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
	console.table([{ email, password }]);
	const admin = Query(
		`select * from _Admin where email = '${email.toLowerCase()}'`
	);
	if (admin == undefined || admin.length == 0)
		return res.status(404).send({ err: "email is not correct" });

	const is_Authed = await compare(password, admin[0]._password);
	const { _role, account_status, _name } = admin[0];

	if (!is_Authed)
		return res.status(404).send({ err: "password is not correct" });
	if (account_status == "Banned" || account_status == "Suspanded")
		return res.status(404).send({ err: `this account is ${account_status}` });

	const accesToken = jwt.sign(admin[0], process.env.ACCESS_TOKEN_SECRET);
	const RefreshToken = jwt.sign(admin[0], process.env.REFRESH_TOKEN_SECRET);
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
	let key = "";
	key = await client.get(email);
	if (key == null || key == undefined)
		key = await generateKeyAndstoreOtp(email);
	try {
		await sendEmail({
			subject: `Le code de vérification`,
			to: email,
			text: ``,
			html: OTP_EMAIL(key),
		});
		res.sendStatus(200);
	} catch (err) {
		console.trace(err);
		res.sendStatus(500);
	}
};

module.exports = {
	does_partner_form_exits,
	partner_login,
	admin_login,
	partner_Submit_form,
	ResendOTP,
	Verify_email,
	sendVeriifyOtp,
	reset_pass,
	sub_partner_login
};
