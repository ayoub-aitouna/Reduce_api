const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const {BadRequestError} = require("../errors/index.js");
require("dotenv").config();

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
  if (!entrprise_activities.success)
    return res.status(500).json({
      err: entrprise_activities.data.err,
    });
  res.status(200).json(entrprise_activities.data.rows);
};

const get_cities - async (req, res)=>{

	const {id} = req.Query;
	
	const cities = SqlQuery(`SELECT c.id, c.ville_name, IF(b.activity_id IS NULL, TRUE, FALSE) AS is_blocked
							FROM villes c
							LEFT JOIN blocked_activities b ON c.id = b.city_id AND b.activity_id = ${id};`);
	if(!cities.success)
	return res.status(500).json({	
      err: entrprise_activities.data.err,
	});
	res.status(200).json(cities.rows);
}


const toggle_city = async(req, res)=> {
	const {cityId, activityId} = req.body;
	// check if there is a row for the given city and activity
	let rows = SqlQuery(`SELECT * FROM blocked_activities WHERE city_id = ${cityId} AND activity_id = ${activityId}`);
	if(!rows.success) throw new BadRequestError(`err :${rows.data.err.sqlMessage}`);
	rows = rows.data;
	if (rows.length > 0) {
		const currentStatus = rows[0].status;
		const newStatus = !currentStatus;
		let update = SqlQuery(`UPDATE blocked_activities SET status = ${newStatus} WHERE city_id = ${cityId} AND activity_id = ${activityId}`);
  }
  // otherwise, insert a new row with the status set to false
  else {
    conn.query('INSERT INTO blocked_activities (city_id, activity_id, status) VALUES (?, ?, false)', [cityId, activityId]);
  }
}

const get_acviity_by_city = async (req, res) =>{
	const {cityId} = req.Query;

	let activities = SqlQuery(`SELECT ea.activity_name
		FROM sql7607447.entrprise_activities ea
		LEFT JOIN blocked_activities ba ON ea.id = ba.activity_id
		WHERE ba.city_id IS NULL OR ba.city_id <> ${cityId};`
	);
	if(!activities.success)
		throw new BadRequestError(activities.data.err);
	res.status(200).send(activities.data);
}

module.exports = {
	AddActivity,
	Activities,
	get_cities,
	get_acviity_by_city,
	toggle_city
	
};
