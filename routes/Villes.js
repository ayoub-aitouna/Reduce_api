const express = require("express");
const router = express.Router();
const { AddVille, Villes, change_status } = require("../controllers/Ville");

router.post("/Add", AddVille);

router.get("/", Villes);

router.post("/change_status", change_status);
module.exports = router;
