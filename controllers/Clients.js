const { Mysql, SqlQuery, SqlSqlQuery, runSql } = require("../database/index.js");
const { Encrypte, compare, cipher } = require("../Utils/Crypto");
require("dotenv").config();
const crypto = require('crypto');
const { BadRequestError } = require("../errors/index.js");
const {getOTPForEmail } = require("../Utils/OTP.js");
const { sendEmail } = require("../Utils/Mailer");

//Update a Client
const update_client = async (req, res) => {
    const { full_name, birth_date, sexe, ville, adresse, profession,
        tel, email, abonnement,
        date_inscription, date_debut_abonnement,
        date_fin_abonnement, admin } = req.body;

    let is_admin = admin === undefined ? true : false;
    const { id } = !is_admin ? req.user : req.body;
    console.log(id);
    try {
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
            date_fin_abonnement = '${date_fin_abonnement}'
            WHERE id = ${id}`
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
    const { id } = req.user;
    const { old_password, new_password } = req.body;
    let HashedPass = "";
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${id}`);
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
        const result = await SqlQuery(`UPDATE client SET _password = '${await Encrypte(new_password)}' WHERE id = ${id}`);
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

const reset_password = async (req, res) => {
	const { email, key, _password } = req.body;
	try {
        const value = getOTPForEmail(req, email);
        console.table([value, email]);
		if (!(value != null && value != undefined && value == key))
			return res.sendStatus(403);

		const update_client = SqlQuery(`update  client
            set _password = '${await Encrypte(_password)}'
            where email = '${email}'`);

		if (!update_client.success) {
			console.log(update_client.data.err.sqlMessage);
			return res.status(500).send({
				err: update_client.data.err.sqlMessage,
			});
		}
		res.status(200).send("ok!");
	} catch (err) {
		throw new BadRequestError(err);
	}
};

//get client by id
const get_client = async (req, res) => {
    const { id } = req.user;
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${id}`);
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
        let rows = await SqlQuery(`SELECT
            client.id,
            full_name ,
            birth_date ,
            sexe ,
            ville,
            adresse ,
            client.profession,
            tel ,
            email ,
            _password ,
            abonnement,
            device_id,
            statut,
            villes.ville_name,
            profession.profession,
            date_inscription ,
            date_debut_abonnement ,
            date_fin_abonnement
        FROM client
            inner join profession
                on profession.id = client.profession
            inner join villes
                on villes.id = ville
            WHERE statut != 'Archivé'`);
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
    const { id } = req.body;
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${id}`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows
        if (rows.length === 0) {
            return res.status(404).json({ msg: "Client not found" });
        }
        const result = await SqlQuery(`UPDATE client SET device_id = '' WHERE id  = ${id}`);
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
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ACCESS_TOKEN_SECRET);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// change client status
const change_status = async (req, res) => {
    const { id, statut } = req.body;
    try {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = ${id}`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows
        if (rows.length === 0)
            return res.status(404).json({ msg: "Client not found" });
        if (statut !== "Activé" && statut !== "Desactivé" && statut !== "Archivé")
            return res.status(400).json({ msg: "Statut must be 'Activé' or 'Desactivé' or Archivé" });
        // Update client in database
        const result = await SqlQuery(`UPDATE client SET statut = '${statut}' WHERE id = ${id}`);
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
    return new Promise(async (res, rej) => {
        let rows = await SqlQuery(`SELECT * FROM client WHERE id = '${id}' AND abonnement = 'Abonne' AND date_fin_abonnement > NOW()`);
        if (!rows.success) res(false);
        if (rows.length === 0) res(false);
        res(true);
    });
}

const check_is_valide_qr = async (obj) => {
    return new Promise(async (res, rej) => {
        let rows = await SqlQuery(`SELECT * FROM ${obj.is_main ? 'partner' : 'sub_partner'} WHERE id = '${obj.id}'`);
        if (!rows.success) res(false);
        if (rows.length === 0) res(false);
        res(true);
    });
}

const get_mainpartner_id = (id) => {
    return new Promise(async (res, rej) => {
        const result = await SqlQuery(`SELECT * from sub_partner where id = ${id}`);
        if (!result.success)
            throw new BadRequestError(`${result.data.err.sqlMessage}`);
        if (result.data.rows === 0)
            throw new BadRequestError(`no sub partner found`);
    });
}

function get_partner_info(id, is_main) {
    return new Promise(async (res, rej) => {
        const partner_feilds = `partner.id,
    avatar_Url,
	nome_entreprise,
	ville_name,
	activity_name`;

        let query = is_main ? `select ${partner_feilds}
		from partner inner join villes on
		villes.id = partner.ville INNER JOIN entrprise_activities on
		entrprise_activities.id = partner.activity_entrprise where partner.id = ${id}` :
            `SELECT sub_partner.id, partner.nome_entreprise, 
				sub_partner.sub_partner_Name as representant_entreprise, partner.avatar_Url, partner.img_cover_Url
				FROM sub_partner INNER JOIN partner on partner.id = sub_partner.partner_id
				WHERE sub_partner.id =${id}`
        const result = await SqlQuery(query);
        if (!result.success)
            throw new BadRequestError(`${result.data.err.sqlMessage}`);
        if (result.data.rows.length < 1)
            res({ name: '', img: '', activity: '' })
        let data = result.data.rows[0];
        console.log(data);
        res({ name: data.nome_entreprise, img: data.avatar_Url, activity: data.activity_name })
    });

}

const scan = async (req, res) => {
    const { id } = req.user;
    const { qr_code, product, scan_time } = req.body;
    // qr_obj : {id: "partner/sub_partner__id" , is_main : true/false};
    const qr_obj = JSON.parse(decipher(qr_code));
    console.log(qr_obj);
    if (!('id' in qr_obj && 'is_main' in qr_obj))
        throw new BadRequestError(`QR Code not valide`);
    if (!(await checkSubsription(id)))
        throw new BadRequestError(`No subscription found for user with ID ${id}`);
    if (!(await check_is_valide_qr(qr_obj)))
        throw new BadRequestError(`QR Code not valide`);

    const partner_id = qr_obj.is_main === false ? get_mainpartner_id(qr_obj.id) : qr_obj.id;

    const { name, img, activity } = await get_partner_info(partner_id, qr_obj.is_main);
    let query = qr_obj.is_main
        ? `INSERT INTO scan_hsitory (partner_id, statut, client_id, product, scan_time, created_date)
        VALUES (${qr_obj.id}, 'active', ${id}, '${product}', '${scan_time}', NOW())`
        :
        `INSERT INTO scan_hsitory (partner_id, sub_partner_id, statut, client_id, product, scan_time, created_date)
        VALUES  (${partner_id}, ${qr_obj.id}, 'active', ${id}, '${product}', '${scan_time}', NOW())`
    const result = await SqlQuery(query);
    if (!result.success)
        throw new BadRequestError(`${result.data.err.sqlMessage}`);
    res.status(200).json({
        partner_id: partner_id,
        is_main: qr_obj.is_main,
        img: img,
        activity: activity,
        name: name
    });
}

const scan_hoistroy = async (req, res) => {
    const { id } = req.user;
    const {days} = req.query;

    const query_filter_date = days !== undefined ? `AND scan_hsitory.created_date >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)` : '';
    try {
        let rows = await SqlQuery(`SELECT
        scan_hsitory.id,
        partner_id,
        client_id,
        partner.email,
        img_cover_Url,
        nome_entreprise,
        identificateur_entreprise,
        representant_entreprise,
        product,
        scan_time,
        rating
        FROM scan_hsitory
        inner join partner on partner_id = partner.id
        WHERE client_id = ${id} AND statut = 'active' ${query_filter_date}`);
        if (!rows.success) throw new BadRequestError(`${rows.data.err.sqlMessage}`);
        rows = rows.data.rows
        if (rows.length === 0)
            return res.status(404).json({ msg: "no clients history" });
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
}

const delete_history = async (req, res) => {
    const { idList } = req.body;
    let result = await SqlQuery(`UPDATE scan_hsitory SET statut = 'deleted' WHERE id IN (${idList.join(',')})`);
    if (!result.success) throw new BadRequestError(`${result.data.err.sqlMessage}`);
    res.status(200).send({
        msg: "OK",
    });
}

const save_rating = (id, client_id, email, _subject, serviceRating, communicationRating, recommendationRating) => {
    return new Promise(async (res, rej) => {
        const query = `INSERT INTO ratings 
		(partner_id,
		client_id,
		email,
		_subject,
		serviceRating,
		communicationRating,
		recommendationRating)
		VALUES
		(
			${id},
			${client_id},
			'${email}',
			'${_subject}',
			${serviceRating},
			${communicationRating},
			${recommendationRating}
		)`
        const result = await SqlQuery(query);
        if (!result.success)
            throw new BadRequestError(`${result.data.err.sqlMessage}`);
        res(result);
    });
}

const get_rating_avg = (id) => {
    return new Promise(async (res, rej) => {
        const query = `
		SELECT AVG(serviceRating) AS avg_rating,
		AVG(communicationRating) AS avg_communicationRating,
		AVG(recommendationRating) AS avg_recommendationRating
		FROM ratings
		WHERE partner_id = ${id};`
        const result = await SqlQuery(query);
        if (!result.success)
            throw new BadRequestError(`${result.data.err.sqlMessage}`);
        if (result.data.rows === 0)
            res(-1);
        else {
            const row = result.data.rows[0];
            const avg = (row.avg_rating + row.avg_communicationRating + row.avg_recommendationRating) / 3;
            res(avg);
        }
    });
}

const rating = async (req, res) => {
    const { id } = req.user;
    const { partner_id, email, _subject, serviceRating, communicationRating, recommendationRating } = req.body;
    await save_rating(partner_id, id, email, _subject, serviceRating, communicationRating, recommendationRating);
    let avg;
    try {
        avg = await get_rating_avg(partner_id);
    } catch (err) {
        throw new BadRequestError(`get_rating_avg err : ${err}`);
    }
    const qeury = `UPDATE partner SET rating = ${avg} WHERE id = ${partner_id}`;
    const updateResult = SqlQuery(qeury);
    if (!updateResult.success)
        return res.status(500).json({
            message: 'Error updating partner rating avg',
            error: updateResult.data.err.sqlMessage
        });
    res.status(200).json({
        message: 'partner rating avg updated',
        results: updateResult
    });
}


const contact_us = async (req, res) => {

    const { type, message } = req.body;
    const { id } = req.user;
    const query_res = await SqlQuery(`select * from client where id = ${id}`);
    if (!query_res.success) throw new BadRequestError(`err :${query_res.data.err.sqlMessage}`);
    if (query_res.data.rows.length === 0)
        return query_res.sendStatus(404);
    try {
        await sendEmail({
            subject: type,
            to: query_res.data.rows[0].email,
            text: message,
        });
    } catch (error) {
        res.sendStatus(500);
    }
    res.sendStatus(200);
}

module.exports = {
    get_all_client,
    update_client,
    change_password,
    get_client,
    setDeviceId,
    change_status,
    scan,
    scan_hoistroy,
    delete_history,
    rating,
    reset_password,
    contact_us
};
