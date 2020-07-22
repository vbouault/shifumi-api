const Games = require('../models/games.model.js');

class GamesController {
  static async create (req, res) {
    try {
        const newGame = await Games.create({ id_user1 :req.params.id });
        res.status(201).send(newGame);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred while creating the game.'
      });
    }
  }

  static async findNotStarted (req, res) {
    try {
      const data = await Games.findNotStarted()
      res.status(200).send(data)
    } catch (err) {
      console.error(err.message);
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred'
      });
    }
  }

  static async updateById (req, res) {
    try {
      const data = await Games.updateById(req.params.id, req.body.idUser2)
      res.status(200).send(data)
    } catch (err) {
      console.error(err.message);
      res.status(500).send({
        errorMessage: err.message || 'Some error occurred'
      });
    }
  }
}

module.exports = GamesController;