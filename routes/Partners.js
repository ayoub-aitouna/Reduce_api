const express = require("express");
const router = express.Router();
const { get_parner_data , get_sub} = require("../controllers/Partner");

router.get("/partner_data", get_parner_data, get_sub);
module.exports = router;
