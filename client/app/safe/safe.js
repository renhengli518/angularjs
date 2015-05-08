'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('safe', {
        url: '/safe',
        templateUrl: 'app/safe/safe.html',
        controller: 'SafeCtrl'
      });
  });