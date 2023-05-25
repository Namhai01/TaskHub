const express = require("express");
const router = express.Router();
const {
  CreateGroup,
  DelGroup,
  Adduser,
  Deluser,
} = require("../Controller/Group");
const checkAuthentication = require("../Middleware/checkAuthen");
router.post("/create", checkAuthentication, CreateGroup);
router.post("/addUser", checkAuthentication, Adduser);
router.post("/deleteUser", checkAuthentication, Deluser);
router.delete("/delete", checkAuthentication, DelGroup);
module.exports = router;
