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

module.exports = {
	createContract
};