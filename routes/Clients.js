const express = require("express");
const router = express.Router();
const {
    get_all_client, update_client, change_password, get_client, setDeviceId, change_status
} = require("../controllers/Clients");

//Update a Client
router.put("/:id", update_client);
//change clinet password
router.put("/:id/change-password", change_password);
//get client by id
router.get("/:id", get_client);
//get all clients
router.get("/", get_all_client);
//reset Device Id
router.put("/:id/setDeviceId", setDeviceId);
// change client status
router.put("/:id/change_status", change_status);


module.exports = router;