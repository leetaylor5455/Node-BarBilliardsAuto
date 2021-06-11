const { Player } = require('../models/player');
const Joi = require('joi');

const playerList_get = async (req, res) => {
    Player.find({}, (err, players) => {
        let playersArr = [];

        players.forEach(player => {
            playersArr.push({ playerId: player._id, name: player.name })
        });

        res.send(playersArr);
    });
}

exports.playerList_get = playerList_get;

exports.newPlayer_post = async (req, res) => {
    // Validate Request
    const { error } = validateNewPlayer(req.body);
    if (error) return res.status(400).send(error.message);

    let player = await Player.findOne({ name: req.body.name });
    if (player) return res.status(400).send('Player with this name already exists.');

    player = new Player({ name: req.body.name });
    await player.save();

    return playerList_get(req, res);
}

exports.deletePlayer_delete = async(req, res) => {
    // Validate request
    const { error } = validateDeletePlayer(req.body);
    if (error) return res.status(400).send(error.message);

    console.log(req.body.playerId);
    let player = await Player.findOne({ _id: req.body.playerId });
    if (!player) return res.status(400).send('Player with given ID not found.');

    await Player.findByIdAndDelete(player._id);

    return res.status(200).send('Player deleted.');
}

function validateNewPlayer(req) {
    const schema = Joi.object({
        name: Joi.string().required()
    });

    return schema.validate(req);
}

function validateDeletePlayer(req) {
    const schema = Joi.object({
        playerId: Joi.string().required()
    })

    return schema.validate(req);
}