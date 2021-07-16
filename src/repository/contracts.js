let Contract = require('../model/contract');
const { Pool } = require('pg');

let config;

if (process.env.SCOPE === 'PROD'){
	config = {
		connectionString: process.env.DATABASE_URL,
		ssl: { // This is mandatory for the connection in heroku
			rejectUnauthorized: false
		}
	};
} else {
	config ={
		host: 'psql-container',
		user: 'postgres',
		password: 'postgres',
		database: 'firsttest',
		port: '5432'
	};
}

const pool = new Pool(config);


// pool.query('CREATE TABLE projects(\n' +
//     '    id SERIAL PRIMARY KEY,\n' +
//     '    name VARCHAR(256),\n' +
//     '    description TEXT\n' +
//     ');', (err, res) => {
//     console.log(err, res)
//     pool.end()
// })

const getProject = async () => {
	const response = await pool.query('SELECT * FROM projects');
	return response.rows;
};

const getProjectByid = async (id) => {
	const response =  await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
	// ToDo chequear inexistencia
	return response.rows[0];
};

const createProject = async (name, description) => {
	await pool.query('INSERT INTO projects (name, description) VALUES ($1, $2)', [name, description]);
	return {
		project: {name, description}
	};
};

const updateProject = async (id, name, description) => {
	return await pool.query('UPDATE projects SET name = $1, description = $2 WHERE id = $3', [name, description, id]);
};


const createContract = async (data) => {
	let newContract = new Contract();
	newContract.projectId = data.projectId;
	newContract.funderId = data.funderId;
	newContract.currentFundedAmount = data.currentFundedAmount;
	newContract.txHash = data.txHash;

	console.log(newContract);

	let savedContract = await newContract.save();

	console.log('contract created successfully\n' + savedContract);

	return savedContract;
};

const getContracts = async (params) => {
	const limit = params.size ? + params.size : 10;
	const offset = params.page ? params.page * limit : 0;
	let query = {};

	if (params.funderId) {
		query.funderId = params.funderId;
	}

	return Contract.paginate(query, {offset: offset, limit: limit});
};

module.exports = {
	getProject,
	getProjectByid,
	createProject,
	updateProject,
	createContract,
	getContracts
};