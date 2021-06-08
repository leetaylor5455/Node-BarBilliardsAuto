const mongoose = require('mongoose');
const { breakSchema } = require('./break');

const playerSchema = new mongoose.Schema({
    name: String,
    score: Number,
    breaks: { type: [breakSchema], default: undefined },
    isCurrent: { type: Boolean, default: false }
});

const Player = mongoose.model('Player', playerSchema);

exports.Player = Player;
exports.playerSchema = playerSchema;