const { SqlQuery } = require("../database/index.js");
require("dotenv").config();
const Log = require("../log");
const { BadRequestError } = require("../errors/index.js");

const get_this_admin = (id) => {
  console.log("called get admin");
  const this_admin = SqlQuery(`select * from _Admin where id = ${id} `);
  if (!this_admin.success) {
    console.log(this_admin);
    throw new BadRequestError(`couldn't retrive admin with this id ${id}`);
  }
  return this_admin.data.rows[0];
};
module.exports = { get_this_admin };
