const db = require('../db.js');

class Games {

  static async findOne (id) {
    return db.query('SELECT g.id, g.id_user1, g.id_user2, g.point_user1, g.point_user2, u.name FROM games g JOIN users u ON u.id = g.id_user1 WHERE g.id = ?', [id])
      .then(row => row[0] || null)
  }

  static async findOneTwoUsers (id) {
    return db.query('SELECT g.id, g.id_user1, g.id_user2, g.point_user1, g.point_user2, u.name AS name1, u2.name AS name2 FROM games g JOIN users u ON u.id = g.id_user1 JOIN users u2 ON u2.id = g.id_user2 WHERE g.id = ?', [id])
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

  static async updateById (id, idUser2) {
    return db.query(
      'UPDATE games SET id_user2 = ? WHERE id = ?',
      [idUser2, id]
    ).then(() => this.findOne(id));
  }

  static async updateScore (data) {
    let point = 0;
    let column = '';
    if(data.pointUser1) {
      point = data.pointUser1
      column = 'point_user1'
    } else if (data.pointUser2) {
      point = data.pointUser2
      column = 'point_user2'
    }
    return db.query(
      `UPDATE games SET ${column} = ? WHERE id = ?`,
      [point, data.id]
    ).then(() => this.findOne(data.id));
  }
}

module.exports = Games;