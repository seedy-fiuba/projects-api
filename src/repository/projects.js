let Project = require('../model/projects');

const getProject = async () => {
	return await Project.find({});
};

const getProjectByid = async (id) => {
	return await Project.findById(id).exec();
};

const getAvgProjectsByUser = async () => {
	return Project.aggregate( [
		{
			$group: {
				_id: '$ownerId',
				count: { $sum: 1 }
			}
		},{
			$group: {
				_id: null,
				projectAvgByUser: { $avg: '$count'}
			}
		}
	]).exec();
};

const createProject = async (data) => {
	let newProject = new Project();
	newProject.title = data.title;
	newProject.description = data.description;
	newProject.category = data.category;
	newProject.status = data.status;
	newProject.currentStageId = data.stages[0].id;
	newProject.mediaUrls = data.mediaUrls;
	newProject.fundedAmount = 0.0;
	newProject.location = {
		type: 'Point',
		coordinates: [data.location.x, data.location.y]
	};
	newProject.hashtags = data.hashtags;
	newProject.stages = data.stages;
	newProject.ownerId = data.ownerId;
	newProject.reviewerId = data.reviewerId;
	newProject.finishDate = data.finishDate;
	newProject.totalTargetAmount = data.stages.map(s => s.targetAmount).reduce((acum, v) => acum + v);
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

	if (queryValues['id']) {
		query['_id'] = {$in: queryValues.id};
	}

	if (queryValues['status']) {
		query['status'] =  {$in: queryValues.status};
	}

	if (queryValues['ownerId']) {
		query['ownerId'] =  queryValues.ownerId;
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
	updateProject,
	getAvgProjectsByUser
};