const gamesController = require('../controllers/games.controller.js');
const router = require('express').Router();

router.post('/users/:id', gamesController.create);
router.get('/notStarted', gamesController.findNotStarted);

module.exports = router;
