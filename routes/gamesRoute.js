const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const gamesController = require('../controllers/gamesController');

// Open or join game

// Required schema:
// {}

router.post('/', auth, gamesController.newGame_post);

// Add players

// Required schema:
// {
//     "gameId": String, REQUIRED
//     ["name": String]  
// }

router.post('/addplayers', auth, gamesController.addPlayers_post);

// Next player
// Required schema:
// {
//     "gameId": String, REQUIRED
//     "isSafeBreak": Bool,
//     "isFoulBreak": Bool, AT LEAST 1
//     "isBlackPin": Bool
// }
//*
router.post('/nextplayer', auth, gamesController.nextPlayer_post);

// Add points (from table)

// Required Schema
// {
//     "tableId": String, REQUIRED
//     "password": String, REQUIRED 
//     "points": Number REQUIRED   
// }
router.post('/addpoints', gamesController.addPoints_post);

// End game

// Required schema
// {
//     "gameId": String, REQUIRED
// }
router.post('/endgame', auth, gamesController.endGame_post);

module.exports = router;