require('angular/angular');
require('angular-route');

var clientApp = angular.module('clientApp', ['ngRoute']);

require('./services/socket')(clientApp);
require('./controllers/home_controller')(clientApp);

require('./games/controllers/game_lobby_controller')(clientApp);

clientApp.run(['$rootScope', 'socket', function($rootScope, socket) {
  $rootScope.errors = [];
  socket.on('error', function(data) {
    $rootScope.errors.push(data.msg);
  });

  $rootScope.removeError = function(error) {
    $rootScope.errors.splice($rootScope.errors.indexOf(error), 1);
  };
}]);

clientApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'views/home_view.html',
      controller: 'homeCtrl'
    })
    .when('/game_lobby/:id', {
      templateUrl: 'views/game_lobby_view.html',
      controller: 'gameLobbyCtrl'
    })
    .otherwise({
      redirectTo: '/home'
    });
}]);
