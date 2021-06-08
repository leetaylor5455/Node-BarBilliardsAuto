const { Table } = require('../models/table');
const Game = require('../models/game');
const { Player } = require('../models/player');
const { Break } = require('../models/break');
const Joi = require('joi');

exports.newGame_post = async (req, res) => {
    const table = await Table.findOne({ _id: req.table._id });

    let game;

    // Check if there is an existing game that isn't finished
    game = await Game.findOne({ table: { _id: table._id, name: table.name }, isComplete: false });

    // If existing game, sent its id
    if (game) return res.send(game);

    // If no existing game, create blank game on current table
    game = new Game({
        table: {
            name: table.name,
            _id: table._id
        }
    });
    game = await game.save();
    res.send(game._id);

}

exports.addPlayers_post = async (req, res) => {
    // Validate request
    const { error } = validateAddPlayers(req.body);
    if (error) return res.status(400).send('Invalid game.');

    // Find game
    let game = await Game.findOne({ _id: req.body.gameId });
    if (!game) return res.status(400).send('Invalid game ID.');

    if (game.players.length > 0) return res.status(400).send('Players already added.');

    for (var i = 0; i < req.body.players.length; i++) {
        // See if player exists on database
        let existingPlayer = await Player.findOne({ name: req.body.players[i].name });

        if (existingPlayer) {
            game.players.push(existingPlayer);
        } else {
            // If not, add new record (without breaks array since its stored as a static 'user')
            let newPlayer = new Player({ name: req.body.players[i].name });
            await newPlayer.save();
            game.players.push(newPlayer);
        }

        // Starting attributes
        game.players[i].breaks = [new Break()];
        game.players[i].isCurrent = false;
        game.players[i].score = 0;
    }

    game.players[0].isCurrent = true;
    await game.markModified('players');
    game = await game.save();

    return res.send(game);
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

function validateAddPlayers(req) {
    const schema = Joi.object({
        gameId: Joi.string().required(),
        players: Joi.array().items(Joi.object({ name: Joi.string() })).required()
    });

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