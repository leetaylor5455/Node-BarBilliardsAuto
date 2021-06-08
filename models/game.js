const mongoose = require('mongoose');
const { playerSchema } = require('./player');
const { tableSchema } = require('./table');

const Game = mongoose.model('Game', new mongoose.Schema({
    table: tableSchema,
    players: [playerSchema],
    isComplete: { type: Boolean, default: false },
    winner: playerSchema
}));

module.exports = Game;