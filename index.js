const express = require('express');
const app = express();
const server = require('http').createServer(app);

require('./startup/db')();
require('./startup/routes')(app);
const { WSServer } = require('./startup/wss');
WSServer(server);



server.listen(8080, () => console.log('Listening on port 8080'));