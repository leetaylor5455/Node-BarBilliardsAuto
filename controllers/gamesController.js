const { Table } = require('../models/table');
const Game = require('../models/game');
const { Player } = require('../models/player');
const { Break } = require('../models/break');
const Joi = require('joi');
const bcrypt = require('bcrypt');


exports.startGame_post = async (req, res) => {
    // Validate request
    const { error } = validateStartGame(req.body);
    if (error) return res.status(400).send(error.message);

    // Find table
    const table = await Table.findOne({ _id: req.table._id }); // extracted from jwt
    if (!table) return res.status(400).send('Invalid table ID');

    // Check if game in progress exists on DB
    let game = await Game.findOne({ table: { _id: table._id, name: table.name }, isComplete: false });
    if (game) return res.status(400).send('Game already in progress on given table.');

    game = new Game({
        table: {
            name: table.name,
            _id: table._id
        }
    });

    for (var i = 0; i < req.body.length; i++) {
        // See if player exists on database
        let player = await Player.findOne({ _id: req.body[i].playerId });
        if (!player) return res.status(400).send('Player with given ID not found.');

        game.players.push(player);

        // Starting attributes
        game.players[i].breaks = [new Break()];
        game.players[i].isCurrent = false;
        game.players[i].score = 0;
    }

    game.players[0].isCurrent = true;
    await game.markModified('players');
    game = await game.save();

    return res.send(game._id);
}

exports.nextPlayer_post = async (req, res) => {
    // Validate request
    const { error } = validateNextPlayer(req.body);
    if (error) return res.status(400).send('Invalid request.');

    // Find game
    let game = await Game.findOne({ _id: req.body.gameId });
    if (!game) return res.status(400).send('Invalid game ID.');

    let players = game.players;

    for (var i = 0; i < players.length; i++) {

        let indexedPlayer = players[i];

        if (indexedPlayer.isCurrent) { // If current player is finishing their turn
            
            indexedPlayer.isCurrent = false;
            
            if (req.body.isFoulBreak) { // If break is foul
                indexedPlayer.breaks[0].isFoul = true; // Set most recent break to foul
                indexedPlayer.breaks.unshift(new Break()); // Add empty break
            
            } else if (req.body.isSafeBreak) { // If break is safe
                indexedPlayer.score += indexedPlayer.breaks[0].score; // Add current break's score to main
                indexedPlayer.breaks.unshift(new Break()); // Add empty break
            
            } else if (req.body.isBlackPin) { // If black pin
                indexedPlayer.score = 0; // Set score to 0
                indexedPlayer.breaks[0].isFoul = true; // Set most recent break to foul
                indexedPlayer.breaks.unshift(new Break()); // Add empty break
            }

            if (indexedPlayer == players[players.length-1]) { // If current player is last in array
                players[0].isCurrent = true;
                i = players.length; // exit
            } else {
                players[i+1].isCurrent = true;
                i = players.length; //exit
            }
        }
    }

    game.players = players;
    await game.save();
    return res.send(game);

}

exports.addPoints_post = async (req, res) => {
    // Validate request
    const { error } = validateAddPoints(req.body);
    if (error) return res.status(400).send('Invalid request.');

    // Find table
    let table = await Table.findOne({ _id: req.body.tableId });
    if (!table) return res.status(400).send('Invalid table');

    // Compare password
    const validPassword = await bcrypt.compare(req.body.password, table.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    // Find current game
    let game = await Game.findOne({ table: { _id: table._id, name: table.name }, isComplete: false });
    if (!game) return res.status(400).send('No game found.')

    if (game.isComplete) return res.status(400).send('Game is already finished.');

    // Find current player
    for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].isCurrent) {
            game.players[i].breaks[0].score += req.body.points; // Add points in request
        }
    }

    await game.save();
    return res.status(200).send(game.players);

}

exports.endGame_post = async (req, res) => {
    // Validate request
    const { error } = validateEndGame(req.body);
    if (error) return res.status(400).send('Invalid request.');

    let game = await Game.findOne({ _id: req.gameId });
    if (!game) return res.status(400).send('Invalid Game ID.');

    game.isComplete = true;
    await game.save();
    return res.status(200).send('Game finished.');
}

function validateStartGame(req) {

    const schema = Joi.array().items(Joi.object({ playerId: Joi.string() })).required()

    return schema.validate(req);
}

function validateNextPlayer(req) {
    const schema = Joi.object({
        gameId: Joi.string().required(),
        isFoulBreak: Joi.bool(),
        isSafeBreak: Joi.bool(),
        isBlackPin: Joi.bool()
    });

    return schema.validate(req);
}

function validateAddPoints(req) {
    const schema = Joi.object({
        tableId: Joi.string().required(),
        password: Joi.string().required(),
        points: Joi.number().min(10).max(400).required()
    });

    return schema.validate(req);
}

function validateEndGame(req) {
    const schema = Joi.object({
        gameId: Joi.string().required()
    });

    return schema.validate(req);
}