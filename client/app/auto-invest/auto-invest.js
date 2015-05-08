'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('auto-invest', {
        url: '/invest/auto',
        templateUrl: 'app/auto-invest/auto-invest.html',
        controller: 'AutoInvestCtrl'
      });
  });