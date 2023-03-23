const { Mysql, Query, SqlQuery, runSql } = require("./mysql-connection");
const { client, disconnectRedis } = require("./redis-connection");
module.exports = {
	Mysql,
	client,
	disconnectRedis,
	Query, runSql,
	SqlQuery,
};
