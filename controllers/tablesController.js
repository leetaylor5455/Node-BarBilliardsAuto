const { Table } = require('../models/table');

exports.tables_get = async (req, res) => {
    Table.find({}, (err, tables) => {
        let tablesMap = {};

        tables.forEach(table => {
            tablesMap[table.name] = table._id;
        });

        res.send(tablesMap);
    });
}