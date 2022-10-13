const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Log = require("../log");
const { BadRequestError } = require("../errors/index.js");
const { Encrypte } = require("../Utils/Crypto");
const { SendMail_to_partner } = require("../Utils/Mailer");
const { Generate_contract_Pdf } = require("../Utils/Pdfgenerator");
const UnauthenticatedError = require("../errors/unauthenticated.js");

const get_this_admin = ({ id }) => {
	const this_admin = SqlQuery(`select * from _Admin where id = ${id} `);
	if (!this_admin.success)
		throw BadRequestError(`couldn't retrive admin with this id ${id}`);
	return this_admin.data.rows[0];
};
const add_admin = async (req, res) => {
	const { id } = req.user;
	const { email, ville, _password, _role, _name } = get_this_admin(id);
	if (_role != "Admin")
		throw UnauthenticatedError(
			"you don't have permission to contenue on this request"
		);
	const added_admin = SqlQuery(`insert into _Admin(
    email  ,
	_password ,
	_name,
    ville ,
    _role,
    account_status,
    created_date
	) values (
		'${email}',
		'${await Encrypte(_password)}',
		'${_name}',
		'${ville}',
		'${_role}',
		'Active',
		CURDATE()
	)`);
	if (!added_admin.success)
		return res.status(500).send({
			err: `Could not Add An Admin ${_name}with role ${_role} to Database`,
		});

	res.status(200).send({
		msg: `an Admin ${_name} has been added with role ${_role} to Database `,
	});
};
const remove_admins = (req, res) => {
	const { id } = req.user;
	const { email, ville, _password, _role, _name } = get_this_admin(id);
	if (_role != "Admin")
		throw UnauthenticatedError(
			"you don't have permission to contenue on this request"
		);
	const suspand_admin = SqlQuery(
		`update _Admin set account_status = 'Suspanded'`
	);
	if (!suspand_admin.success)
		return res.status(500).send({
			err: `Could not suspand admin An Admin ${_name}with role ${_role} to Database`,
		});

	res.status(200).send({
		msg: `an Admin ${_name} has been suspand `,
	});
};

const Response_partner_form = async (req, res) => {
	const { partner_id, response, email } = req.body;
	const { id: admin_id } = req.user;
	const partner = SqlQuery("select * from partner");
	if (!partner.success) throw new BadRequestError("some thing wrong");
	const partner_data = partner.data.rows[0];
	const { url } = await Generate_contract_Pdf(partner_data);

	const res = SqlQuery(`
                        update partner
                    set
                        _status = '${response}',
						contract_Url = ${url}
                    where
                        id = ${partner_id};`);
	if (!res.success) throw new BadRequestError("some thing wrong");
	const admin_partner = SqlQuery(`
                    insert into Admins_partners
                    (admin_id, partner_id, created_date)
                    values
                    (${admin_id}, ${partner_id}, CURDATE());`);

	if (!admin_partner.success) throw new BadRequestError("some thing wrong");
	try {
		const send_info = SendMail_to_partner(response, email, partner_data);
		res.send(send_info);
	} catch (err) {
		throw BadRequestError(err);
	}
};

const get_partners = (req, res) => {
	const { id } = req.user;
	const { email, ville, _password, _role, _name } = get_this_admin(id);

	const Query = _role
		? "select * from partner"
		: `select * Admins_partners inner join partner on partner.id = Admins_partners.id where admin_id = ${id}`;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError("Some thing went Wrong");
	res.send(partners);
};
const get_admins = (req, res) => {
	const { id } = req.user;
	const { email, ville, _password, _role, _name } = get_this_admin(id);
	if (_role != "Admin")
		throw UnauthenticatedError(
			"you don't have permission to contenue on this request"
		);
	const admins = SqlQuery(`update _Admin set account_status = 'Suspanded'`);
	if (!admins.success)
		return res.status(500).send({
			err: `Could not get Admins in  this Datadabse`,
		});

	res.status(200).send(admins.data.rows);
};

module.exports = {
	add_admin,
	remove_admin,
	Response_partner_form,
	get_partners,
	get_admins,
};
