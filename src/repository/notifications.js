const axios = require('axios');
const constants = require('../utils/constants');

const sendNotification = async (body) => {
	let config = {
		method: 'post',
		url: 'https://seedy-fiuba-users-api.herokuapp.com/notifications/',
		headers: {
			'Content-Type': 'application/json'
		},
		data : JSON.stringify(body)
	};

	return axios(config).then((response) => {
		return {
			message: 'ok',
			data: response.data
		};
	})
		.catch((error) => {
			if (error.response.status === 401) {
				return {
					message: constants.error.UNAUTHORIZED_ERROR
				};
			}

			return  {
				message: error.response.status,
				error: error.response.data
			};
		});
};

module.exports = {
	sendNotification
};