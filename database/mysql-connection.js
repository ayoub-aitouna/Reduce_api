var mysql = require("mysql");
const Log = require("../log");
var syncSql = require("sync-sql");
const { BadRequestError } = require("../errors");

// const connect = {
//   user: "hostname",
//   host: "localhost",
//   password: "kijilikiIUGIULJ43@",
//   database: "mariwafo_defaultdb",
//   port: 3306,
//   multipleStatements: true,
// };
const connect = {
  user: "sql7603674",
  host: "sql7.freesqldatabase.com",
  password: "hS3pjQArHP",
  database: "sql7603674",
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
module.exports = { Mysql, Query, SqlQuery };
