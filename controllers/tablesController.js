const { Table } = require('../models/table');

exports.tables_get = async (req, res) => {
    Table.find({}, (err, tables) => {
        let tablesArr = [];

        tables.forEach(table => {
            tablesArr.push({ tableId: table._id, name: table.name, imgName: table.imgName })
        });

        res.send(tablesArr);
    });
}