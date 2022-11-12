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

  if (this_role != "Admin") {
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
  const { id: admin_id } = req.user;

  const partner = SqlQuery(`select * from partner where id = ${partner_id}`);
  if (!partner.success) throw new BadRequestError(partner.data.err.sqlMessage);

  const partner_data = partner.data.rows[0];

  let url = "";

  try {
    url = response == "Accept" ? await Generate_contract_Pdf(partner_data) : "";
  } catch (error) {
    throw new BadRequestError(error);
  }

  const result = SqlQuery(`
                        update partner
                    set
                        _status = '${response}',
						contract_Url = '${url}'
                    where
                        id = ${partner_id};`);
  if (!result.success) throw new BadRequestError(result.data.err.sqlMessage);

  partner_data.contract_Url = url;

  const admin_partner = SqlQuery(`
                    insert into Admins_partners
                    (admin_id, partner_id, created_date)
                    values
                    (${admin_id}, ${partner_id}, CURDATE());`);
  if (!admin_partner.success)
    throw new BadRequestError(admin_partner.data.err.sqlMessage);

  if (response == "Accept") {
    const email = partner_data.email;
    try {
      const send_info = SendMail_to_partner(
        {
          subject: "reduct have responded on your request",
          to: email,
          text: `you have been ${response}`,
        },
        partner_data
      );
      res.send(send_info);
    } catch (err) {
      throw new BadRequestError(err);
    }
  }
};

const get_partners = (req, res) => {
  const { id } = req.user;
  const { _role, ville } = get_this_admin(id);

  const Filter = _role != "Admin" ? `where ville = ${ville}` : "";
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
       ${Filter}
       ORDER BY id DESC `;
  const partners = SqlQuery(Query);
  if (!partners.success) throw new BadRequestError("Some thing went Wrong");
  console.log(partners.data.rows);
  res.send(partners.data.rows);
};

const update_partner = async (req, res) => {
  const { id: admin_id } = req.user;
  const {
    id,
    email,
    nome_entreprise,
    identificateur_entreprise,
    representant_entreprise,
    role_dans_entriprise,
    numero_telephone,
    numero_telephone_fix,
    ville,
    adrress,
    _status: partner_status,
    activity_entrprise,
    offer,
    note,
  } = req.body;

  try {
    const old_data = SqlQuery(`select * from partner where id = ${id}`);

    if (!old_data.success)
      throw new BadRequestError(old_data.data.err.sqlMessage);

    const submit = SqlQuery(`update partner set email = '${email}',
      nome_entreprise = 	'${nome_entreprise}',
      identificateur_entreprise = 	'${identificateur_entreprise}',
      representant_entreprise = '${representant_entreprise}',
      role_dans_entriprise = 	'${role_dans_entriprise}',
      numero_telephone = 		'${numero_telephone}',
      numero_telephone_fix = 	'${numero_telephone_fix}',
      ville = 	'${ville}',
      activity_entrprise = 	'${activity_entrprise}',
      _status = 	'${partner_status}',
      note = 	'${note}',
      offer = 	'${offer}',
      adrress =  '${adrress}' where partner.id = ${id}`);

    if (!submit.success)
      return res.status(500).json({
        err: `Could not submit the form ${submit.data.err.sqlMessage}`,
      });

    const new_data = {
      id,
      email,
      nome_entreprise,
      identificateur_entreprise,
      representant_entreprise,
      role_dans_entriprise,
      numero_telephone,
      numero_telephone_fix,
      ville,
      adrress,
      partner_status,
      activity_entrprise,
      offer,
      note,
    };
    const applied_modife = get_applied_modif(old_data.data.rows[0], new_data);
    const add_history_Qeury = `insert into modify_history(partner_id, admin_id,edited_column, created_date)
                              values(${id}, ${admin_id},'${applied_modife}', CURDATE());`;
    const add_history = SqlQuery(add_history_Qeury);
    console.trace(add_history);
    if (!add_history.success)
      return res.status(500).json({
        err: `Could not submit the form ${add_history.data.err.sqlMessage}`,
      });
    return res.sendStatus(200);
  } catch (err) {
    throw new BadRequestError(err);
  }
};

function get_applied_modif(old_data, new_data) {
  let modifes = "";

  if (old_data.email != new_data.email) modifes += " Email,";

  if (old_data.nome_entreprise != new_data.nome_entreprise)
    modifes += " Raison sociale	,";

  if (old_data.identificateur_entreprise != new_data.identificateur_entreprise)
    modifes += " ICE,";

  if (old_data.representant_entreprise != new_data.representant_entreprise)
    modifes += " Représentant Entreprise,";

  if (old_data.role_dans_entriprise != new_data.role_dans_entriprise)
    modifes += " Fonction,";

  if (old_data.numero_telephone != new_data.numero_telephone)
    modifes += " numero_telephone,";

  if (old_data.numero_telephone_fix != new_data.numero_telephone_fix)
    modifes += " numero telephone fix,";

  if (old_data.ville != new_data.ville) modifes += " Ville,";

  if (old_data.adrress != new_data.adrress) modifes += " Adrrees,";

  if (old_data._status != new_data.partner_status)
    modifes += " statut de partenaire,";

  if (old_data.activity_entrprise != new_data.activity_entrprise)
    modifes += " Secteur d'activité	,";

  if (old_data.offer != new_data.offer) modifes += " offrir,";

  if (old_data.note != new_data.note) modifes += " Remarque,";

  return modifes;
}

const get_admins = (req, res) => {
  const { id } = req.user;
  const { _role } = get_this_admin(id);
  if (_role != "Admin")
    throw UnauthenticatedError(
      "you don't have permission to contenue on this request"
    );

  let SQL_QUERY =
    "select * from _Admin  inner join villes on _Admin.ville = villes.id   ORDER BY _Admin.id DESC ";
  // SQL_QUERY += Sql_Query_Filter != "" ? `where ${Sql_Query_Filter}` : "";
  const admins = SqlQuery(SQL_QUERY);
  if (!admins.success)
    return res.status(500).send({
      err: `Could not get Admins in  this Datadabse`,
    });

  res.status(200).send(admins.data.rows);
};

const get_modify_history = async (req, res) => {
  const { id } = req.user;
  const { _role, ville } = get_this_admin(id);

  const Filter = _role != "Admin" ? `where partner.ville = ${ville}` : "";

  const Query = `select  _Admin._name , partner.nome_entreprise, modify_history.created_date,edited_column
                  from modify_history
                  inner join  partner on  modify_history.partner_id =  partner.id
                  inner join _Admin on modify_history.admin_id =  _Admin.id
                  ${Filter}
                  ORDER BY modify_history.id DESC `;
  const History = SqlQuery(Query);
  if (!History.success) throw new BadRequestError("Some thing went Wrong");
  res.send(History.data.rows);
};

const update_admin = async (req, res) => {
  const { id } = req.user;
  const { _role: this_role } = get_this_admin(id);
  const {
    id: admin_id,
    email,
    ville,
    _password,
    _role,
    _name,
    account_status,
  } = req.body;

  if (this_role != "Admin") {
    throw UnauthenticatedError(
      "you don't have permission to contenue on this request"
    );
  }
  const update_admin = SqlQuery(`update  _Admin
    set email  ='${email}',
	  _password = '${await Encrypte(_password)}',
	  _name = 	'${_name}',
    ville = 	'${ville}',
    _role = '${_role}',
    account_status =${account_status}
    where _Admin.id = ${admin_id}`);

  if (!update_admin.success) {
    return res.status(500).send({
      err: `Could not Add An Admin ${_name}with role ${_role} to Database`,
    });
  }
  res.status(200).send({
    msg: `an Admin ${_name} has been added with role ${_role} to Database `,
  });
};

module.exports = {
  add_admin,
  remove_admin,
  Response_partner_form,
  get_partners,
  get_admins,
  update_partner,
  get_modify_history,
  update_admin,
};
