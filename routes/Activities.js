const express = require("express");
const router = express.Router();
const { AddActivity, EditActivity, Activities, get_cities, get_acviity_by_city, toggle_city , save_logo} = require("../controllers/Activities");


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

router.post("/Add", upload_images.array('images', 2), save_logo, AddActivity);
router.put("/edit", EditActivity);
router.get("/", Activities);
router.get("/cities", get_cities);
router.get("/get_acviity_by_city", get_acviity_by_city);
router.post("/toggle_city", toggle_city);

module.exports = router;
