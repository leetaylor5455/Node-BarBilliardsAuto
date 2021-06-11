const socketIo = require('socket.io');
const Game = require('../models/game');

exports.socket = function(server) {
    const io = socketIo(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    let interval;

    io.on('connection', (socket) => {
        console.log('New client connection.');

        const gameId = socket.handshake.query.data;

        // Routine polling of db to get data
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => getGameDataAndEmit(socket, gameId), 1000);
        socket.on('disconnect', () => {
            console.log('Client disconnected.');
            clearInterval(interval);
        });

    });

    const getGameDataAndEmit = async (socket, gameId) => {
        const game = await Game.findById(gameId);

        if (!game) return socket.emit('GameData', 'gameId invalid.');        
        return socket.emit('GameData', game);        
    }
}