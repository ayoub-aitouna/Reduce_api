const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Log = require("../log");
const { BadRequestError } = require("../errors/index.js");
const { Encrypte } = require("../Utils/Crypto");
const { SendMail_to_partner } = require("../Utils/Mailer");
const { Generate_contract_Pdf } = require("../Utils/Pdfgenerator");
const UnauthenticatedError = require("../errors/unauthenticated.js");
const { get_this_admin } = require("../Utils/Utils.js");

const add_anounsment = async (req, res) => {
  const { partner_name, adrress, ville } = req.body;
  const { id } = req.user;
  const { _role: this_role } = get_this_admin(id);
  if (this_role != "Admin")
    throw new UnauthenticatedError("you dont have permission");
  const added_task_announcement = SqlQuery(`insert into task_announcement(
    partner_name ,
    task_status ,
    ville, 
    adrress ,
    created_date
)values ('${partner_name}','Pending','${ville}','${adrress}',CURDATE());
`);
  if (!added_task_announcement.success)
    return res.status(500).json({
      err: added_task_announcement.data.err,
    });

  res.status(200).send({
    msg: `OK`,
  });
};

const anounsments = async (req, res) => {
  const { id } = req.user;
  const { _role: this_role, ville: admin_ville } = get_this_admin(id);

  let filter = this_role != "Admin" ? `and ville == ${admin_ville}` : "";
  const task_announcement = SqlQuery(
    `select * from task_announcement where task_status == 'Pending' ${filter}`
  );
  if (!task_announcement.success)
    return res.status(500).json({
      err: task_announcement.data.err,
    });
  res.status(200).json(task_announcement.data.rows);
};

const set_task_done = async (req, res) => {
  const { id: taskid, partner_name, partner_status } = req.body;
  const { id: manager_id } = req.user;

  const set_task_done = SqlQuery(
    `update set_task_done set task_status == 'Pending' where id = ${taskid}`
  );
  if (!set_task_done.success)
    return res.status(500).json({
      err: set_task_done.data.err,
    });
  const add_done = SqlQuery(
    `insert into task_done (partner_name ,
                            partner_status,
                            manager_id ,
                            created_date)
                    values('${partner_name}',
                            '${partner_status}',
                            ${manager_id},
                            CURDATE())`
  );
  if (!add_done.success)
    return res.status(500).json({
      err: add_done.data.err,
    });
  res.status(200).send("ok");
};

//done
const add_done = async (req, res) => {
  const { partner_name, partner_status } = req.body;
  const { id: manager_id } = req.user;
  const add_done = SqlQuery(
    `insert into task_done (partner_name ,
                            partner_status,
                            manager_id ,
                            created_date)
                    values('${partner_name}',
                            '${partner_status}',
                            ${manager_id},
                            CURDATE())`
  );
  if (!add_done.success)
    return res.status(500).json({
      err: add_done.data.err,
    });
  res.status(200).send({
    msg: `OK`,
  });
};

//done edite
const edite_done = async (req, res) => {
  const { id, partner_name, partner_status } = req.body;
  const add_done = SqlQuery(
    `update task_done set partner_name = '${partner_name}', partner_status =   '${partner_status}' 
    where id = ${id}`
  );
  if (!add_done.success)
    return res.status(500).json({
      err: add_done.data.err,
    });
  res.status(200).send({
    msg: `OK`,
  });
};

const done = async (req, res) => {
  const { id } = req.user;
  const { _role: this_role, ville: admin_ville } = get_this_admin(id);
  let filter = this_role != "Admin" ? `task_done.ville == ${admin_ville}` : "";

  const done_tasks = SqlQuery(
    `select * from task_done inner join _Admin on task_done.manager_id = _Admin.id
     inner join villes  task_done.ville = villes.id ${filter}`
  );
  if (!done_tasks.success)
    return res.status(500).json({
      err: done_tasks.data.err,
    });
  res.status(200).json(done_tasks.data.rows);
};

//search
const search = async (req, res) => {
  const { id } = req.user;
  const { _role: this_role, ville: admin_ville } = get_this_admin(id);
  const name = req.params.partner_name;

  // search on anounsments
  let base_filter = `partner_name == ${name}`;
  let filter = this_role != "Admin" ? ` ville == ${admin_ville}` : "";
  const task_announcement = SqlQuery(
    `select * from task_announcement where task_status == 'Pending' and ${base_filter} and ${filter}`
  );
  if (!task_announcement.success)
    return res.status(500).json({
      err: task_announcement.data.err,
    });

  //search on done tasks
  const done_tasks = SqlQuery(
    `select * from task_done where ${base_filter} and  ${filter}`
  );
  if (!done_tasks.success)
    return res.status(500).json({
      err: done_tasks.data.err,
    });
  const result = task_announcement.data.rows.concat(done_tasks.data.rows);

  res.status(200).json(result);
};

module.exports = {
  add_anounsment,
  set_task_done,
  anounsments,
  done,
  add_done,
  search,
  edite_done,
};
