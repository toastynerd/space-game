'use strict';
var express = require('express');
var http = require('http');
var socket = require('socket.io');
var player = require('./lib/player');
var uuid = require('node-uuid');
var games = require('./lib/games');
var app = express();
var gameQueue = [];

app.use(express.static(__dirname + '/build'));

app.get('/api/games', function(req, res) {
  var gameIds = Object.keys(games.active);
  gameIds.splice(gameIds.indexOf('global'), 1);
  res.json({ids: gameIds});
});

var server = http.createServer(app);
var io = socket(server);

server.listen(3000, function() {
  console.log('server up');
});

io.on('connection', function(socket) {
  socket.id = uuid.v4();
  player(socket, games, gameQueue);
  games.updateGameList(socket);
  games.active.global.players.push(socket);
});

setInterval(function() {
  while (gameQueue.length > 0) {
    gameQueue.shift()();
  }
}, 1000);
