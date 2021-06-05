const Joi = require('joi');

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
		ownerId: Joi.number().greater(0),
		reviewerId: Joi.number().greater(0),
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
		location: Joi.object({
			x: Joi.number().required(),
			y: Joi.number().required(),
		}),
		hashtags: Joi.array().unique().items(Joi.string()),
		reviewerId: Joi.number().greater(0),
	});

	return schema.validate(data);
};

const searchProject = (data) => {
	const schema = Joi.object({
		status: Joi.string().min(3).max(255), //ToDo aca solo se deberian poder buscar status discretos
		category: Joi.string().min(3).max(255),
		locationX: Joi.number(),
		locationY: Joi.number(),
		hashtags: Joi.string().min(3).max(255),
	});

	return schema.validate(data);
};

module.exports = {
	createProject,
	updateProject,
	searchProject
};