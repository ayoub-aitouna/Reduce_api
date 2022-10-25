const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Log = require("../log");
const { BadRequestError } = require("../errors/index.js");
const { Encrypte } = require("../Utils/Crypto");
const { SendMail_to_partner, sendEmail } = require("../Utils/Mailer");
const { Generate_contract_Pdf } = require("../Utils/Pdfgenerator");
const UnauthenticatedError = require("../errors/unauthenticated.js");
const { get_this_admin } = require("../Utils/Utils.js");

const add_admin = async (req, res) => {
  const { id } = req.user;
  const { _role: this_role } = get_this_admin(id);
  const { email, ville, _password, _role, _name } = req.body;
  console.trace({ email, ville, _password, _role, _name });

  if (this_role != "Admin") {
    console.log("no permi");
    throw UnauthenticatedError(
      "you don't have permission to contenue on this request"
    );
  }
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
  if (!added_admin.success) {
    console.log("error");
    console.log(added_admin);
    return res.status(500).send({
      err: `Could not Add An Admin ${_name}with role ${_role} to Database`,
    });
  }
  res.status(200).send({
    msg: `an Admin ${_name} has been added with role ${_role} to Database `,
  });
};

const remove_admin = (req, res) => {
  const { id } = req.user;
  const { _role: this_role } = get_this_admin(id);
  const { id: manager_id } = req.body;
  if (this_role != "Admin")
    throw UnauthenticatedError(
      "you don't have permission to contenue on this request"
    );
  const suspand_admin = SqlQuery(
    `update _Admin set account_status = 'Suspanded' where id = ${manager_id}`
  );
  if (!suspand_admin.success)
    return res.status(500).send({
      err: `Could not suspand admin An Admin ${manager_id} `,
    });

  res.status(200).send({
    msg: `an Admin ${manager_id} has been suspand `,
  });
};

const Response_partner_form = async (req, res) => {
  //pulled sdsd
  const { partner_id, response } = req.body;
  console.trace({ partner_id, response });
  const { id: admin_id } = req.user;
  const partner = SqlQuery(`select * from partner where id = ${partner_id}`);
  if (!partner.success) throw new BadRequestError(partner.data.err.sqlMessage);
  const partner_data = partner.data.rows[0];
  const url = await Generate_contract_Pdf(partner_data);
  const result = SqlQuery(`
                        update partner
                    set
                        _status = '${response}',
						contract_Url = '${url}'
                    where
                        id = ${partner_id};`);
  if (!result.success) throw new BadRequestError(result.data.err.sqlMessage);
  const admin_partner = SqlQuery(`
                    insert into Admins_partners
                    (admin_id, partner_id, created_date)
                    values
                    (${admin_id}, ${partner_id}, CURDATE());`);
  if (!admin_partner.success)
    throw new BadRequestError(admin_partner.data.err.sqlMessage);
  const email = partner_data.email;
  console.log(email);
  const text = `you have been ${response}`;
  try {
    const send_info = SendMail_to_partner(
      {
        subject: "reduct have responded on your request",
        to: email,
        text: text,
      },
      partner_data
    );
    res.send(send_info);
  } catch (err) {
    throw new BadRequestError(err);
  }
};

const get_partners = (req, res) => {
  const { id } = req.user;
  const { _role } = get_this_admin(id);

  const Query = _role
    ? `select   partner.id,
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
        ville_name,
        activity_name
     from partner inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id`
    : `select   partner.id,
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
          ville_name,
          activity_name
     Admins_partners inner join partner on partner.id = Admins_partners.id  inner join villes on partner.ville = villes.id inner join entrprise_activities on partner.activity_entrprise = entrprise_activities.id
			  where admin_id = ${id} `;
  const partners = SqlQuery(Query);
  if (!partners.success) throw new BadRequestError("Some thing went Wrong");
  res.send(partners.data.rows);
};

const update_partner = async (req, res) => {};

const get_admins = (req, res) => {
  const { id } = req.user;
  console.log("get" + id);

  const { _role } = get_this_admin(id);
  const { ville, account_status } = req.body;
  if (_role != "Admin")
    throw UnauthenticatedError(
      "you don't have permission to contenue on this request"
    );
  let Sql_Query_Filter = "";
  Sql_Query_Filter += ville != -1 ? `ville == '${ville}'` : "";
  Sql_Query_Filter +=
    account_status != "" ? `account_status == '${account_status}' ` : "";
  let SQL_QUERY =
    "select * from _Admin  inner join villes on _Admin.ville = villes.id";
  // SQL_QUERY += Sql_Query_Filter != "" ? `where ${Sql_Query_Filter}` : "";
  const admins = SqlQuery(SQL_QUERY);
  if (!admins.success)
    return res.status(500).send({
      err: `Could not get Admins in  this Datadabse`,
    });

  res.status(200).send(admins.data.rows);
};

const get_modify = async (req, res) => {};

module.exports = {
  add_admin,
  remove_admin,
  Response_partner_form,
  get_partners,
  get_admins,
  update_partner,
};
