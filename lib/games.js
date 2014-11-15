'use strict';
var uuid = require('node-uuid');

module.exports = {
  active: {
    global: {
      players: []
    }
  },

  createNewGame: function(queue) {
    var newId = uuid.v4();
    var self = this;
    this.active[newId] = {players: []};
    queue.push(function() { 
      var that = self;
      that.updateGameList();
     });
    return newId;
  },

  updateGameList: function(player) {
    var keys = Object.keys(this.active);
    keys.splice(keys.indexOf('global'), 1);
    if (player) return player.emit('gameListUpdate', {ids: keys});
    this.active.global.players.forEach(function(player) {
      player.emit('gameListUpdate', {ids: keys});
    });
  }
};
