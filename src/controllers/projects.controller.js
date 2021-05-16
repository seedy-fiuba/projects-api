let projectDB = require('../repository/projects');

const setProjectDB = (repository) => {
    projectDB = repository
}

const getProject = async (req, res) => {
    let response = await projectDB.getProject()
    res.status(200).json(response)
}

const getProjectByid = async (req, res) => {
    let project = await projectDB.getProjectByid(req.params.id);
    res.status(200).json(project)
}

const createProject = async (req, res) => {
    const {name , description} = req.body

    let project = await projectDB.createProject(name,description);
    res.status(200).json({
        message: "project added successfully",
        project: project
    })
}

const updateProject = async (req, res) => {
    const {name , description} = req.body

    const response = await projectDB.updateProject(req.params.id, name, description)
    res.status(200).json(response)
}

module.exports = {
    getProject,
    getProjectByid,
    createProject,
    updateProject,
    setProjectDB
}