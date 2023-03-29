const express = require("express");
const router = express.Router();
const {
    get_state
} = require("../controllers/State");

router.get("/", get_state);

module.exports = router;