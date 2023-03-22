const express = require("express");
const router = express.Router();
const { AddBanner, UpdateBanner, Banners, Banner } = require("../controllers/Banner");
router.get("/", Banner);
router.post("/", AddBanner);
router.get("/:id", Banners);
router.put("/:id", UpdateBanner);
module.exports = router;
