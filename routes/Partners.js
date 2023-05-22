const express = require("express");
const router = express.Router();
const { get_parner_data,
    get_sub,
    change_password,
    history,
    locate,
    get_partners,
    get_recomandation,
    get_recent_partners,
    suggestions,
    Admin_get_history } = require("../controllers/Partner");

router.get("/", get_partners);
router.get("/recent_partners", get_recent_partners);
router.get("/recomandation", get_recomandation);
router.get("/partner_data", get_parner_data, get_sub);
router.get("/history", history);
router.post("/change_pass", change_password);
router.put("/locate", locate);
router.get("/suggestions", suggestions);
router.get("/Admin_get_history/:id", Admin_get_history);

module.exports = router;
