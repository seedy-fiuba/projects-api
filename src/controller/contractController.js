let contractDB = require('../repository/contracts');
const validator = require('./validator');
const constants = require('../utils/constants');

const createContract = async (req, res) => {
	let {value, error} = validator.createContract(req.body);
	if(error) {
		error.name = constants.error.BAD_REQUEST;
		throw error;
	}
	value['projectId'] = req.params.id;
	let contract = await contractDB.createContract(value);

	res.status(200).json(contract);
};

const getContracts = async (req, res) => {
	let {value, error} = await validator.searchContractsValidator(req.query);
	if (error) {
		error.name = constants.error.BAD_REQUEST;
		throw error;
	}

	await contractDB.getContracts(value)
		.then((result) => {
			let bodyResponse = {
				totalItems: result.totalDocs,
				contracts: result.docs,
				totalPages: result.totalPages,
				currentPage: result.page - 1
			};

			return res.status(200).json(bodyResponse);
		}).catch((err) => {
			err.name = constants.error.UNEXPECTED_ERROR;
			throw error;
		});
};

module.exports = {
	createContract,
	getContracts
};