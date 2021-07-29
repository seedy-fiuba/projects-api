const Joi = require('joi');
const constants = require('../utils/constants');

const createProject = (data) => {
	const schema = Joi.object({
		title: Joi.string().min(3).max(255).required(),
		description: Joi.string().min(10).max(1024).required(),
		category: Joi.string().min(3).max(255).required(),
		mediaUrls: Joi.array().unique().items(Joi.string()).required(),
		stages: Joi.array().items(Joi.object({
			track: Joi.string().min(3).max(255).required(),
			targetAmount: Joi.number().greater(0).required()
		})).required(),
		location: Joi.object({
			x: Joi.number().required(),
			y: Joi.number().required(),
		}).required(),
		hashtags: Joi.array().unique().items(Joi.string()).required(),
		ownerId: Joi.number().greater(0).required(),
		reviewerId: Joi.number().greater(0).allow(null),
		finishDate: Joi.date().greater('now').required()
	});

	return schema.validate(data);
};

const updateProject = (data) => {
	const schema = Joi.object({
		title: Joi.string().min(3).max(255),
		description: Joi.string().min(10).max(1024),
		category: Joi.string().min(3).max(255),
		mediaUrls: Joi.array().unique().items(Joi.string()),
		status: Joi.string(),
		currentStageId: Joi.number(),
		location: Joi.object({
			x: Joi.number().required(),
			y: Joi.number().required(),
		}),
		hashtags: Joi.array().unique().items(Joi.string()),
		reviewerId: Joi.number(),
		walletId: Joi.number(),
		missingAmount:  Joi.number(),
		fundedAmount: Joi.number()
	});

	return schema.validate(data);
};

const searchProject = (data) => {
	const schema = Joi.object({
		status: Joi.string().valid(constants.status.created, constants.status.funding, constants.status.inProgress, constants.status.stagePendingReviewer, constants.status.pendingReviewer, constants.status.completed),
		category: Joi.string().min(3).max(255),
		locationX: Joi.number(),
		locationY: Joi.number(),
		ownerId: Joi.number().greater(0),
		hashtags: Joi.string().min(3).max(255),
		id: Joi.string().min(1)
	});

	return schema.validate(data);
};

const createContract = (data) => {
	const schema = Joi.object({
		projectId: Joi.number(),
		funderId: Joi.number().required(),
		currentFundedAmount: Joi.number().required(),
		txHash: Joi.string().required()
	});

	return schema.validate(data);
};

const searchContractsValidator = (data) => {
	const schema = Joi.object({
		'size': Joi.number(),
		'page': Joi.number(),
		'funderId': Joi.number()
	});
	return schema.validate(data);
};

module.exports = {
	createProject,
	updateProject,
	searchProject,
	createContract,
	searchContractsValidator
};