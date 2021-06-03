const axios = require('axios');
const constants = require('../utils/constants')

const authenticateToken = async (token) => {
    let config = {
        method: 'post',
        url: 'https://seedy-fiuba-users-api.herokuapp.com/auth/authenticate',
        headers: {
            'Content-Type': 'application/json'
        },
        data : JSON.stringify({"authToken":token})
    };

    return axios(config).then((response) => {
            return response.data
        })
        .catch((error) => {
            if (error.response.status === 401) {
                return {
                    message: constants.error.UNAUTHORIZED_ERROR
                }
            }

            return  {
                message: error.response.status,
                error: error.response.data
            }
        });
}

module.exports = {
    authenticateToken
}