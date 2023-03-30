const express = require("express");
const router = express.Router();
const checkAuthentication = require("../Middleware/checkAuthen");
const { userInfo, userChangeInfo } = require("../Controller/User");
router.get("/userinfo", checkAuthentication, userInfo);
router.post("/update", checkAuthentication, userChangeInfo);
module.exports = router;
