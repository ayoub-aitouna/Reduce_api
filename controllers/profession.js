const { Mysql, SqlQuery, SqlSqlQuery } = require("../database/index.js");
require("dotenv").config();
const { BadRequestError } = require("../errors/index.js");

const get_profesional = async (req, res) => {
    try {
        let rows = await SqlQuery(`SELECT * FROM profession`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
}

const add_profesional = async (req, res) => {
    const { profession } = req.body;
    try {
        let rows = await SqlQuery(`INSERT INTO profession
            (profession)
        VALUES
            ('${profession}')
        ;`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        res.status(200).json({
            msg: `ok`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
}

module.exports = {
    get_profesional,
    add_profesional
};