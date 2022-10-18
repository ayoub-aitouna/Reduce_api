const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Log = require("../log");
const { BadRequestError } = require("../errors/index.js");
const { Encrypte } = require("../Utils/Crypto");
const { SendMail_to_partner } = require("../Utils/Mailer");
const { Generate_contract_Pdf } = require("../Utils/Pdfgenerator");
const UnauthenticatedError = require("../errors/unauthenticated.js");

const AddActivity = async (req, res) => {
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
const Activities = async (req, res) => {
  const entrprise_activities = SqlQuery(`select * from entrprise_activities`);
  console.log(entrprise_activities);
  if (!entrprise_activities.success)
    return res.status(500).json({
      err: entrprise_activities.data.err,
    });
  res.status(200).json(entrprise_activities.data.rows);
};
module.exports = {
  AddActivity,
  Activities,
};
