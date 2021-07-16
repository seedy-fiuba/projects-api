var express = require('express');
var router = express.Router();
let projectController  = require('../controller/projects.controller');
let contractController = require('../controller/contractController');

// ToDo cambiar a projects
router.get('/project', projectController.getProject);
router.get('/project/search', projectController.searchProjects);
router.get('/project/:id', projectController.getProjectByid);
router.post('/project', projectController.createProject);
router.put('/project/:id', projectController.updateProject);
router.post('/project/:id/fund', contractController.createContract);
router.get('/contracts', contractController.getContracts);

module.exports = router;