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
  sub_partner_login,
  client_login,
  new_client
} = require("../controllers/Auth");

//partner
router.post("/partner", partner_login, sub_partner_login);
router.post("/partner_Submit_form", does_partner_form_exits, partner_Submit_form);

//clients 
router.post("/client", client_login);
router.post("/new_client", new_client);

//all
router.post("/sendVeriifyOtp", sendVeriifyOtp);
router.post("/Verify_email", Verify_email);
router.post("/ResendOTP", ResendOTP);

//admin
router.post("/admin", admin_login);
router.post("/reset_pass", reset_pass);

module.exports = router;
