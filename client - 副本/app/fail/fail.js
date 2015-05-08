'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('fail', {
        url: '/fail/:param/:respcode/:respdesc',
        templateUrl: 'app/fail/fail.html',
        controller: 'FailCtrl'
      });
  });