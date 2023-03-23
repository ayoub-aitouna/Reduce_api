const express = require("express");
const router = express.Router();
const { AddBanner, UpdateBanner, Banners, Banner , save_logo_cover} = require("../controllers/Banner");

const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const images_storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/imgs');
	},
	filename: function (req, file, cb) {
		const uniqueName = uuidv4() + '.' + file.originalname.split('.')[1];
		cb(null, uniqueName);
	}
});


const upload_images = multer({ storage: images_storage });

router.get("/", Banner);
router.post("/", upload_images.array('images', 2), save_logo_cover, AddBanner);
router.get("/:id", Banners);
router.put("/:id", upload_images.array('images', 2), save_logo_cover ,UpdateBanner);
module.exports = router;
