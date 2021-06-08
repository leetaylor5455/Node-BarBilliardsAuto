const mongoose = require('mongoose');

const breakSchema = new mongoose.Schema({
    score: { type: Number, default: 0 },
    isFoul: { type: Boolean, default: false }
});

const Break = mongoose.model('Break', breakSchema);

exports.Break = Break;
exports.breakSchema = breakSchema;

