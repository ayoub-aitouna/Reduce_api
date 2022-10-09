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

router.post("/add_admin", add_admin);
