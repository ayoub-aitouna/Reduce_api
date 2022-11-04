const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
require("dotenv").config();
const Log = require("../log");
const get_parner_data = (req, res) => {
  const { id } = req.user;
  const partner = SqlQuery(`select * from partner where id = ${id}`);
  if (!partner.success)
    throw BadRequestError(`couldn't retrive partner with this id ${id}`);
  if (partner.data.rows.length == 0)
    return res.status(404).send({ msg: `there is no partner with id ${id}` });
  res.json(partner.data.rows[0]);
};

module.exports = { get_parner_data };
