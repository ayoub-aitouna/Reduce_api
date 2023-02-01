const express = require("express");
const router = express.Router();
const { get_parner_data , get_sub, change_password} = require("../controllers/Partner");

router.get("/partner_data", get_parner_data, get_sub);
router.post("/change_pass", change_password);

module.exports = router;
