const Joi = require('joi');

const createProject = (data) => {
	const schema = Joi.object({
		title: Joi.string().min(3).max(255).required(),
		description: Joi.string().min(10).max(1024).required(),
		category: Joi.string().min(3).max(255).required(),
		mediaUrls: Joi.array().unique().items(Joi.string()).required(),
		targetAmount: Joi.number().greater(0).required(),
		location: Joi.object({
			x: Joi.number().required(),
			y: Joi.number().required(),
		}).required(),
		hashtags: Joi.array().unique().items(Joi.string()).required(),
	});

	return schema.validate(data);
};

const updateProject = (data) => {
	const schema = Joi.object({
		title: Joi.string().min(3).max(255).required(),
		description: Joi.string().min(10).max(1024).required(),
		category: Joi.string().min(3).max(255).required(),
		mediaUrls: Joi.array().unique().items(Joi.string()).required(),
		location: Joi.object({
			x: Joi.number().required(),
			y: Joi.number().required(),
		}).required(),
		hashtags: Joi.array().unique().items(Joi.string()).required(),
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