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
  save_C_pdf,
  update_client_info,
} = require("../controllers/Admin.js");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/partners_contact_pdfs');
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + '.' + file.originalname.split('.')[1] + '.pdf';
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

router.post("/add_admin", add_admin);
router.post("/Remove_admin", remove_admin);
router.get("/", get_admins);
router.get("/get_partners", get_partners);
router.post("/update_partner", update_partner);
router.post("/Response_partner_form", upload.single('file'), save_C_pdf, Response_partner_form);
router.get("/get_modify_history", get_modify_history);
router.post("/update_admin", update_admin);
router.post("/update_client_info", update_client_info);
module.exports = router;
