let projectDB = require('../repository/projects');
let contractDB = require('../repository/contracts');
const validator = require('./validator');
const constants = require('../utils/constants');
const ControllerError = require('../exceptions/ControllerError');
const apiResponse = require('../utils/responses');
const metrics = require('datadog-metrics');

const getProject = async (req, res) => {
	let response = await projectDB.getProject();
	res.status(200).json(response);
};

const getProjectByid = async (req, res) => {
	let project = await projectDB.getProjectByid(req.params.id);
	if(!project) {
		throw new ControllerError(constants.error.NOT_FOUND, 'inexistent project');
	}

	res.status(200).json(project);
};

const createProject = async (req, res) => {
	let {value, error} = validator.createProject(req.body);
	if(error) {
		error.name = constants.error.BAD_REQUEST;
		throw error;
	}

	if (res.locals['ownerId']) {
		value.ownerId = res.locals.ownerId;
	} else if(value.ownerId <= 0) {
		return apiResponse.badRequest(res, 'ownerId empty, use a token from users or send an ownerId in the body');
	}

	if (value['reviewerId']) {
		value['status'] = constants.status.funding;
	} else {
		value['reviewerId'] = null;
		value['status'] = constants.status.created; //project created but sponsors cant start to fund it until it has a reviewer
	}

	value['currentStageId'] = value.stages[0].id;

	let project = await projectDB.createProject(value);

	metrics.increment('creation', 1, ['category:' + project['category'], 'ownerId:' + project['ownerId']]);
	metrics.increment('status', 1, ['status:' + project['status']]);

	const avgProjects = await projectDB.getAvgProjectsByUser();
	console.log(avgProjects[0]);
	metrics.gauge('avgPerUser', avgProjects[0]['projectAvgByUser']);

	res.status(200).json(project);
};

const updateProject = async (req, res) => {
	let {value, error} = validator.updateProject(req.body);
	if(error) {
		error.name = constants.error.BAD_REQUEST;
		throw error;
	}

	if(!(value['title'] || value['description'] || value['category'] || value['mediaUrls'] || value['location'] || value['hashtags'] || value['reviewerId'] || value['currentStageId'] || value['status'] || value['walletId'] || value['missingAmount'])) {
		return apiResponse.badRequest(res, 'at least one field is required to update');
	}

	if(value['status'] && !Object.values(constants.status).includes(value['status'])) {
		return apiResponse.badRequest(res, 'Invalid status. Valid stage statuses are: ' + Object.values(constants.status));
	}

	// If a reviewerId is set, then change the status of the project to inProgress so it can start to receive funds
	let oldProject = await projectDB.getProjectByid(req.params.id);
	if (!oldProject) {
		return apiResponse.notFoundResponse(res, 'inexistent project');
	}

	if (value['status'] !== oldProject['status']) {
		metrics.increment('status', 1, ['status:' + value.status]);
	}

	if (value['missingAmount']) {
		value['fundedAmount'] = oldProject['totalTargetAmount'] - value['missingAmount'];
	}

	const project = await projectDB.updateProject(req.params.id, value);

	res.status(200).json(project);
};

const searchProjects = async (req, res) => {
	let {value, error} = validator.searchProject(req['query']);
	if(error) {
		error.name = constants.error.BAD_REQUEST;
		throw error;
	}

	if(!(value['category'] || value['hashtags'] || value['status'] || value['locationX'] || value['locationY'] || value['ownerId'] || value['id'])) {
		return apiResponse.badRequest(res, 'A search criteria is required');
	}

	if(value['category']) {
		value['category'] = value['category'].split(',');
	}

	if(value['hashtags']) {
		value['hashtags'] = value['hashtags'].split(',');
	}

	if(value['id']) {
		value['id'] = value['id'].split(',').map(Number);
	}

	if((value['locationX'] && !value['locationY']) || (!value['locationX'] && value['locationY'])) {
		return apiResponse.badRequest(res, 'locationX and locationY are needed for location search');
	}

	let response = await projectDB.searchProjects(value);

	res.status(200).json({
		size: response.length,
		results: response
	});
};

const fundProject = async (req, res) => {
	let {value, error} = validator.createContract(req.body);
	if(error) {
		error.name = constants.error.BAD_REQUEST;
		throw error;
	}
	let contract = await contractDB.createContract(value);

	res.status(200).json(contract);
};

module.exports = {
	getProject,
	getProjectByid,
	createProject,
	updateProject,
	searchProjects,
	fundProject
};