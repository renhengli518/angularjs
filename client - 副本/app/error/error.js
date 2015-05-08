'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('error', {
        url: '/error',
        templateUrl: 'app/error/error.html',
        controller: 'ErrorCtrl'
      });
  });