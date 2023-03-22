const express = require("express");
const router = express.Router();
const { AddActivity, Activities} = require("../controllers/Activities");
router.post("/Add", AddActivity);
router.get("/", Activities);
router.get("/cities", get_cities);
router.get("/get_acviity_by_city", get_acviity_by_city);
router.post("/toggle_city", toggle_city);

module.exports = router;
