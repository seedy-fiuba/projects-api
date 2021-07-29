let Contract = require('../model/contract');


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
	createContract,
	getContracts
};