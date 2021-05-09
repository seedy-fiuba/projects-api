var express = require("express");
var router = express.Router();
var { getProject } = require('../controllers/projects.controller')

router.get('/project', getProject)

module.exports = router;