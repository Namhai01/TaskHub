const express = require('express');
const router = express.Router();
const checkAuthentication = require('../Middleware/checkAuthen');
const {addJod, getJod, updateJod} = require('../Controller/List');
router.post('/add',checkAuthentication, addJod);
router.get('/',checkAuthentication, getJod);
router.post('/update',checkAuthentication, updateJod);

module.exports = router;