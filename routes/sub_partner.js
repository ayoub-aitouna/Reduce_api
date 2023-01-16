const express = require("express");
const router = express.Router();
const { get, get_all, add, edit, remove,
    change_lock_status, change_password } 
    = require("../controllers/sub_partner");

router.get("/get_all", get_all);
router.get("/:id", get);
router.post("/add", add);
router.post("/edit", edit);
router.put("/change_lock_status", change_lock_status);
router.put("/change_password", change_password);
router.delete("/remove/:id", remove);
module.exports = router;
