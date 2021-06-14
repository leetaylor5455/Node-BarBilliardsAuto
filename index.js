const express = require('express');
const app = express();
const server = require('http').createServer(app);

// Serve images;
app.use('/api/images', express.static(__dirname + '/public'));

require('./startup/db')();
require('./startup/routes')(app);
const { socket } = require('./startup/socket');
socket(server);
require('./startup/prod')(app);



server.listen(8080, () => console.log('Listening on port 8080'));