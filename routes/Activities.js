const express = require("express");
const router = express.Router();
const { AddActivity, Activities } = require("../controllers/Activities");
router.post("/Add", AddActivity);
router.get("/", Activities);
module.exports = router;
