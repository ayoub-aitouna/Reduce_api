const { Mysql, Query, SqlQuery, runSql } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors/index.js");
require("dotenv").config();

const get_state = (req, res) => {
	const client_state = SqlQuery(`
		SELECT 
		COUNT(*) AS total_clients, 
		SUM(CASE WHEN created_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS recent_clients
		FROM client;`
	);
	if (!client_state.success)
		throw new BadRequestError(client_state.data.err.sqlMessage);
	const partner_state = SqlQuery(`
		SELECT 
		COUNT(*) AS total_partners, 
		SUM(CASE WHEN created_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS resent_partners
		FROM partner;`
	);
	if (!partner_state.success)
		throw new BadRequestError(partner_state.data.err.sqlMessage);
	res.status(200).json({
		client: client_state.data.rows[0],
		partner: partner_state.data.rows[0]
	});
}

module.exports = {
	get_state
};
