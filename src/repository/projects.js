let Project = require('../model/projects');

const getProject = async () => {
	let results = await Project.find({});
	return results;
};

const getProjectByid = async (id) => {
	return await Project.findById(id).exec();
};

const createProject = async (name, description) => {
	let newProject = new Project({ name: name, description: description });
	let savedProject = await newProject.save();

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