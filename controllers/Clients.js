const { Mysql, SqlQuery, SqlSqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
const { Encrypte, compare } = require("../Utils/Crypto");
require("dotenv").config();
const Log = require("../log");
const { promises } = require("nodemailer/lib/xoauth2/index.js");

//Update a Client
const update_client = async (req, res) => {
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${req.params.id}`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows
        if (rows.length === 0)
            return res.status(404).json({ msg: "Client not found" });
        const { full_name, birth_date, sexe, ville, adresse, profession,
            tel, email, abonnement,
            date_inscription, date_debut_abonnement,
            date_fin_abonnement } = req.body;
        // Validate required fields
        if (!full_name || !email) {
            return res.status(400).json({ msg: "Please provide all required fields" });
        }
        // Update client in database
        result = await SqlQuery(
            `UPDATE client SET full_name = '${full_name}', birth_date = '${birth_date}',
            sexe = '${sexe}', ville = ${ville}, adresse = '${adresse}', profession = '${profession}',
            tel = '${tel}', abonnement = '${abonnement}',
            date_inscription = '${date_inscription}', date_debut_abonnement = '${date_debut_abonnement}',
            date_fin_abonnement = '${date_fin_abonnement}',
            WHERE id = ${req.params.id}`
        );
        if (!result.success)
            return res
                .status(500)
                .json({ err: `${result.data.err.sqlMessage}` });
        res.status(200).json({ msg: "Client updated" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
}

//change clinet password
const change_password = async (req, res) => {
    const { old_password, new_password } = req.body;
    let HashedPass = "";
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${req.params.id}`);
        if (!rows.success) throw new BadRequestError("user not found");
        rows = rows.data.rows
        if (rows.length === 0)
            return res.status(404).json({ msg: "Client not found" });
        try {
            HashedPass = await Encrypte(old_password);
        } catch (err) {
            console.log(err);
        }
        // Verify old password
        if (rows.data.rows[0] == undefined ||
            rows.data.rows.length == 0 ||
            !(await compare(password, rows.data.rows[0]._password))) {
            return res.status(400).json({ msg: "Old password is incorrect" });
        }

        // Update password in database
        const result = await SqlQuery(`UPDATE client SET _password = '${await Encrypte(new_password)}' WHERE id = ${req.params.id}`);
        if (!result.success)
            return res
                .status(500)
                .json({ err: `${result.data.err.sqlMessage}` });
        res.status(200).json({ msg: "Password updated" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
}

//get client by id
const get_client = async (req, res) => {
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${req.params.id}`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows
        if (rows.length === 0)
            return res.status(404).json({ msg: "no clients" });
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
}

//get client by id
const get_all_client = async (req, res) => {
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE statut != 'Archivé'`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows;
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
}

//reset Device Id
const setDeviceId = async (req, res) => {
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${req.params.id}`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows
        const { device_id } = req.body;

        if (rows.length === 0) {
            return res.status(404).json({ msg: "Client not found" });
        }
        // Reset the device ID for the client
        const result = await SqlQuery(`UPDATE client SET device_id = '${device_id}' WHERE id  = ${req.params.id}`);
        if (!result.success)
            return res
                .status(500)
                .json({ err: `${result.data.err.sqlMessage}` });
        res.status(200).send({
            msg: "Device ID reset successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
}
const decipher = (encrypted) => {
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// change client status
const change_status = async (req, res) => {
    const { statut } = req.body;
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${req.params.id}`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows
        if (rows.length === 0)
            return res.status(404).json({ msg: "Client not found" });
        if (statut !== "Activé" && statut !== "Desactivé" && statut !== "Archivé")
            return res.status(400).json({ msg: "Statut must be 'Activé' or 'Desactivé' or Archivé" });
        // Update client in database
        const result = await SqlQuery(`UPDATE client SET statut = '${statut}' WHERE id = ${req.params.id}`);
        if (!result.success)
            return res
                .status(500)
                .json({ err: `${result.data.err.sqlMessage}` });
        res.status(200).send({
            msg: "OK",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
}

const checkSubsription = (id) => {
    return new promises(async (res, rej) => {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = '${id}' AND abonnement = 'Abonne' AND date_fin_abonnement > NOW()`);
        if (!rows.success) res(false);
        if (rows.length === 0) res(false);
        res(true);
    });
}

const check_is_valide_qr = async (obj) => {
    return new promises(async (res, rej) => {
        let rows = await SqlQuery(`SELECT * FROM ${obj.is_main ? 'partner' : 'sub_partner'} WHERE id = '${id}'`);
        if (!rows.success) res(false);
        if (rows.length === 0) res(false);
        res(true);
    });
}

const scan = async (req, res) => {
    const { id } = req.user;
    const { qr_code, product, scan_time } = req.body;
    // {id: "partner/sub_partner__id" , is_main : true/false};
    const qr_obj = JSON.parse(decipher(qr_code));
    if (!('id' in qr_obj && 'is_main' in qr_obj))
        throw new BadRequestError(`QR Code not valide`);
    if (!(await checkSubsription(id)))
        throw new BadRequestError(`No subscription found for user with ID ${id}`);
    if (!(await check_is_valide_qr(qr_obj)))
        throw new BadRequestError(`QR Code not valide`);

    const result = await Query(
        `INSERT INTO scan_hsitory (partner_id, sub_partner_id, client_id, product, scan_time, created_date)
            VALUES (${qr_obj.is_main ? qr_obj.id : 0}, ${qr_obj.is_main ? 0 : qr_obj.id},
                '${id}', '${product}', '${scan_time}', NOW())`);
    if (!result.success)
        throw new BadRequestError(`${result.data.err.sqlMessage}`);
    res.status(200).json({
        partner_id: qr_obj.id,
        is_main: qr_obj.is_main
    });
}

module.exports = {
    get_all_client, update_client, change_password, get_client, setDeviceId, change_status, scan
};
