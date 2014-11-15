'use strict';
var _ = require('lodash');

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
    data.name = socket.name || socket.id;
    games.active[data.gameId].players.forEach(function(player) {
      player.emit('msg' + data.gameId, data);
    });
  });

  socket.on('createNewGame', function() {
    var id = games.createNewGame(queue);
    games.active[id].players.push(socket);
    console.log('player: ' + socket.id + ' created game: ' + id);
    socket.emit('joinGame', {id: id});
  });

  socket.on('changeName', function(data) {
    console.log(socket.id + ': ' + data.name);
    this.name = data.name;
  });

  socket.on('joinGame', function(data) {
    if (games.active[data.gameId].players.indexOf(socket) !== -1) return socket.emit('error', {'msg': 'already joined that game'});
    games.active[data.gameId].players.push(socket);
    games.active[data.gameId].updatePlayerList();
    socket.emit('joinGame', {id: data.gameId});
  });

  socket.on('getPlayerList', function(data) {
    var players = _.map(games.active[data.gameId].players, function(player) {
      return {name: player.name, id: player.id};
    });
    socket.emit('updatePlayerList' + data.gameId, {players: players});
  });

  socket.on('updateGameList', function() {
    console.log('updating game list');
    games.updateGameList(socket);
  });

  socket.on('disconnect', function() {
    console.log('player :' + socket.id + ' disconnected');
    var gamesToRemove = findGames(games.active, socket.id);
    gamesToRemove.forEach(function(game) {
      game.players[socket.id] = null;
    });
  });
};
