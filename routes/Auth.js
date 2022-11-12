const express = require("express");
const router = express.Router();
const {
  does_partner_form_exits,
  partner_login,
  admin_login,
  partner_Submit_form,
  ResendOTP,
  sendVeriifyOtp,
  Verify_email,
  reset_pass,
} = require("../controllers/Auth");

//partner
router.post("/partner", partner_login);
router.post(
  "/partner_Submit_form",
  does_partner_form_exits,
  partner_Submit_form
);

//all
router.post("/sendVeriifyOtp", sendVeriifyOtp);
router.post("/Verify_email", Verify_email);
router.post("/ResendOTP", ResendOTP);

//admin
router.post("/admin", admin_login);
router.post("/reset_pass", reset_pass);

module.exports = router;
