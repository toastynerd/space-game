'use strict';

module.exports = function(app) {
  app.controller('gameLobbyCtrl', ['$scope', 'socket', '$http', '$location', function($scope, socket, $http, $location) {
    var path = $location.path().split('/');
    $scope.gameId = path[path.length - 1];

    socket.emit('getPlayerList', {gameId: $scope.gameId});

    socket.on('updatePlayerList' + $scope.gameId, function(data) {
      console.log('player list!');
      $scope.playerList = data.ids;
    });
  }]);
};
