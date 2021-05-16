const { Pool } = require('pg')

let config;

if (process.env.SCOPE === 'PROD'){
    config = {
        connectionString: process.env.DATABASE_URL,
        ssl: { // This is mandatory for the connection in heroku
            rejectUnauthorized: false
        }
    }
} else {
    config ={
        host: 'psql-container',
        user: 'postgres',
        password: 'postgres',
        database: 'firsttest',
        port: '5432'
    }
}

const pool = new Pool(config)


// pool.query('CREATE TABLE projects(\n' +
//     '    id SERIAL PRIMARY KEY,\n' +
//     '    name VARCHAR(256),\n' +
//     '    description TEXT\n' +
//     ');', (err, res) => {
//     console.log(err, res)
//     pool.end()
// })

const getProject = async (req, res) => {
    const response = await pool.query('SELECT * FROM projects');
    res.status(200).json(response.rows)
}

const getProjectByid = async (req, res) => {
    const response = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    res.status(200).json(response.rows)
}

const createProject = async (req, res) => {
    const {name , description} = req.body

    const response = await pool.query('INSERT INTO projects (name, description) VALUES ($1, $2)', [name, description]);
    console.log(response)
    res.status(200).json({
        message: "project added successfully",
        project: {name, description}
    })
}

const updateProject = async (req, res) => {
    const {name , description} = req.body

    const response = await pool.query('UPDATE projects SET name = $1, description = $2 WHERE id = $3', [name, description, req.params.id])
    res.status(200).json(response)
}

module.exports = {
    getProject,
    getProjectByid,
    createProject,
    updateProject
}