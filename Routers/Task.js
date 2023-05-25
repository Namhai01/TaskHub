const express = require("express");
const router = express.Router();
const checkAuthentication = require("../Middleware/checkAuthen");
const { getTask, addTask } = require("../Controller/Task");
router.get("/", checkAuthentication, getTask);
router.post("/addTask", checkAuthentication, addTask);
module.exports = router;
