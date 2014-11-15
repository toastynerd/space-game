'use strict';
var uuid = require('node-uuid');
var _ = require('lodash');

var Game = function(id) {
  this.players = []; 
  this.id = id;
};

Game.prototype.updatePlayerList = function() {
  var players = _.map(this.players, function(player) {
    return {name: player.name, id: player.id};
  });
  this.players.forEach(function(player) {
    console.log('emit to: ' + player.id);
    player.emit('updatePlayerList', {players: players});
  });
};

module.exports = {
  active: {
    global: new Game('global')  
  },

  createNewGame: function(queue) {
    var newId = uuid.v4();
    var self = this;
    this.active[newId] = new Game(newId);
    queue.push(function() { 
      var that = self;
      that.updateGameList();
     });
    return newId;
  },

  updateGameList: function(player) {
    var keys = Object.keys(this.active);
    keys.splice(keys.indexOf('global'), 1);
    if (player) {
      console.log('player initialized game update: ' + player.id);
      return player.emit('gameListUpdate', {ids: keys});
    }
    this.active.global.players.forEach(function(player) {
      player.emit('gameListUpdate', {ids: keys});
    });
  }
};
