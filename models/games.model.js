const db = require('../db.js');

class Games {

  static async findOne (id) {
    return db.query('SELECT g.id, g.id_user1, g.id_user2, u.name FROM games g JOIN users u ON u.id = g.id_user1 WHERE g.id = ?', [id])
      .then(row => row[0] || null)
  }

  static async create (newGame) {
    return db.query('INSERT INTO games SET ?', [newGame])
      .then(res => {
        const data = this.findOne(res.insertId)
        return data;
      });
  }

  static async findNotStarted () {
    return db.query('SELECT g.id, g.id_user1, g.id_user2, u.name FROM games g JOIN users u ON u.id = g.id_user1 WHERE g.id_user2 IS NULL')
  }
}

module.exports = Games;