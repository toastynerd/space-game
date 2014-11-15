'use strict';

module.exports = function(app) {
  app.controller('homeCtrl', ['$scope', 'socket', '$http', '$location', function($scope, socket, $http, $location) {
    $scope.player = {};
    $scope.player.name = socket.name || '';
    socket.on('gameListUpdate', function(data) {
      $scope.games = data.ids;
    });

    socket.on('joinGame', function(data) {
      $location.path('/game_lobby/' + data.id);
    });

    $scope.changeName = function(name) {
      socket.name = name;
      socket.emit('changeName', {name: name});
    };

    $scope.createNewGame = function() {
      socket.emit('createNewGame', {});
    };

    $scope.joinGame = function(gameId) {
      socket.emit('joinGame', {gameId: gameId});
    };

    $scope.updateGameList = function() {
      socket.emit('updateGameList', {});
    };

    $scope.changeName = function() {
      socket.name = $scope.playerInfo.name;
      $scope.player.name = socket.name;
      socket.emit('changeName', {name: $scope.playerInfo.name});
    };
  }]);
};
