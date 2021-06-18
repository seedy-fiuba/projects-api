'use strict';

const server = require('./server');
const metrics = require('datadog-metrics');

metrics.init({ host: 'myhost', prefix: 'projects.' });
server.connectMongoDB();
server.client.connect();

const PORT = process.env.PORT || 8080;

server.app.listen(PORT, () =>
	console.log('server is up')
);