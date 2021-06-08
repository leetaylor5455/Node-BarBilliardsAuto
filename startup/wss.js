const WebSocket = require('ws');

let wss;

const WSServer = (server) => {
    wss = new WebSocket.Server({ server:server });

    wss.on('connection', function connection(ws) {

        console.log('New connection.');
        ws.send('Connected.');
    
        ws.on('message', function incoming(message) {
          console.log('received: %s', message);
          ws.send(message);
        });
    });
}

const sendJSON = (json) => {
  wss.on('open', function open(ws) {
    ws.send(JSON.stringify(json));
  });
}

exports.WSServer = WSServer;
exports.sendJSON = sendJSON;