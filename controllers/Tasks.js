const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Log = require("../log");
const { BadRequestError } = require("../errors/index.js");
const { Encrypte } = require("../Utils/Crypto");
const { SendMail_to_partner } = require("../Utils/Mailer");
const { Generate_contract_Pdf } = require("../Utils/Pdfgenerator");
const UnauthenticatedError = require("../errors/unauthenticated.js");

const add_anounsment = async (req, res) => {
  const { partner_name, adrress } = req.body;
  const added_task_announcement = SqlQuery(`insert into task_announcement(
    partner_name ,
    task_status , 
    adrress ,
    created_date
)values ('${partner_name}','Pending','${adrress}',CURDATE());
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
  const task_announcement = SqlQuery(
    `select * from task_announcement where task_status == 'Pending'`
  );
  console.log(task_announcement);
  if (!task_announcement.success)
    return res.status(500).json({
      err: task_announcement.data.err,
    });
  res.status(200).json(task_announcement.data.rows);
};

const set_task_done = async (req, res) => {
  const { id } = req.body;
  const set_task_done = SqlQuery(
    `update set_task_done set task_status == 'Pending' where id = ${id}`
  );
  console.log(set_task_done);
  if (!set_task_done.success)
    return res.status(500).json({
      err: set_task_done.data.err,
    });
  res.status(200).json(set_task_done.data.rows);
};

//done
const add_done = async (req, res) => {
  const { Activity } = req.body;
  const added_Activity = SqlQuery(`insert into entrprise_activities(
    activity_name,
    created_date
	) values (
		'${Activity}',
		CURDATE()
	)`);
  if (!added_Activity.success)
    return res.status(500).json({
      err: added_Activity.data.err,
    });

  res.status(200).send({
    msg: `OK`,
  });
};
const done = async (req, res) => {
  const entrprise_activities = SqlQuery(`select * from entrprise_activities`);
  console.log(entrprise_activities);
  if (!entrprise_activities.success)
    return res.status(500).json({
      err: entrprise_activities.data.err,
    });
  res.status(200).json(entrprise_activities.data.rows);
};

//search
const search = async (req, res) => {
  const name = req.params.name;
  const entrprise_activities = SqlQuery(`select * from entrprise_activities`);
  console.log(entrprise_activities);
  if (!entrprise_activities.success)
    return res.status(500).json({
      err: entrprise_activities.data.err,
    });
  res.status(200).json(entrprise_activities.data.rows);
};

module.exports = {
  add_anounsment,
  set_task_done,
  anounsments,
  done,
  add_done,
  search,
};
