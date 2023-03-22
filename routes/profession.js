const express = require("express");
const router = express.Router();
const {
    get_profesional,
    add_profesional
} = require("../controllers/profession");

router.get("/", get_profesional);
router.post("/", add_profesional);

module.exports = router;