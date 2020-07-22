const gamesController = require('../controllers/games.controller.js');
const router = require('express').Router();

router.post('/users/:id', gamesController.create);
router.get('/notStarted', gamesController.findNotStarted);
router.patch('/:id',  gamesController.updateById)

module.exports = router;
