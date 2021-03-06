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

console.log(`Environment: ${process.env.NODE_ENV}`);

const port = process.env.PORT || 8080
server.listen(port, () => console.log(`Listening on port ${port}`));