var mysql = require("mysql");
const Log = require("../log");
var syncSql = require("sync-sql");
const { BadRequestError } = require("../errors");
const connect = {
  user: "sql7607447",
  host: "sql7.freesqldatabase.com",
  password: "8JzUyA7tKx",
  database: "sql7607447",
  port: 3306,
  multipleStatements: true,
};
var Mysql = mysql.createConnection(connect);

function Query(query) {
  try {
    return syncSql.mysql(connect, query).data.rows;
  } catch (err) {
    throw new BadRequestError(err);
  }
}

function SqlQuery(query) {
  try {
    return syncSql.mysql(connect, query);
  } catch (err) {
    throw new BadRequestError(err);
  }
}


async function runSql(query) {
  const res = await SqlQuery(query);
  if (!res.success) throw new BadRequestError(`err :${res.data.err.sqlMessage}`);
  return res.data.rows;
}


module.exports = { Mysql, Query, SqlQuery, runSql };
