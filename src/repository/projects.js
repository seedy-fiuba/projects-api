let Project = require('../model/projects')

const getProject = async () => {
    throw new Error("implement me")
}

const getProjectByid = async (id) => {
    return await Project.findById(id).exec();
}

const createProject = async (name, description) => {
    let newProject = new Project({ name: name, description: description });
    let savedProject = await newProject.save();

    return savedProject
}

const updateProject = async (id, name, description) => {
    throw new Error("implement me")
    // return await pool.query('UPDATE projects SET name = $1, description = $2 WHERE id = $3', [name, description, id])
}

module.exports = {
    getProject,
    getProjectByid,
    createProject,
    updateProject
}