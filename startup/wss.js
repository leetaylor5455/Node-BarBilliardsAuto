const WebSocket = require('ws');

module.exports = function(server) {
    const wss = new WebSocket.Server({ server:server });

    wss.on('connection', function connection(ws) {

        console.log('New connection.');
        ws.send('Connected.');
    
        ws.on('message', function incoming(message) {
          console.log('received: %s', message);
          ws.send(message);
        });
    });
}