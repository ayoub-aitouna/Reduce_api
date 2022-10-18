const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
require("dotenv").config();
const Log = require("../log");
const get_parner_data = (req, res) => {
  const { id } = req.body.user;
  const partner = SqlQuery(`select * from partner where id = ${id}`);
  if (!partner.success)
    throw BadRequestError(`couldn't retrive partner with this id ${id}`);
  res.json(partner.data.rows[0]);
};

module.exports = { get_parner_data };
