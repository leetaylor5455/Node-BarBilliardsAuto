const express = require('express');
const router = express.Router();

const tablesController = require('../controllers/tablesController');

// Table login name and password -> jwt
router.get('/', tablesController.tables_get);

module.exports = router;