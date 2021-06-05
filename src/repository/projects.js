let Project = require('../model/projects');
const constants = require('../utils/constants');

const getProject = async () => {
	return await Project.find({});
};

const getProjectByid = async (id) => {
	return await Project.findById(id).exec();
};

const createProject = async (data) => {
	let newProject = new Project();
	newProject.title = data.title;
	newProject.description = data.description;
	newProject.category = data.category;
	newProject.status = data.status;
	newProject.mediaUrls = data.mediaUrls;
	newProject.fundedAmount = 0.0;
	newProject.location = {
		type: 'Point',
		coordinates: [data.location.x, data.location.y]
	};
	newProject.hashtags = data.hashtags;
	data.stages.forEach(e => e.status = 'pending');
	newProject.stages = data.stages;
	newProject.ownerId = data.ownerId;
	newProject.reviewerId = data.reviewerId;
	newProject.finishDate = data.finishDate;

	console.log(newProject);

	let savedProject = await newProject.save();

	console.log('project created successfully\n' + savedProject);

	return savedProject;
};

const updateProject = async (id, newValues) => {

	if (newValues['location']) {
		newValues.location = {
			type: 'Point',
			coordinates: [newValues.location.x, newValues.location.y]
		};
	}

	let updatedProject = await Project.findByIdAndUpdate(id, newValues, {new: true});

	console.log('project updated successfully\n' + updatedProject);

	return updatedProject;
};

const searchProjects = async (queryValues) => {
	let query = {};

	if (queryValues['category']) {
		query['category'] =  {$in: queryValues.category};
	}

	if (queryValues['hashtags']) {
		query['hashtags'] =  {$in: queryValues.hashtags};
	}

	if (queryValues['status']) {
		query['status'] =  queryValues.status;
	}

	if (queryValues['locationX']) {
		query['location'] =  {
			$near: {
				$geometry: { type: 'Point',  coordinates: [ queryValues['locationX'], queryValues['locationY'] ] },
				// $minDistance: 1000, // ToDo definir esto
				$maxDistance: 5000 // ToDo defiinir esto
			}
		};
	}

	return Project.find(query);
};

module.exports = {
	getProject,
	getProjectByid,
	createProject,
	searchProjects,
	updateProject
};