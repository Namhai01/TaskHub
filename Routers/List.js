const express = require("express");
const router = express.Router();
const checkAuthentication = require("../Middleware/checkAuthen");
const {
  addJod,
  getJod,
  updateJod,
  findJob,
  delJod,
} = require("../Controller/List");
router.post("/add", checkAuthentication, addJod);
router.get("/", checkAuthentication, getJod);
router.post("/update", checkAuthentication, updateJod);
router.post("/find", checkAuthentication, findJob);
router.post("/delete", checkAuthentication, delJod);
module.exports = router;
