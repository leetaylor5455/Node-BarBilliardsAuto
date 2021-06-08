const express = require('express');
const tables = require('../routes/tablesRoute');
const auth = require('../routes/authRoute');
const games = require('../routes/gamesRoute');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/tables', tables)
    app.use('/api/auth', auth);
    app.use('/api/games', games);
}