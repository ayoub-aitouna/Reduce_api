const express = require("express");
const router = express.Router();
const {
  add_admin,
  remove_admin,
  get_admins,
  Response_partner_form,
  get_partners,
  get_modify_history,
} = require("../controllers/Admin.js");

router.post("/add_admin", add_admin);
router.post("/Remove_admin", remove_admin);
router.get("/", get_admins);
router.get("/get_partners", get_partners);
router.post("/Response_partner_form", Response_partner_form);
router.post("/get_modify_history", get_modify_history);
module.exports = router;
