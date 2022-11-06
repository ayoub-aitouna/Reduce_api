const express = require("express");
const router = express.Router();
const { get_parner_data } = require("../controllers/Partner");

router.get("/partner_data", get_parner_data);
module.exports = router;
