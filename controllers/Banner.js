const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AddBanner = async (req, res) => {
    const { Baniere_ordre, Logo, Couverture, Offer, Adresse, Tel, statut } = req.body;
    const added_Activity = SqlQuery(`INSERT INTO banners 
    (Baniere_ordre, Logo, Couverture, Offer, Adresse, Tel, statut, created_date)
    VALUES ('${Baniere_ordre}', '${Logo}', '${Couverture}', '${Offer}', 
    '${Adresse}', '${Tel}', '${statut}', NOW())`);
    if (!added_Activity.success)
        return res.status(500).json({
            err: added_Activity.data.err,
        });
    res.status(200).send({
        msg: `OK`,
    });
};



const UpdateBanner = async (req, res) => {
    const id = req.params.id;
    const { Baniere_ordre, Logo, Couverture, Offer, Adresse, Tel, statut } = req.body;
    const updated_querry = SqlQuery(`UPDATE banners SET
        Baniere_ordre = '${Baniere_ordre}', Logo = '${Logo}', Couverture = '${Couverture}',
        Offer = '${Offer}', Adresse = '${Adresse}', Tel = '${Tel}', statut = '${statut}'
        WHERE id = ${id}`);
    if (!updated_querry.success)
        return res.status(500).json({
            err: updated_querry.data.err,
        });
    if (added_Activity.data.affectedRows === 0)
        return res.status(404).json({ msg: "Banner not found" });
    res.status(200).send({
        msg: `OK`,
    });
}

const Banner = async (req, res) => {
    const banners = SqlQuery(`SELECT * FROM banners WHERE statut == 'activer' ORDER BY Baniere_ordre`);
    if (!banners.success)
        return res.status(500).json({
            err: banners.data.err,
        });
    res.status(200).json(banners.data.rows);
};


const Banners = async (req, res) => {
    const id = req.params.id;
    const banners = SqlQuery(`SELECT * FROM banners WHERE id = ${id}`);
    if (!banners.success)
        return res.status(500).json({
            err: banners.data.err,
        });
    res.status(200).json(banners.data.rows);
};

module.exports = {
    AddBanner,
    UpdateBanner,
    Banners,
    Banner
};
