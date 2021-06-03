'use strict';

const server = require('./server');

server.client.connect();

const PORT = process.env.PORT || 8080;

server.connectMongoDB();

server.app.listen(PORT, () =>
	console.log('server is up')
);