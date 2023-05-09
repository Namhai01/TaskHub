const express = require("express");
const router = express.Router();
const { CreateGroup, DelGroup, Adduser } = require("../Controller/Group");
const checkAuthentication = require("../Middleware/checkAuthen");
router.post("/create", checkAuthentication, CreateGroup);
router.post("/add", checkAuthentication, Adduser);
router.delete("/delete", checkAuthentication, DelGroup);
module.exports = router;
