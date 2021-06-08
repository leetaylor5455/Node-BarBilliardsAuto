const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const gamesController = require('../controllers/gamesController');

// Open or join game
router.post('/', auth, gamesController.newGame_post);

// Add players
router.post('/addplayers', auth, gamesController.addPlayers_post);

// Next player
router.post('/nextplayer', auth, gamesController.nextPlayer_post);

module.exports = router;