const express = require("express");
const router = express.Router();
const { AddVille, Villes, change_status, All_Villes } = require("../controllers/Ville");

router.post("/Add", AddVille);

router.get("/", Villes);
router.get("/All_Villes", All_Villes);

router.post("/change_status", change_status);
module.exports = router;
