const express = require("express");
const router = express.Router();
const checkAuthentication = require("../Middleware/checkAuthen");
const { getTask, addTask, DelTask } = require("../Controller/Task");
router.get("/", checkAuthentication, getTask);
router.post("/addTask", checkAuthentication, addTask);
router.post("/del", checkAuthentication, DelTask);
module.exports = router;
