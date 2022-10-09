const express = require("express");
const router = express.Router();
const {
	does_partner_form_exits,
	partner_login,
	add_admin,
	admin_login,
	partner_Submit_form,
	ResendOTP,
	Verify_email,
} = require("../controllers/Auth");

//partner
router.post("/does_partner_form_exits", does_partner_form_exits);
router.post("/partner", partner_login);
router.post("/partner_Submit_form", partner_Submit_form);

//all
router.post("/Verify_email", Verify_email);
router.post("/ResendOTP", ResendOTP);

//admin
router.post("/admin", admin_login);

module.exports = router;
