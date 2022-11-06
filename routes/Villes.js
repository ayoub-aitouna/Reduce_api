const express = require("express");
const router = express.Router();
const { AddVille, Villes } = require("../controllers/Ville");
router.post("/Add", AddVille);
router.get("/", Villes);
module.exports = router;
