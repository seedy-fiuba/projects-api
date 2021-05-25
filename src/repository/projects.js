let Project = require('../model/projects');

const getProject = async () => {
	return await Project.find({});
};

const getProjectByid = async (id) => {
	return await Project.findById(id).exec();
};

const createProject = async (data) => {
	let newProject = new Project();
	newProject.title = data.title
	newProject.description = data.description
	newProject.category = data.category
	newProject.status = 'created'
	newProject.mediaUrls = data.mediaUrls
	newProject.targetAmount = data.targetAmount
	newProject.fundedAmount = 0.0
	newProject.location = {
		type: 'Point',
		coordinates: [data.location.x, data.location.y]
	}
	newProject.hashtags = data.hashtags

	let savedProject = await newProject.save();

	console.log('project created successfully\n' + savedProject)

	return savedProject;
};

const updateProject = async (id, name, description) => {
	let result = await Project.findByIdAndUpdate(id, {description: description}, {new: true});
	return result;
};

module.exports = {
	getProject,
	getProjectByid,
	createProject,
	updateProject
};