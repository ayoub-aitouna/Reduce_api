const express = require("express");
const router = express.Router();
const {
    get_all_client,
    update_client,
    change_password,
    get_client,
    setDeviceId,
    change_status,
    scan,
    scan_hoistroy,
    delete_history,
    rating,
    reset_password,
    contact_us
} = require("../controllers/Clients");

router.put("/", update_client);
router.get("/", get_client);
router.get("/all", get_all_client);
router.get("/scan_histroy", scan_hoistroy);
router.put("/change-password", change_password);
router.put("/setDeviceId", setDeviceId);
router.put("/change_status", change_status);
router.post("/scan", scan);
router.post("/rating", rating);
router.post("/contact_us", contact_us);
router.delete("/delete_history", delete_history);
router.put("/reset_password", reset_password);

module.exports = router;