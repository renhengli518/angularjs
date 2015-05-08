'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('invest', {
        url: '/invest',
        templateUrl: 'app/invest/invest.html',
        controller: 'InvestCtrl'
      });
  });
