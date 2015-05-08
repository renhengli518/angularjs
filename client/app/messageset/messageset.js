'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('messageset', {
        url: '/messageset',
        templateUrl: 'app/messageset/messageset.html',
        controller: 'MessagesetCtrl'
      });
  });