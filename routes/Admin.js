const express = require("express");
const router = express.Router();
const {
  add_admin,
  remove_admin,
  get_admins,
  Response_partner_form,
  get_partners,
  update_partner,
  get_modify_history,
  update_admin,
  Upload_C_PDF,
} = require("../controllers/Admin.js");

router.post("/add_admin", add_admin);
router.post("/Remove_admin", remove_admin);
router.get("/", get_admins);
router.get("/get_partners", get_partners);
router.post("/update_partner", update_partner);
router.post("/Response_partner_form", Upload_C_PDF, Response_partner_form);
router.get("/get_modify_history", get_modify_history);
router.post("/update_admin", update_admin);
module.exports = router;
