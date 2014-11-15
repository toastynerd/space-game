'use strict';

module.exports = function(app) {
  app.controller('gameLobbyCtrl', ['$scope', 'socket', '$http', '$location', function($scope, socket, $http, $location) {
    $scope.messages = [];
    var path = $location.path().split('/');
    $scope.gameId = path[path.length - 1];

    socket.emit('getPlayerList', {gameId: $scope.gameId});

    socket.on('updatePlayerList' + $scope.gameId, function(data) {
      console.log('update');
      console.log(data.players);
      $scope.playerList = data.players;
      $scope.$apply();
    });

    socket.on('msg' + $scope.gameId, function(data) {
      $scope.messages.push(data);
    });

    $scope.sendMessage = function() {
      $scope.message.gameId = $scope.gameId;
      socket.emit('msg', $scope.message);
    };
  }]);
};
