'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiResponse = require('./utils/responses');
const constants = require('./utils/constants');
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
		console.error(err.stack);

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