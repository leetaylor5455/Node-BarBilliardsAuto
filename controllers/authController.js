const { Table } = require('../models/table');
const Game = require('../models/game');
const Joi = require('joi');
const bcrypt = require('bcrypt');

exports.login_post = async (req, res) => {
    // Joi
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find table
    let table = await Table.findOne({ _id: req.body.tableId });
    if (!table) return res.status(400).send('Invalid table or password');

    // Compare password
    const validPassword = await bcrypt.compare(req.body.password, table.password);
    if (!validPassword) return res.status(400).send('Invalid table or password');

    // Generate jwt
    const token = table.generateAuthToken();

    // Check if there is an existing game that isn't finished
    let game = await Game.findOne({ table: { _id: table._id, name: table.name }, isComplete: false });

    // If game in progress, send jwt and gameId
    if (game) return res.send({ jwt: token, gameId: game._id });

    // Send jwt only
    return res.status(200).send({ jwt: token });

}

function validate(req) {
    const schema = Joi.object({
        tableId: Joi.string().required(),
        password: Joi.string().min(8).max(255).required()
    });

    return schema.validate(req);
}