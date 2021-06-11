const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const tableSchema = new mongoose.Schema({
    name: String,
    password: String,
    imgName: String
});

tableSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
}

const Table = mongoose.model('Table', tableSchema);

async function deleteAll() {
    await Table.deleteMany({});
}

exports.Table = Table;
exports.tableSchema = tableSchema;