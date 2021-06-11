const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const playersController = require('../controllers/playersController');


// Get player list
// Required schema: jwt
router.get('/', auth, playersController.playerList_get);


// Register new player
// Required schema:
// {
//     name: String  REQUIRED
// }
router.post('/', auth, playersController.newPlayer_post);

// Delete Player
// Required Schema:
// {
//     playerId: String REQUIRED
// }
router.delete('/', auth, playersController.deletePlayer_delete);


module.exports = router;