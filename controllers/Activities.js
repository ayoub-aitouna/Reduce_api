const { Mysql, Query, SqlQuery, runSql } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { BadRequestError } = require("../errors/index.js");
require("dotenv").config();

const EditActivity = async (req, res) => {
	const { name, value } = req.body;

	const _Activity = SqlQuery(`update entrprise_activities set activity_name = '${name}' where id = ${value}`);
	if (!_Activity.success) {
		return res.status(500).json({
			err: _Activity.data.err.sqlMessage,
		});
	}
	res.status(200).send({
		msg: `OK`,
	});
};
const AddActivity = async (req, res) => {
	const { Activity, icon } = req.body;

	const added_Activity = SqlQuery(`insert into entrprise_activities(
	activity_name,
	icon,
	created_date
	) values (
		'${Activity}',
		'${icon}',
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
	if (!entrprise_activities.success)
		return res.status(500).json({
			err: entrprise_activities.data.err,
		});
	res.status(200).json(entrprise_activities.data.rows);
};

const get_cities = async (req, res) => {

	const { id } = req.query;
	if (id == undefined || id == null) return res.status(404).send('id not defined');
	const cities = SqlQuery(`SELECT c.id, c.ville_name, IF(b.activity_id IS NULL, TRUE, FALSE)
					AS status FROM villes c
					LEFT JOIN blocked_activities b
						ON c.id = b.city_id
							AND b.activity_id = ${id};`);
	if (!cities.success)
		return res.status(500).json({
			err: cities.data.err,
		});
	res.status(200).json(cities.data.rows);
}


const toggle_city = async (req, res) => {
	const { cityId, activityId } = req.body;
	let rows = runSql(`SELECT * FROM blocked_activities WHERE city_id = ${cityId} AND activity_id = ${activityId}`);
	if (rows.length > 0) {
		const currentStatus = rows[0].status;
		const newStatus = !currentStatus;
		runSql(`DELETE FROM blocked_activities WHERE city_id = ${cityId} AND activity_id = ${activityId}`);
	}
	else
		runSql(`INSERT INTO blocked_activities (city_id, activity_id) VALUES (${cityId}, ${activityId})`);
	res.sendStatus(201);
}

const get_acviity_by_city = async (req, res) => {
	const { cityId } = req.Query;

	let activities = SqlQuery(`SELECT ea.activity_name
		FROM sql7610156.entrprise_activities ea
		LEFT JOIN blocked_activities ba ON ea.id = ba.activity_id
		WHERE ba.city_id IS NULL OR ba.city_id <> ${cityId};`
	);
	if (!activities.success)
		throw new BadRequestError(activities.data.err);
	res.status(200).send(activities.data);
}

module.exports = {
	AddActivity,
	Activities,
	get_cities,
	get_acviity_by_city,
	toggle_city,
	EditActivity
};
