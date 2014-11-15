'use strict';

var findGames = function(games, id) {
  var returnGames = [];
  var keys = Object.keys(games);

  for (var i = 0; i < keys.length; i++) {
    if (games[keys[i]].players[id]) {
      returnGames.push(games[keys[i]]);
    }
  }
  return returnGames;
};

module.exports = function(socket, games, queue) {
  socket.on('msg', function(data) {
    queue.push(function(data, games) {
      games[data.gameId].players.forEach(function(player) {
        if (player.id === data.playerId) return;
        player.socket.emit('msg', data);
      });
    });
  });

  socket.on('createNewGame', function() {
    var id = games.createNewGame(queue);
    console.log('player: ' + socket.id + ' created game: ' + id);
    socket.emit('joinGame', {id: id});
  });

  socket.on('changeName', function(data) {
    this.name = data.name;
  });

  socket.on('joinGame', function(data) {
    if (games.active[data.gameId].players.indexOf(socket) === -1) return socket.emit('error', {'msg': 'already joined that game'});
    games.active[data.gameId].players.push(socket);
  });

  socket.on('getPlayerList', function(data) {
    var keys = Object.keys(games.active[data.gameId].players);
    console.log(games.active[data.gameId])
    console.log(keys);
    socket.emit('updatePlayerList' + data.gameId, {ids: keys});
  });

  socket.on('disconnect', function() {
    console.log('player :' + socket.id + ' disconnected');
    var gamesToRemove = findGames(games.active, socket.id);
    gamesToRemove.forEach(function(game) {
      game.players[socket.id] = null;
    });
  });
};
