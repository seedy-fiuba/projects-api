let projectDB = require('../repository/projects');
const validator = require('./validator');
const constants = require('../utils/constants');

// This is used just for testing
const setProjectDB = (repository) => {
	projectDB = repository;
};

const getProject = async (req, res) => {
	let response = await projectDB.getProject();
	res.status(200).json(response);
};

const getProjectByid = async (req, res) => {
	let project = await projectDB.getProjectByid(req.params.id);
	res.status(200).json(project);
};

const createProject = async (req, res) => {
	let {value, error} = validator.createProject(req.body);
	if(error) {
		error.name = constants.error.BAD_REQUEST;
		throw error;
	}

	let project = await projectDB.createProject(value);

	res.status(200).json(project);
};

const updateProject = async (req, res) => {
	let {value, error} = validator.updateProject(req.body);
	if(error) {
		error.name = constants.error.BAD_REQUEST;
		throw error;
	}

	const project = await projectDB.updateProject(req.params.id, value);

	res.status(200).json(project);
};

module.exports = {
	getProject,
	getProjectByid,
	createProject,
	updateProject,
	setProjectDB
};