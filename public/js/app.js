'use strict'

var chat = angular.module('chat', [
  'ngRoute',
  'chatControllers',
  'chatServices'
])

chat.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/lobby.html',
        controller: 'lobbyCtrl'
      })
  }
])