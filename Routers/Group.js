const express = require("express");
const router = express.Router();
const { CreateGroup, DelGroup } = require("../Controller/Group");
const checkAuthentication = require("../Middleware/checkAuthen");
router.post("/create", checkAuthentication, CreateGroup);
router.delete("/delete", checkAuthentication, DelGroup);
module.exports = router;
