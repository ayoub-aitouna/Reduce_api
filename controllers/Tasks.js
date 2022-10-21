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
const anounsments = async (req, res) => {
  const entrprise_activities = SqlQuery(`select * from entrprise_activities`);
  console.log(entrprise_activities);
  if (!entrprise_activities.success)
    return res.status(500).json({
      err: entrprise_activities.data.err,
    });
  res.status(200).json(entrprise_activities.data.rows);
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
  anounsments,
  done,
  add_done,
  search,
};
