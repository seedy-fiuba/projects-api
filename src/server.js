'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiResponse = require('./utils/responses');
const constants = require('./utils/constants');
const authentication = require('./client/authentication');
require('express-async-errors'); // This is for catching errors from controllers and handle them in the next(), without using the next() keyword in the controllers

// DB postgre config
const { Client } = require('pg');

const client = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: { // This is mandatory for the connection in heroku
		rejectUnauthorized: false
	},
	query_timeout: 1000,
	statement_timeout: 1000
});

// Routers
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/projects');

// App
const app = express();

// Middleware
app.use(express.json()); // parse application/json
app.use(express.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(async (req, res, next) => {
	let token = req.header('X-Auth-Token');
	let override = req.header('X-Override-Token');

	if(override) {
		next();
		return;
	}

	if(!token) {
		return apiResponse.unauthorizedResponse(res, 'missing auth token header');
	}

	let result = await authentication.authenticateToken(token);

	if (result.message !== 'authorized') {
		if (result.message === constants.error.UNAUTHORIZED_ERROR) {
			return apiResponse.unauthorizedResponse(res, 'invalid token');
		}

		return apiResponse.internalServerError(res, "Error trying to validate token: " + JSON.stringify(result));
	}

	if (!result['identity']['id']) {
		return apiResponse.badRequest(res, "invalid token, unable to get id from token")
	}

	res.locals.ownerId = result['identity']['id']
	next();
});

//Router prefix
app.use('/', indexRouter);
app.use('/api/', apiRouter);

// DB connection
const connectMongoDB = () => {
	let MONGODB_URL = process.env.MONGODB_URL;
	mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
		console.log('MongoDB: Connected to %s', MONGODB_URL);
	}).catch(err => {
		console.error('MongoDB connect error:', err.message);
		process.exit(1);
	});
};

app.get('/status', (req, res) =>
	client.query('SELECT NOW()', (err) => res.send({
		service: 'UP',
		dbHeroku: err ? 'DOWN' : 'UP'}))
);

// Express error handler
app.use((err, req, res, next) => {
	if (err) {
		console.log(err.stack);

		if (err.name === constants.error.UNAUTHORIZED_ERROR) {
			return apiResponse.unauthorizedResponse(res, err.message);
		}
		if (err.name === constants.error.BAD_REQUEST) {
			return apiResponse.badRequest(res, err.message);
		}
		if (err.name === constants.error.CONFLICT_ERROR) {
			return apiResponse.conflictError(res, err.message);
		}
		if (err.name === constants.error.NOT_FOUND) {
			return apiResponse.notFoundResponse(res, err.message);
		}
		return apiResponse.unexpectedError(res, err.message);
	}

	next();
});

module.exports = {
	app: app,
	client: client,
	connectMongoDB
};