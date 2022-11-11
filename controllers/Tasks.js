const { SqlQuery } = require("../database/index.js");
require("dotenv").config();
const { BadRequestError } = require("../errors/index.js");

const UnauthenticatedError = require("../errors/unauthenticated.js");
const { get_this_admin } = require("../Utils/Utils.js");

const add_anounsment = async (req, res) => {
  const {
    partner_name,
    partner_address,
    ville,
    full_name,
    phone_number,
    note,
    visite_date,
  } = req.body;
  const { id } = req.user;
  const { _role: this_role } = get_this_admin(id);
  if (this_role != "Admin")
    throw new UnauthenticatedError("you dont have permission");
  const added_task_announcement = SqlQuery(`insert into task_announcement(
      partner_name ,
      partner_full_name ,
      phone_number ,
      note ,
      task_status ,
      ville, 
      adrress ,
      data_of_visite ,
      created_date
  )values ('${partner_name}','${full_name}',
            '${phone_number}','${note}','Pending','${ville}','${partner_address}'
              ,'${visite_date}',CURDATE());
  `);
  if (!added_task_announcement.success)
    return res.status(500).json({
      err: added_task_announcement.data.err,
    });

  res.status(200).send({
    msg: `OK`,
  });
};

const anounsments = async (req, res) => {
  const { id } = req.user;
  const { _role: this_role, ville: admin_ville } = get_this_admin(id);

  let filter = this_role != "Admin" ? `ville = ${admin_ville} and` : "";
  const task_announcement = SqlQuery(
    `select
    task_announcement.id,
     partner_name,
      partner_full_name,
      phone_number,
      note,
      task_status,
      ville, 
      adrress,
      data_of_visite,
      ville_name
    from task_announcement
      inner join villes on  task_announcement.ville = villes.id
       where ${filter}  task_status = 'Pending'
       ORDER BY task_announcement.id DESC 
     `
  );
  if (!task_announcement.success) {
    console.log(task_announcement.data.err);
    return res.status(500).json({
      err: task_announcement.data.err,
    });
  }
  res.status(200).json(task_announcement.data.rows);
};

const set_task_done = async (req, res) => {
  const {
    id: taskid,
    partner_name,
    partner_status,
    partner_full_name: full_name,
    phone_number,
    note,
    adrress,
    data_of_visite: visite_date,
  } = req.body;
  const { id: manager_id } = req.user;
  const { ville } = get_this_admin(manager_id);
  const add_done = SqlQuery(
    `insert into task_done (partner_name ,
                            partner_full_name,
                            phone_number,
                            note,
                            partner_status,
                            manager_id ,
                            ville,
                            adrress,
                            data_of_visite,
                            created_date)
                    values('${partner_name}',
                            '${full_name}',
                            '${phone_number}',
                            '${note}',
                            '${partner_status}',
                             ${manager_id},
                             ${ville},
                            '${adrress}',
                            '${visite_date}',
                             CURDATE())`
  );
  if (!add_done.success) {
    console.trace(add_done.data.err);
    return res.status(500).json({
      err: add_done.data.err,
    });
  }

  const set_task_done = SqlQuery(
    `update task_announcement set task_status = 'Done' where id = ${taskid}`
  );
  if (!set_task_done.success) {
    return res.status(500).json({
      err: set_task_done.data.err,
    });
  }

  res.status(200).send("ok");
};

//done
const add_done = async (req, res) => {
  const {
    partner_name,
    partner_status,
    full_name,
    phone_number,
    note,
    adrress,
    visite_date,
  } = req.body;
  const { id: manager_id } = req.user;
  const { _role: this_role, ville } = get_this_admin(manager_id);

  const add_done = SqlQuery(
    `insert into task_done (partner_name ,
                            partner_full_name,
                            phone_number,
                            note,
                            partner_status,
                            manager_id ,
                            ville,
                            data_of_visite,
                            adrress,
                            created_date)
                    values('${partner_name}',
                            '${full_name}',
                            '${phone_number}',
                            '${note}',
                            '${partner_status}',
                             ${manager_id},
                             ${ville},
                             '${visite_date}',
                            '${adrress}',
                             CURDATE())`
  );
  if (!add_done.success) {
    console.trace(add_done.data.err);
    return res.status(500).json({
      err: add_done.data.err,
    });
  }
  res.status(200).send({
    msg: `OK`,
  });
};

//done edite
const edite_done = async (req, res) => {
  const {
    id,
    partner_name,
    partner_status,
    partner_full_name: full_name,
    phone_number,
    note,
    adrress,
    data_of_visite: visite_date,
  } = req.body;
  const add_done = SqlQuery(
    `update task_done set partner_name = '${partner_name}',
     partner_status =   '${partner_status}',
     note = '${note}',
     phone_number = '${phone_number}' ,
     partner_full_name = '${full_name}',
     adrress = '${adrress}',
     data_of_visite = '${visite_date}'
     where id = ${id}`
  );
  if (!add_done.success) {
    console.trace(add_done.data.err);

    return res.status(500).json({
      err: add_done.data.err,
    });
  }
  res.status(200).send({
    msg: `OK`,
  });
};

const done = async (req, res) => {
  const { id } = req.user;
  const {
    id: admin_id,
    _role: this_role,
    ville: admin_ville,
  } = get_this_admin(id);

  let filter =
    this_role != "Admin"
      ? ` where task_done.manager_id = ${admin_id} and villes.id = ${admin_ville}`
      : "";
  const done_tasks = SqlQuery(
    `select task_done.id,task_done.partner_name, task_done.ville,
       task_done.partner_status, task_done.partner_full_name,
       task_done.phone_number,task_done.note, task_done.adrress,
       task_done.data_of_visite, _Admin._name, villes.ville_name,
       task_done.adrress
       from  task_done
       inner join  _Admin on  task_done.manager_id =  _Admin.id
       inner join  villes on  task_done.ville =  villes.id ${filter}
       ORDER BY task_done.id DESC `
  );
  if (!done_tasks.success) {
    console.trace(done_tasks.data.err);
    return res.status(500).json({
      err: done_tasks.data.err,
    });
  }
  res.status(200).json(done_tasks.data.rows);
};

//search
const search = async (req, res) => {
  const { id } = req.user;
  const { _role: this_role, ville: admin_ville } = get_this_admin(id);
  const name = req.query.partner_name;
  // search on anounsments
  let base_filter = `partner_name LIKE '%${name}%'`;
  let filter = this_role != "Admin" ? `and ville == ${admin_ville}` : "";
  const task_announcement = SqlQuery(
    `select * from task_announcement
    inner join villes on  task_announcement.ville = villes.id
       where task_status = 'Pending' ${filter} and ${base_filter}
       ORDER BY task_announcement.id DESC `
  );
  if (!task_announcement.success) {
    console.log(task_announcement.data.err);
    return res.status(500).json({
      err: task_announcement.data.err,
    });
  }
  //search on done tasks
  const done_tasks = SqlQuery(
    `select * from task_done inner join _Admin on task_done.manager_id = _Admin.id 
     inner join villes on  task_done.ville = villes.id
      where ${base_filter} ${filter} ORDER BY task_done.id DESC `
  );
  if (!done_tasks.success) {
    console.log(done_tasks.data.err);
    return res.status(500).json({
      err: done_tasks.data.err,
    });
  }
  const result = task_announcement.data.rows.concat(done_tasks.data.rows);
  console.trace(result);
  res.status(200).json(result);
};

module.exports = {
  add_anounsment,
  set_task_done,
  anounsments,
  done,
  add_done,
  search,
  edite_done,
};
