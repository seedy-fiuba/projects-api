'use strict';

const express = require('express');

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
const indexRouter = require("./routes/index");
const apiRouter = require('./routes/projects');

// App
const app = express();

// Middleware
app.use(express.json()) // parse application/json
app.use(express.urlencoded({extended: false})) // parse application/x-www-form-urlencoded

//Router prefix
app.use("/", indexRouter);
app.use("/api/", apiRouter);

app.get('/status', (req, res) =>
    client.query('SELECT NOW()', (err) => res.send({ service: 'UP', db: err ? 'DOWN' : 'UP' }))
);

module.exports = {
    app: app,
    client: client
};