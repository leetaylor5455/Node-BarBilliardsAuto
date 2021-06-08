const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Table login name and password -> jwt
router.post('/', authController.login_post);

module.exports = router;