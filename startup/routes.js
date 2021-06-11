const express = require('express');
const tables = require('../routes/tablesRoute');
const players = require('../routes/playersRoute');
const auth = require('../routes/authRoute');
const games = require('../routes/gamesRoute');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
        res.header("Access-Control-Allow-Methods", "DELETE");
        next();
    });
    app.use(express.json());
    app.use('/api/tables', tables);
    app.use('/api/players', players);
    app.use('/api/auth', auth);
    app.use('/api/games', games);
}