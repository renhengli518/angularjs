'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('rate', {
        url: '/rate',
        templateUrl: 'app/rate/rate.html',
        controller: 'RateCtrl'
      });
  });