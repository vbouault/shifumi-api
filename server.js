require('dotenv').config();
const express = require('express');
const cors = require('cors');
const extractToken = require('./middlewares/extractToken');
const Games = require('./models/games.model.js');

const app = express();
const PORT = process.env.PORT || (process.env.NODE_ENV === 'test' ? 3001 : 3000);

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', error => {
  console.log('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((err) => {
    if (err) console.error(JSON.stringify(err), err.stack);
  });
});

app.use(express.json());
app.use(cors());
app.use(extractToken);
app.use('/users', require('./routes/user.routes.js'));
app.use('/auth', require('./routes/auth.routes.js'));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something Broke!');
});
app.set('x-powered-by', false);

// set port, listen for requests
const server = app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

const io = require('socket.io').listen(server);

io.on('connect', async (socket) => {
  const games = await Games.findNotStarted()
  socket.emit('GameList', games);
  socket.on('newGame', async (id_user1) => {
    const newGame = await Games.create(id_user1)
    io.emit('reloadGames', newGame);
  })
  socket.on('updateGame', async (data) => {
    const game = await Games.updateById(data.id, data.id_user2);
    io.emit('reloadGamesUpdate', game);
  })
  socket.on('dataGame', async (id) => {
    const dataGame = await Games.findOneTwoUsers(id);
    socket.join(id);
    io.in(id).emit('reloadDataGame', dataGame)
  })
  socket.on('object', async (data) => {
    // console.log(data)
    let newData;
    if(data.pointUser1){
      newData = await Games.updateScore({id: data.id, pointUser1: data.pointUser1 })
    } else if (data.pointUser2) {
      newData = await Games.updateScore({id: data.id, pointUser2: data.pointUser2})
    }
    if(data.pointUser1){
      data = {...data, pointUser1 : newData.point_user1}
    } else if (data.pointUser2) {
      data = {...data, pointUser2 : newData.point_user2}
    }
    console.log(data)
    io.in(data.id).emit('reloadObject', data)
  })

});

module.exports = server;
