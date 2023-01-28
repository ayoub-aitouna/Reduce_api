const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
const { Encrypte, compare } = require("../Utils/Crypto");

require("dotenv").config();
const Log = require("../log");

const add = async (req, res) => {
    const { id } = req.user;
    const { email, _password, sub_partner_Name, _status } = req.body;
    const sql = `INSERT INTO sub_partner (email, _password, partner_id,
        sub_partner_Name, _status) VALUES ('${email}',
        '${await Encrypte(_password)}', ${id}, '${sub_partner_Name}', '${_status === true ? "Unlocked" : "Blocked"}')`;
    const result = SqlQuery(sql);
    if (!result.success)
        return res.status(500).json({ message: 'Error adding sub_partner',
		 error: result.data.err.sqlMessage });
    res.status(201).json({ message: 'sub_partner added', results: result });
};

const get_all = (req, res) => {
    const { id } = req.user;
    const partner = SqlQuery(`select * from sub_partner`);
    if (!partner.success)
        throw BadRequestError(`couldn't retrive partners list ${partner.data.err.sqlMessage}`);
    if (partner.data.rows.length == 0)
        return res.status(404).send({ msg: `couldn't retrive partners cus list size = 0` });
    res.json(partner.data.rows);
};

const get = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM sub_partner WHERE id = ${id}`;
    const result = SqlQuery(sql);
    if (!result.success)
        return res.status(500).json({ message: 'Error fetching sub_partner', error: result.error });
    if (result.data.rows.length === 0)
        return res.status(404).json({ message: 'sub_partner not found' });
    res.status(200).json(result.data.rows[0]);
};



const edit = (req, res) => {
    const { id: partner_id } = req.user;
    const { id, email, sub_partner_Name, _status } = req.body;
    const sql = `UPDATE sub_partner SET email = '${email}',
        partner_id = '${partner_id}',
        sub_partner_Name = '${sub_partner_Name}', _status = '${_status === true ? "Unlocked" : "Blocked"}'
        WHERE id = ${id}`;
    const result = SqlQuery(sql);
    if (!result.success)
        return res.status(500).json({ message: 'Error updating sub_partner', error: result.data.err.sqlMessage });
    res.status(200).json({ message: 'sub_partner updated', results: result });
};

const remove = (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM sub_partner WHERE id = ${id}`;
    const result = SqlQuery(sql);
    if (!result.success)
        return res.status(500).json({ message: 'Error deleting sub_partner', error: result.data.err.sqlMessage });
    res.status(200).json({ message: 'sub_partner removed', results: result });
};

const change_lock_status = (req, res) => {
    const { id, _status } = req.body;
    const sql = `UPDATE sub_partner SET _status = '${_status === true ? "Unlocked" : "Blocked"}'
    WHERE id = ${id}`;
    const result = SqlQuery(sql);
    if (!result.success)
        return res.status(500)
            .json({ message: 'Error updating sub_partner status', error: result.data.err.sqlMessage });
    res.status(200).json({ message: 'sub_partner status updated', results: result });
};

const change_password = async (req, res) => {
    const { id, old_password, new_password } = req.body;
    const sql = `SELECT _password FROM sub_partner WHERE id = ${id}`;
    const result = SqlQuery(sql);

    if (!result.success) {
        return res.status(500).json({
            message: 'Error fetching sub_partner password',
            error: result.data.err.sqlMessage
        });
    }
    if (
        result.data.rows[0] == undefined ||
        result.data.rows.length == 0 ||
        !(await compare(old_password, result.data.rows[0]._password))
    ) {
        return res.status(401).json({ message: 'Old password does not match' });
    }
    const updateSql = `UPDATE sub_partner SET _password = ${await Encrypte(new_password)}
    WHERE id = ${id}`;
    const updateResult = SqlQuery(updateSql);
    if (!updateResult.success)
        return res.status(500).json({
            message: 'Error updating sub_partner password',
            error: updateResult.data.err.sqlMessage
        });
    res.status(200).json({
        message: 'sub_partner password updated',
        results: updateResult
    });
};

module.exports = {
    add, get, get_all, remove,
    change_lock_status, change_password, edit
};
