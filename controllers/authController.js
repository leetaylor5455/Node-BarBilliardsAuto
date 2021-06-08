const { Table } = require('../models/table');
const Joi = require('joi');
const bcrypt = require('bcrypt');

exports.login_post = async (req, res) => {
    // Joi
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find table
    let table = await Table.findOne({ name: req.body.name });
    if (!table) return res.status(400).send('Invalid table or password');

    // Compare password
    const validPassword = await bcrypt.compare(req.body.password, table.password);
    if (!validPassword) return res.status(400).send('Invalid table or password');

    // Return jwt
    const token = table.generateAuthToken();
    res.status(200).send(token);

}

function validate(req) {
    const schema = Joi.object({
        name: Joi.string().required(),
        password: Joi.string().min(8).max(255).required()
    });

    return schema.validate(req);
}