let projectDB = require('../repository/projects');
const validator = require('./validator')
const constants = require('../utils/constants')
const apiResponse = require('../utils/responses')

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
	let {value, error} = validator.createProject(req.body)
	if(error) {
		error.name = constants.error.BAD_REQUEST
		throw error
	}

	let project = await projectDB.createProject(value);

	res.status(200).json(project);
};

const updateProject = async (req, res) => {
	let {value, error} = validator.updateProject(req.body)
	if(error) {
		error.name = constants.error.BAD_REQUEST
		throw error
	}

	const project = await projectDB.updateProject(req.params.id, value);

	res.status(200).json(project);
};

const searchProjects = async (req, res) => {
	console.log(req['query'])

	// ToDo add validator, not every field is admisible for search
	let {value, error} = validator.searchProject(req['query'])
	if(error) {
		error.name = constants.error.BAD_REQUEST
		throw error
	}

	console.log(value)

	if(value['category']) {
		value['category'] = value['category'].split(',');
	}

	if(value['hashtags']) {
		value['hashtags'] = value['hashtags'].split(',');
	}

	if((value['locationX'] && !value['locationY']) || (!value['locationX'] && value['locationY'])) {
		return apiResponse.badRequest(res, "locationX and locationY are needed for location search")
	}

	let response = await projectDB.searchProjects(value);
	res.status(200).json({
		size: response.length,
		results: response
	});
};

module.exports = {
	getProject,
	getProjectByid,
	createProject,
	updateProject,
	searchProjects,
	setProjectDB
};