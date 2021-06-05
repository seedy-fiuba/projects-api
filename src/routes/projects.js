var express = require('express');
var router = express.Router();
let projectController  = require('../controller/projects.controller');

// ToDo cambiar a projects
router.get('/project', projectController.getProject);
router.get('/project/search', projectController.searchProjects);
router.get('/project/:id', projectController.getProjectByid);
router.post('/project', projectController.createProject);
router.put('/project/:id', projectController.updateProject);

module.exports = router;