var express = require("express");
var router = express.Router();
var { getProject, getProjectByid, createProject, updateProject }  = require('../controller/projects.controller')

router.get('/project', getProject)
router.get('/project/:id', getProjectByid)
router.post('/project', createProject)
router.put('/project/:id', updateProject)

module.exports = router;