const express = require("express");
const router = express.Router();
const { get_parner_data } = require("../controllers/Parner.js");

router.get("/partner_data", get_parner_data);
