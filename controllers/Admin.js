const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Log = require("../log");
const { BadRequestError } = require("../errors/index.js");
const { Encrypte } = require("../Utils/Crypto");
const { SendMail_to_partner } = require("../Utils/Mailer");
const { Generate_contract_Pdf } = require("../Utils/Pdfgenerator");

const add_admin = async (req, res) => {
	const { email, ville, _password, _role, _name } = req.body;
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
	if (!admin.success)
		return res.status(500).send({
			err: `Could not Add An Admin ${_name}with role ${_role} to Database`,
		});

	res.status(200).send({
		msg: `an Admin ${_name} has been added with role ${_role} to Database `,
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
	const { id: admin_id } = req.user;
	const admin = SqlQuery(`select * from _Admin where id = ${admin_id}`);
	if (!admin.success) throw new BadRequestError("Some thing went Wrong");
	const { _role } = admin[0];
	const Query = _role
		? "select * from partner"
		: `select * Admins_partners inner join partner on partner.id = Admins_partners.id where admin_id = ${admin_id}`;
	const partners = SqlQuery(Query);
	if (!partners.success) throw new BadRequestError("Some thing went Wrong");
	res.send(partners);
};
module.exports = { add_admin, Response_partner_form, get_partners, get_admins };
